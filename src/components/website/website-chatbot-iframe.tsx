"use client";

import { useEffect, useState } from "react";

export const WEBSITE_CHATBOT_OPEN_EVENT = "wiiz:open-website-chatbot";

export default function WebsiteChatbotIframe() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);

    window.addEventListener(WEBSITE_CHATBOT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(WEBSITE_CHATBOT_OPEN_EVENT, handleOpen);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[90] md:bottom-6 md:right-6">
      {isOpen ? (
        <div className="h-[70vh] max-h-[680px] w-[calc(100vw-2rem)] max-w-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#120c12] shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Chat Agent</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
              aria-label="Close chat"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="h-[calc(100%-61px)]">
            <iframe
              src="https://hub.wiiz.it/aistudio/agent/chat/16802a64-618d-4c64-a6a5-ab4d588d8079"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Chat Agent"
              className="block h-full w-full border-0"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#912059] to-[#D87AAA] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(145,32,89,0.35)] transition-transform hover:scale-[1.02]"
          aria-label="Open chat"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat with us
        </button>
      )}
    </div>
  );
}
