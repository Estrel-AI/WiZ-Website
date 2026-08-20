"use client";

import "quill/dist/quill.snow.css";

import { useEffect, useRef } from "react";
import type Quill from "quill";
import { cn } from "@/src/lib/utils";

type AdminRichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
};

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "link"],
  [{ align: [] }],
  ["clean"],
];

const allowedFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "link",
  "align",
] as const;

function getHeaderLabel(value?: string) {
  if (value === "1") return "Heading 1";
  if (value === "2") return "Heading 2";
  if (value === "3") return "Heading 3";
  return "Paragraph";
}

function applyPickerLabels(root: HTMLElement) {
  const headerPicker = root.querySelector(".ql-picker.ql-header");
  if (headerPicker instanceof HTMLElement) {
    const headerLabel = headerPicker.querySelector(".ql-picker-label");
    if (headerLabel instanceof HTMLElement) {
      headerLabel.dataset.label = getHeaderLabel(headerLabel.dataset.value);
    }

    headerPicker.querySelectorAll(".ql-picker-item").forEach((item) => {
      if (item instanceof HTMLElement) {
        item.dataset.label = getHeaderLabel(item.dataset.value);
      }
    });
  }
}

export function AdminRichTextEditor({
  label,
  value,
  onChange,
  error,
  placeholder = "Write here...",
  className,
}: AdminRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const latestValueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  latestValueRef.current = value;
  onChangeRef.current = onChange;

  useEffect(() => {
    let active = true;
    let textChangeHandler: (() => void) | null = null;
    const editorElement = editorRef.current;

    async function setupEditor() {
      if (!editorElement || quillRef.current) {
        return;
      }

      const { default: QuillEditor } = await import("quill");
      if (!active) {
        return;
      }

      const quill = new QuillEditor(editorElement, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: toolbarOptions,
        },
        formats: [...allowedFormats],
      });

      applyPickerLabels(editorElement);

      quill.root.innerHTML = latestValueRef.current || "";
      textChangeHandler = () => {
        applyPickerLabels(editorElement);
        onChangeRef.current(quill.root.innerHTML);
      };

      quill.on("text-change", textChangeHandler);
      quillRef.current = quill;
    }

    void setupEditor();

    return () => {
      active = false;
      if (quillRef.current && textChangeHandler) {
        quillRef.current.off("text-change", textChangeHandler);
      }
      quillRef.current = null;
      if (editorElement) {
        editorElement.innerHTML = "";
      }
    };
  }, [placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) {
      return;
    }

    if (quill.root.innerHTML !== value) {
      quill.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="block">
      <div className="mb-1.5 block text-sm font-medium text-slate-700">{label}</div>
      <div
        className={cn(
          "rounded-[10px] border bg-white transition",
          error ? "border-rose-300" : "border-slate-200",
          className,
        )}
      >
        <div ref={editorRef} className="admin-quill-editor min-h-[260px]" />
      </div>
      {error ? <span className="mt-2 block text-xs text-rose-600">{error}</span> : null}
      <style jsx global>{`
        .admin-quill-editor > .ql-toolbar {
          border: 0;
          border-bottom: 1px solid #e2e8f0;
          font-family: inherit;
          background: #f8fafc;
          border-radius: 10px 10px 0 0;
          overflow: visible;
        }

        .admin-quill-editor > .ql-container {
          border: 0;
          font-family: inherit;
          font-size: 0.95rem;
          border-radius: 0 0 10px 10px;
          overflow: visible;
        }

        .admin-quill-editor .ql-picker {
          position: relative;
        }

        .admin-quill-editor .ql-picker-options {
          z-index: 30;
        }

        .admin-quill-editor .ql-picker.ql-header {
          min-width: 7.25rem;
        }

        .admin-quill-editor > .ql-toolbar .ql-picker.ql-header .ql-picker-label::before,
        .admin-quill-editor > .ql-toolbar .ql-picker.ql-header .ql-picker-item::before {
          content: attr(data-label) !important;
        }

        .admin-quill-editor .ql-editor {
          min-height: 260px;
          color: #0f172a;
          line-height: 1.75;
          padding: 1rem 1.1rem;
        }

        .admin-quill-editor .ql-editor h1 {
          font-size: 2rem;
          line-height: 1.25;
          font-weight: 700;
        }

        .admin-quill-editor .ql-editor h2 {
          font-size: 1.5rem;
          line-height: 1.35;
          font-weight: 700;
        }

        .admin-quill-editor .ql-editor h3 {
          font-size: 1.25rem;
          line-height: 1.4;
          font-weight: 600;
        }

        .admin-quill-editor .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
          left: 1.1rem;
          right: 1.1rem;
        }
      `}</style>
    </div>
  );
}
