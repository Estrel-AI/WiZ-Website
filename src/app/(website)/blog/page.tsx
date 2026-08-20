import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText } from "lucide-react";
import { listPublishedBlogs } from "@/src/lib/admin-blog";
import { stripHtml } from "@/src/lib/html-content";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

export const metadata: Metadata = buildWebsiteMetadata({
  title: { absolute: "Agentic AI Blog | Enterprise AI Trends & Expert Insights | WiiZ" },
  description: "Discover expert articles on Agentic AI, multi-agent systems, AI governance, observability, security, and enterprise AI adoption. Learn how organizations are transforming with AI-driven automation.",
  path: "/blog",
  image: websiteOgImages.blog,
});

function formatDate(dateString: string) {

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function getBlogImageUrl(filepath: string | null) {
  if (!filepath) {
    return null;
  }

  const [folder, fileName] = filepath.split("/");
  if (!folder || !fileName) {
    return null;
  }

  return `/api/media/${folder}/${fileName}`;
}

export default async function BlogPage() {
  try {
    const rows = await listPublishedBlogs();
    const featuredPost = rows[0] ?? null;
    const secondaryPosts = rows.slice(1);

    return (
      <main className="bg-primary text-white font-sans">
        <section className="bg-primary min-h-[60vh] flex items-center justify-center relative overflow-hidden px-4 py-10 md:py-20 font-sans">
          <div className="md:block hidden absolute top-1/2  left-0 -translate-y-1/2 -translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%] bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none  [-webkit-mask-image:radial-gradient(circle_at_center, quaternary_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="md:block hidden absolute top-1/2  right-0 -translate-y-1/2 translate-x-1/2 w-[160%] lg:w-[120%] xl:w-[90%] h-[100%]  bg-[url('/texture.svg')] bg-cover bg-center pointer-events-none [-webkit-mask-image:radial-gradient(circle_at_center,quaternary_0_0%,transparent_50%)] [mask-image:radial-gradient(circle_at_center,black_0%,transparent_50%)] z-0"></div>
        <div className="absolute -top-[250px] left-1/2 transform -translate-x-1/2 w-[600px] h-[500px] bg-gradient-about blur-[200px] rounded-full pointer-events-none"></div>
          <div className="relative mx-auto container text-center">
            <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              Blog
            </span>
            <h1 className="mt-6 max-w-4xl text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.1] font-semibold text-white mb-3 md:mb-6 tracking-tight md:px-10 mx-auto">
              Ideas, product notes, and practical AI stories from the WiiZ team.
            </h1>
            <p className="mt-5 text-base md:text-lg text-[#FDFDFD] max-w-4xl mx-auto md:px-16">
              Explore published posts from the admin panel in a website experience that matches the rest of the product theme.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-16 lg:py-16">
          <div className="mx-auto container px-0 sm:px-6 lg:px-8">
            {rows.length === 0 ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <FileText className="h-7 w-7 text-secondary" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold">No blog posts yet</h2>
                <p className="mt-3 text-white/70">Publish a post from the admin panel and it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {featuredPost ? (
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="group grid gap-6 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#180913_0%,#240d1a_55%,#3e1730_100%)] shadow-[0_30px_70px_rgba(0,0,0,0.28)] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
                  >
                    <div className="flex flex-col justify-between p-4 md:p-10">
                      <div>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1">
                            Featured story
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(featuredPost.updatedAt)}
                          </span>
                        </div>
                        <h2 className="mt-6 text-3xl font-semibold leading-tight text-white md:text-4xl">
                          {featuredPost.title}
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                          {featuredPost.shortDescription || stripHtml(featuredPost.content).slice(0, 220)}
                        </p>
                      </div>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                        Read article
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>

                    <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
                      {getBlogImageUrl(featuredPost.filepath) ? (
                        <img
                          src={getBlogImageUrl(featuredPost.filepath) ?? ""}
                          alt={featuredPost.title}
                          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-end bg-[radial-gradient(circle_at_top,#b94f83_0%,#4f1737_45%,#180913_100%)] p-8">
                          <div className="rounded-[1.5rem] border border-white/10 bg-black/15 px-5 py-4 backdrop-blur-sm">
                            <div className="text-xs uppercase tracking-[0.25em] text-secondary">WiiZ Blog</div>
                            <div className="mt-3 text-2xl font-semibold text-white">Fresh updates and practical thinking</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ) : null}

                {secondaryPosts.length ? (
                  <div>
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <h2 className="text-2xl font-semibold md:text-3xl">Latest Articles</h2>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {secondaryPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/blog/${post.slug}`}
                          className="group flex h-full flex-col overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.04] transition-transform duration-300 hover:-translate-y-1"
                        >
                          <div className="relative h-56 overflow-hidden bg-[linear-gradient(135deg,#3b1429_0%,#180913_100%)]">
                            {getBlogImageUrl(post.filepath) ? (
                              <img
                                src={getBlogImageUrl(post.filepath) ?? ""}
                                alt={post.title}
                                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-end p-6">
                                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80">
                                  Published
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(post.updatedAt)}
                            </div>
                            <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">
                              {post.title}
                            </h3>
                            <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                              {post.shortDescription || stripHtml(post.content).slice(0, 150)}
                            </p>
                            <div className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-secondary">
                              Explore post
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    return (
      <main className="bg-primary px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl md:rounded-3xl border border-rose-400/20 bg-rose-500/10 px-6 py-10 text-center">
          <h1 className="text-2xl font-semibold">Unable to load blog posts</h1>
          <p className="mt-3 text-white/70">
            {error instanceof Error ? error.message : "Unable to load blogs."}
          </p>
        </div>
      </main>
    );
  }
}
