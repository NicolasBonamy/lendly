export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex max-w-lg flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Lendly
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Gestion des prêts de matériel. La liste locale arrive sur la branche
          develop.
        </p>
      </main>
    </div>
  );
}
