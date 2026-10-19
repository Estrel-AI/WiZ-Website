"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

export type BlogImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string | null;
  alt?: string;
  title?: string;
};

export function BlogImageModal({
  isOpen,
  onClose,
  src,
  alt = "Blog image",
  title,
}: BlogImageModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted || !isOpen || !src) {
    return null;
  }

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || title || "Image preview"}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative max-h-[90vh] max-w-[95vw] md:max-w-5xl overflow-hidden rounded-2xl md:rounded-3xl border border-white/20 bg-[#120F1D] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex items-center justify-center my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background for the modal */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md shadow-lg transition-all hover:bg-black/95 hover:scale-105 hover:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Proper Image Display */}
        <img
          src={src}
          alt={alt || "Blog image"}
          className="relative z-10 block max-h-[85vh] max-w-[90vw] md:max-w-5xl w-auto h-auto object-contain select-none p-1 sm:p-2"
        />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export type BlogInteractiveImageProps = {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  aspectRatioClassName?: string;
};

export function BlogInteractiveImage({
  src,
  alt,
  title,
  className = "",
  aspectRatioClassName = "aspect-[16/10] sm:aspect-[16/9] md:aspect-[4/3] xl:aspect-[16/10]",
}: BlogInteractiveImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        aria-label={`Click to view full image: ${title || alt}`}
        className={`group relative w-full overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-secondary/70 ${aspectRatioClassName} ${className}`}
      >
        {/* Blurred ambient background to fill non-standard aspect ratios smoothly */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
        />

        {/* Sharp main image - responsive for all dimensions */}
        <img
          src={src}
          alt={alt}
          className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-secondary/70 aspect-[3/2] sm:aspect-[16/9] md:aspect-[4/3] xl:aspect-[16/10] md:self-center"
        />

        {/* Hover zoom badge */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur shadow-lg group-hover:bg-black/90 group-hover:border-secondary transition-all">
            <Maximize2 className="h-3.5 w-3.5 text-secondary" />
            <span>Click to expand</span>
          </span>
        </div>
      </div>

      <BlogImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={src}
        alt={alt}
        title={title || alt}
      />
    </>
  );
}

export function BlogArticleContent({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const [activeModalImage, setActiveModalImage] = useState<{ src: string; alt: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        const src = img.getAttribute("src");
        if (src) {
          e.preventDefault();
          setActiveModalImage({ src, alt: img.getAttribute("alt") || "Article image" });
        }
      }
    };

    container.addEventListener("click", handleImageClick);
    return () => container.removeEventListener("click", handleImageClick);
  }, [html]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <BlogImageModal
        isOpen={Boolean(activeModalImage)}
        onClose={() => setActiveModalImage(null)}
        src={activeModalImage?.src ?? null}
        alt={activeModalImage?.alt}
      />
    </>
  );
}

export function BlogCardThumbnail({
  src,
  alt,
  title,
  aspectRatioClassName = "aspect-[16/10]",
}: {
  src: string;
  alt: string;
  title?: string;
  aspectRatioClassName?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={`relative w-full ${aspectRatioClassName} overflow-hidden bg-black/40 group/thumb`}>
        {/* Ambient background for non-standard aspect ratios */}
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover blur-xl opacity-30 scale-105 pointer-events-none"
        />
        {/* Crisp main image */}
        <img
          src={src}
          alt={alt}
          className="relative z-10 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Zoom trigger */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`View full image for ${title || alt}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }
          }}
          className="absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur shadow-md opacity-90 sm:opacity-0 sm:group-hover/thumb:opacity-100 transition-all hover:bg-black/95 hover:border-secondary cursor-pointer"
        >
          <Maximize2 className="h-3 w-3 text-secondary" />
          <span>Zoom</span>
        </div>
      </div>

      <BlogImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={src}
        alt={alt}
        title={title || alt}
      />
    </>
  );
}
