import {
  clearLocalLoansAfterImport,
  type LocalLoan,
} from "@/lib/loans/localLoans";
import {
  dataUrlToBlob,
  isDataUrl,
  LOAN_PHOTOS_BUCKET,
  loanPhotoPath,
  SIGNED_URL_TTL_SECONDS,
} from "@/lib/loans/photos";
import type { Loan, LoanInput } from "@/lib/loans/types";
import {
  assertValidLoanInput,
  normalizeLoanInput,
} from "@/lib/loans/validation";
import { createClient } from "@/lib/supabase/client";
import type { LoanRow } from "@/lib/supabase/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database";

type BrowserSupabaseClient = SupabaseClient<Database>;

function getBrowserClient(): BrowserSupabaseClient {
  return createClient();
}

async function requireUserId(supabase: BrowserSupabaseClient): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Not authenticated");
  }
  return user.id;
}

function mapLoanRow(row: LoanRow, photoUrl: string | null): Loan {
  return {
    id: row.id,
    name: row.name,
    photoUrl,
    photoPath: row.photo_path,
    loanedAt: row.loaned_at,
    borrowerName: row.borrower_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function signedUrlsForPaths(
  supabase: BrowserSupabaseClient,
  paths: string[],
): Promise<Map<string, string>> {
  const urlByPath = new Map<string, string>();
  if (paths.length === 0) {
    return urlByPath;
  }

  const { data, error } = await supabase.storage
    .from(LOAN_PHOTOS_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  if (error || !data) {
    return urlByPath;
  }

  for (const item of data) {
    if (item.path && item.signedUrl) {
      urlByPath.set(item.path, item.signedUrl);
    }
  }
  return urlByPath;
}

async function uploadPhoto(
  supabase: BrowserSupabaseClient,
  path: string,
  dataUrl: string,
): Promise<void> {
  const blob = dataUrlToBlob(dataUrl);
  const { error } = await supabase.storage
    .from(LOAN_PHOTOS_BUCKET)
    .upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true,
    });
  if (error) {
    throw new Error(error.message);
  }
}

async function removePhoto(
  supabase: BrowserSupabaseClient,
  path: string,
): Promise<void> {
  const { error } = await supabase.storage
    .from(LOAN_PHOTOS_BUCKET)
    .remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}

async function resolvePhotoPath(
  supabase: BrowserSupabaseClient,
  userId: string,
  loanId: string,
  photoDataUrl: string | null,
  currentPath: string | null,
): Promise<string | null> {
  if (photoDataUrl === null) {
    if (currentPath) {
      await removePhoto(supabase, currentPath);
    }
    return null;
  }

  if (isDataUrl(photoDataUrl)) {
    const path = currentPath ?? loanPhotoPath(userId, loanId);
    await uploadPhoto(supabase, path, photoDataUrl);
    return path;
  }

  return currentPath;
}

async function withPhotoUrl(row: LoanRow): Promise<Loan> {
  const supabase = getBrowserClient();
  if (!row.photo_path) {
    return mapLoanRow(row, null);
  }
  const urls = await signedUrlsForPaths(supabase, [row.photo_path]);
  return mapLoanRow(row, urls.get(row.photo_path) ?? null);
}

export async function listLoans(): Promise<Loan[]> {
  const supabase = getBrowserClient();
  await requireUserId(supabase);

  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .order("loaned_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const paths = rows
    .map((row) => row.photo_path)
    .filter((path): path is string => Boolean(path));
  const urls = await signedUrlsForPaths(supabase, paths);

  return rows.map((row) =>
    mapLoanRow(row, row.photo_path ? (urls.get(row.photo_path) ?? null) : null),
  );
}

export async function getLoan(id: string): Promise<Loan | undefined> {
  const supabase = getBrowserClient();
  await requireUserId(supabase);

  const { data, error } = await supabase
    .from("loans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return undefined;
  }
  return withPhotoUrl(data);
}

export async function addLoan(input: LoanInput): Promise<Loan> {
  const normalized = normalizeLoanInput(input);
  assertValidLoanInput(normalized);

  const supabase = getBrowserClient();
  const userId = await requireUserId(supabase);
  const id = crypto.randomUUID();
  const photoPath = await resolvePhotoPath(
    supabase,
    userId,
    id,
    normalized.photoDataUrl,
    null,
  );

  const { data, error } = await supabase
    .from("loans")
    .insert({
      id,
      user_id: userId,
      name: normalized.name,
      photo_path: photoPath,
      loaned_at: normalized.loanedAt,
      borrower_name: normalized.borrowerName,
    })
    .select("*")
    .single();

  if (error || !data) {
    if (photoPath) {
      await supabase.storage.from(LOAN_PHOTOS_BUCKET).remove([photoPath]);
    }
    throw new Error(error?.message ?? "Unable to create loan");
  }

  return withPhotoUrl(data);
}

export async function updateLoan(
  id: string,
  input: LoanInput,
): Promise<Loan> {
  const normalized = normalizeLoanInput(input);
  assertValidLoanInput(normalized);

  const supabase = getBrowserClient();
  const userId = await requireUserId(supabase);

  const { data: existing, error: existingError } = await supabase
    .from("loans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }
  if (!existing) {
    throw new Error(`Loan not found: ${id}`);
  }

  const photoPath = await resolvePhotoPath(
    supabase,
    userId,
    id,
    normalized.photoDataUrl,
    existing.photo_path,
  );

  const { data, error } = await supabase
    .from("loans")
    .update({
      name: normalized.name,
      photo_path: photoPath,
      loaned_at: normalized.loanedAt,
      borrower_name: normalized.borrowerName,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update loan");
  }

  return withPhotoUrl(data);
}

export async function deleteLoan(id: string): Promise<void> {
  const supabase = getBrowserClient();
  await requireUserId(supabase);

  const { data: existing, error: existingError } = await supabase
    .from("loans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }
  if (!existing) {
    throw new Error(`Loan not found: ${id}`);
  }

  const { error } = await supabase.from("loans").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  if (existing.photo_path) {
    await supabase.storage
      .from(LOAN_PHOTOS_BUCKET)
      .remove([existing.photo_path]);
  }
}

export async function importLocalLoans(loans: LocalLoan[]): Promise<void> {
  for (const loan of loans) {
    await addLoan({
      name: loan.name,
      photoDataUrl: loan.photoDataUrl,
      loanedAt: loan.loanedAt,
      borrowerName: loan.borrowerName,
    });
  }
  clearLocalLoansAfterImport();
}
