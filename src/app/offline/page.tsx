"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { WifiOff, BookOpen } from "lucide-react";

export default function OfflinePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        ".offline-item",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-ds-bg flex items-center justify-center relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 ichimatsu-bg opacity-5 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-lg" ref={containerRef}>
        {/* Icon */}
        <div className="offline-item inline-flex items-center justify-center w-24 h-24 rounded-full bg-ds-surface border border-ds-red/30 mb-8 shadow-[0_0_40px_rgba(138,3,3,0.2)]">
          <WifiOff size={40} className="text-ds-red" />
        </div>

        {/* Title */}
        <h1 className="offline-item font-heading text-5xl md:text-6xl font-bold text-white mb-4 uppercase leading-tight">
          You're Offline
        </h1>

        {/* Katana divider */}
        <div className="offline-item flex items-center justify-center gap-3 my-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-ds-red"></div>
          <div className="w-2 h-2 bg-ds-red rotate-45"></div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-ds-red"></div>
        </div>

        <p className="offline-item text-gray-400 text-lg leading-relaxed mb-8">
          Your connection to the demon world has been severed. But fear not — any chapters you've previously loaded are still accessible.
        </p>

        <div className="offline-item space-y-4">
          <Link
            href="/chapters"
            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-ds-red hover:bg-red-800 rounded text-white font-bold transition-all shadow-[0_0_20px_rgba(138,3,3,0.4)] hover:shadow-[0_0_30px_rgba(138,3,3,0.6)]"
          >
            <BookOpen size={20} />
            Browse Cached Chapters
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-8 py-4 bg-ds-surface border border-white/10 hover:border-ds-green rounded text-gray-300 hover:text-white font-bold transition-all"
          >
            Try Reconnecting
          </button>
        </div>
      </div>
    </main>
  );
}
