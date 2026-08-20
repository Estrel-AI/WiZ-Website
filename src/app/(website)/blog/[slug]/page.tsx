import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getPublishedBlogBySlug } from "@/src/lib/admin-blog";
import { normalizeRichHtml, stripHtml } from "@/src/lib/html-content";
import { buildWebsiteMetadata, websiteOgImages } from "@/src/lib/website-og";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await getPublishedBlogBySlug(slug);

  if (!row) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const description = row.shortDescription || stripHtml(row.content).slice(0, 160);
  const imageUrl = getBlogImageUrl(row.filepath);

  return buildWebsiteMetadata({
    title: row.title,
    description,
    path: `/blog/${slug}`,
    image: imageUrl ? { url: imageUrl } : websiteOgImages.blog,
    type: "article",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await getPublishedBlogBySlug(slug);

  if (!row) {
    notFound();
  }

  const imageUrl = getBlogImageUrl(row.filepath);
  const contentHtml = normalizeRichHtml(row.content);

  return (
    <main className="bg-primary text-white font-sans">
      <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="absolute left-1/2 top-0 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#912059]/35 blur-[140px]" />
        <div className="relative mx-auto container px-0 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <article className="mt-10">
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Published
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(row.updatedAt)}
                </span>
              </div>
              <h1 className="mt-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">{row.title}</h1>
              {row.shortDescription ? (
                <p className="mt-6 text-lg leading-8 text-white/70 md:text-xl">
                  {row.shortDescription}
                </p>
              ) : null}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.04]">
              {imageUrl ? (
                <img src={imageUrl} alt={row.title} className="h-auto w-full" />
              ) : (
                <div className="flex min-h-[280px] items-end bg-[radial-gradient(circle_at_top,#b94f83_0%,#4f1737_45%,#180913_100%)] p-8 md:min-h-[380px]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/15 px-5 py-4 backdrop-blur-sm">
                    <div className="text-xs uppercase tracking-[0.25em] text-secondary">WiiZ Blog</div>
                    <div className="mt-3 text-2xl font-semibold text-white">{row.title}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-8 md:px-10 md:py-10">
              <div
                className="mx-auto text-base leading-8 text-white/80 [&>*+*]:mt-4 [&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify [&_.ql-align-right]:text-right [&_a]:text-white [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-white/25 [&_blockquote]:pl-4 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_p]:min-h-[1.75rem] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
