"use client";

export default function UseCaseLoading() {
  return (
    <main>
      <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-[#1a0f17] dark:text-slate-300">
        <div className="container mx-auto font-sans p-4 selection:bg-[#d63d75]/30 md:p-6 lg:p-10">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <div className="h-6 w-56 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="mb-8 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-white/10 dark:bg-gradient-to-b dark:from-[#2A1525] dark:to-[#1A0F17] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] lg:mb-10 lg:p-6">
            <div className="mb-4 h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="flex flex-nowrap gap-3 overflow-hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-40 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            <aside className="hidden w-full shrink-0 self-start md:block lg:sticky lg:top-[120px] lg:w-64">
              <div className="mb-4 h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-white/5"
                  />
                ))}
              </div>
            </aside>

            <section className="flex-1 space-y-10 md:space-y-12">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="h-7 w-64 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-5">
                    {Array.from({ length: 3 }).map((__, cardIndex) => (
                      <div
                        key={cardIndex}
                        className="h-52 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
