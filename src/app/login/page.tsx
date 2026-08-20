import { LoginForm } from "@/components/auth/LoginForm";
import { texts } from "@/lib/texts";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import Image from "next/image";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const configured = hasSupabaseEnv();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="m-0">
            <span className="sr-only">{texts.app.name}</span>
            <Image
              src="/icons/lendly_icon_light.png"
              alt=""
              width={699}
              height={690}
              priority
              unoptimized
              className="h-20 w-20 object-contain dark:hidden"
            />
            <Image
              src="/icons/lendly_icon_dark.png"
              alt=""
              width={722}
              height={717}
              priority
              unoptimized
              className="hidden h-20 w-20 object-contain dark:block"
            />
          </h1>
          <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {texts.auth.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {texts.auth.subtitle}
          </p>
        </div>
        {configured ? (
          <LoginForm callbackError={error === "auth"} />
        ) : (
          <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            {texts.auth.missingConfig}
          </p>
        )}
      </main>
    </div>
  );
}
