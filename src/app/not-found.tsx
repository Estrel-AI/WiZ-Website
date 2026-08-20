export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#110a10] px-6 py-24 text-white">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#D87AAA]">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300">
          The page you requested could not be found. If this happened after clicking
          a website link, the deployed server may not be routing that path correctly.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
