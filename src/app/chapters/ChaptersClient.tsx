'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { ArrowLeft, DownloadCloud } from 'lucide-react';

// ── Static chapter data injected from the server ─────────────────────────────
// This is loaded at module level so it's embedded in the JS bundle at build time.
// (Populated by the server wrapper below.)
interface ChapterData {
  slug: string;
  num: number;
  title: string;
  arc: string;
  thumb: string;
  folderName: string;
}

interface Props {
  arcGroups: { arc: string; chapters: ChapterData[] }[];
}

export default function ChaptersClient({ arcGroups }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  /* ── Staggered entrance animation ───────────────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      '.chapter-card',
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.03, duration: 0.5, ease: 'back.out(1.2)', clearProps: 'all' }
    );
    gsap.fromTo(
      '.arc-title',
      { x: -24, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
    );
  }, [search]);

  /* ── 3D tilt on hover ────────────────────────────────────────────────────── */
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el  = e.currentTarget;
    const r   = el.getBoundingClientRect();
    const rx  = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -8;
    const ry  = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  8;
    gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.25, ease: 'power1.out', transformPerspective: 900 });
  };
  const onLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' });
  };

  /* ── Filter ──────────────────────────────────────────────────────────────── */
  const q = search.toLowerCase();
  const filtered = arcGroups
    .map((g) => ({
      ...g,
      chapters: g.chapters.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.num.toString().includes(q) ||
          c.arc.toLowerCase().includes(q)
      ),
    }))
    .filter((g) => g.chapters.length > 0);

  return (
    <main className="min-h-screen bg-ds-bg pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6" ref={containerRef}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Chapter <span className="text-ds-primary-container">Archive</span>
              <span className="ml-3 text-lg font-light text-ds-text-dim align-middle normal-case tracking-normal">
                ({arcGroups.reduce((n, g) => n + g.chapters.length, 0)} scrolls)
              </span>
            </h1>
          </div>

          <input
            type="text"
            placeholder="Search chapters…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 bg-ds-surface-container border-b border-white/10 py-3 px-4
                       text-white placeholder-ds-text-dim/50 focus:outline-none focus:border-ds-primary-container transition-colors"
          />
        </div>

        {/* ── Arc groups ─────────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="space-y-16">
            {filtered.map((group) => (
              <section key={group.arc}>
                <h2 className="arc-title font-heading text-2xl md:text-3xl font-black text-white mb-8 pb-4 border-b border-ds-primary-container/20 uppercase tracking-tighter">
                  {group.arc}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                  {group.chapters.map((ch) => {
                    const thumbSrc = `/manga/Kimetsu_no_Yaiba/${encodeURIComponent(ch.folderName)}/${encodeURIComponent(ch.thumb)}`;

                    return (
                      <Link
                        key={ch.slug}
                        href={`/read/${ch.slug}`}
                        className="chapter-card group relative block overflow-hidden
                                   bg-ds-surface-low shadow-gloom
                                   hover:translate-y-[-4px]
                                   transition-all duration-300 cursor-pointer"
                        onMouseMove={onMove}
                        onMouseLeave={onLeave}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full aspect-[3/4] bg-black overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbSrc}
                            alt={`${ch.title} thumbnail`}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {/* Read Now badge */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-ds-primary-container/20 backdrop-blur-[2px]">
                            <span className="bg-white text-black text-[10px] font-black px-4 py-2 uppercase tracking-widest shadow-xl">
                              Read Now
                            </span>
                          </div>
                          {/* Chapter number badge */}
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-black/80 text-white text-[10px] font-black px-2 py-0.5 border border-white/10 uppercase tracking-tighter">
                              SCROLL {ch.num}
                            </span>
                          </div>
                          {/* Download button */}
                          <button
                            className="absolute top-2 right-2 z-10 text-ds-text-dim hover:text-white p-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Caching ${ch.title} for offline…`);
                            }}
                            title="Download for offline"
                          >
                            <DownloadCloud size={14} />
                          </button>
                        </div>

                        {/* Title */}
                        <div className="p-4 bg-ds-surface-low group-hover:bg-ds-surface-container transition-colors">
                          <p className="text-xs text-ds-text-dim font-bold leading-tight line-clamp-2 group-hover:text-white transition-colors uppercase tracking-tight">
                            {ch.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No chapters found for &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </main>
  );
}
