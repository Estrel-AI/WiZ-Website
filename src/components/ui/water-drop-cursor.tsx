"use client";

import { useEffect, useRef, useState } from "react";

interface WaterRipple {
  id: number;
  x: number;
  y: number;
}

export function WaterDropCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<WaterRipple[]>([]);
  const requestRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentFollower = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Enable custom cursor only on devices with fine pointer (mouse)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      targetPos.current = { x: event.clientX, y: event.clientY };
      setPosition({ x: event.clientX, y: event.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target element is clickable
      const target = event.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "TEXTAREA" ||
          target.onclick !== null ||
          target.getAttribute("role") === "button" ||
          target.closest("button") !== null ||
          target.closest("a") !== null;
        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      setIsPressed(true);
      const newRipple: WaterRipple = {
        id: Date.now() + Math.random(),
        x: event.clientX,
        y: event.clientY,
      };
      setRipples((prev) => [...prev.slice(-6), newRipple]);
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth physics loop for fluid follower drop
    const animate = () => {
      const dx = targetPos.current.x - currentFollower.current.x;
      const dy = targetPos.current.y - currentFollower.current.y;

      velocity.current.x = velocity.current.x * 0.7 + dx * 0.15;
      velocity.current.y = velocity.current.y * 0.7 + dy * 0.15;

      currentFollower.current.x += velocity.current.x;
      currentFollower.current.y += velocity.current.y;

      setFollowerPos({ x: currentFollower.current.x, y: currentFollower.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  // Remove ripples after animation duration
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (!isVisible) return null;

  // Calculate morph deformation speed from velocity
  const speed = Math.min(Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2), 25);
  const angle = Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI);

  return (
    <>
      <style jsx global>{`
        @media (pointer: fine) {
          body, a, button, input, select, textarea, [role="button"] {
            cursor: none !important;
          }
        }
        @keyframes waterRipple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.85;
            border-width: 3px;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
            border-width: 1px;
          }
        }
        @keyframes waterPulse {
          0%, 100% {
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          }
          50% {
            border-radius: 40% 60% 55% 45% / 55% 40% 60% 45%;
          }
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
        {/* Click Ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%)",
              animation: "waterRipple 800ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
            }}
            className="absolute rounded-full border border-cyan-400/80 bg-[#98235f]/10 backdrop-blur-xs shadow-[0_0_15px_rgba(230,143,23,0.5)]"
          />
        ))}

        {/* Fluid Follower Droplet Body */}
        <div
          className={`absolute flex items-center justify-center transition-all duration-75 ease-out ${
            isHovered
              ? "h-10 w-10 bg-white/20 backdrop-blur-md border border-white/60 shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_6px_25px_rgba(152,35,95,0.4)]"
              : isPressed
              ? "h-7 w-7 bg-cyan-200/30 backdrop-blur-md border border-white/80 shadow-[inset_0_2px_8px_rgba(255,255,255,1),0_4px_20px_rgba(230,143,23,0.5)]"
              : "h-8 w-8 bg-white/15 backdrop-blur-md border border-white/50 shadow-[inset_0_2px_5px_rgba(255,255,255,0.85),0_4px_16px_rgba(152,35,95,0.3)]"
          }`}
          style={{
            left: followerPos.x,
            top: followerPos.y,
            transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${
              isHovered ? 1.4 : isPressed ? 0.85 : 1 + speed * 0.012
            }, ${isHovered ? 1.4 : isPressed ? 0.85 : 1 - speed * 0.01})`,
            animation: "waterPulse 4s ease-in-out infinite",
          }}
        >
          {/* Inner Light Specular Highlight for Liquid Drop Refraction */}
          <span className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-white/80 blur-[0.5px]" />
          <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full bg-cyan-300/60 blur-[0.5px]" />
        </div>

        {/* Crisp Center Lucid Water Pinhead */}
        <div
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
          }}
          className={`absolute rounded-full transition-transform duration-100 ${
            isHovered ? "h-3 w-3 bg-[#E68F17] shadow-[0_0_10px_#E68F17]" : "h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
          }`}
        />
      </div>
    </>
  );
}
