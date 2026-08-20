export const LOAN_PHOTOS_BUCKET = "loan-photos";
export const SIGNED_URL_TTL_SECONDS = 60 * 60;

export function isDataUrl(value: string): boolean {
  return value.startsWith("data:");
}

export function isRemoteUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function loanPhotoPath(userId: string, loanId: string): string {
  return `${userId}/${loanId}.jpg`;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const match = /^data:([^;,]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid image data URL");
  }

  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}
