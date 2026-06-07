'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Home, Settings, ArrowLeft } from 'lucide-react';

interface Props {
  chapterTitle: string;
  chapterNum: number;
  imagePaths: string[];
  prevSlug: string | null;
  nextSlug: string | null;
}

export default function ReaderClient({
  chapterTitle,
  chapterNum,
  imagePaths,
  prevSlug,
  nextSlug,
}: Props) {
  const [progress, setProgress]       = useState(0);
  const [showNav, setShowNav]         = useState(true);
  const [pageNum, setPageNum]         = useState(1);
  const [imgWidth, setImgWidth]       = useState(800);
  const [showSettings, setShowSettings] = useState(false);

  const topNavRef  = useRef<HTMLElement>(null);
  const botNavRef  = useRef<HTMLElement>(null);
  const bladeRef   = useRef<HTMLDivElement>(null);
  const lastY      = useRef(0);
  const ticking    = useRef(false);

  const total = imagePaths.length;

  /* ── Progress bar & page counter ───────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const s   = document.documentElement;
          const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
          setProgress(Math.min(pct, 100));

          // Auto-hide nav on scroll down
          const y = window.scrollY;
          if (y > lastY.current + 50) {
            gsap.to(topNavRef.current, { y: '-110%', duration: 0.25, ease: 'power2.in' });
            gsap.to(botNavRef.current, { y: '110%',  duration: 0.25, ease: 'power2.in' });
          } else if (y < lastY.current - 20) {
            gsap.to(topNavRef.current, { y: '0%', duration: 0.25, ease: 'power2.out' });
            gsap.to(botNavRef.current, { y: '0%', duration: 0.25, ease: 'power2.out' });
          }
          lastY.current  = y;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── IntersectionObserver for lazy loading + page counter ──────────────── */
  useEffect(() => {
    const imgs = document.querySelectorAll<HTMLImageElement>('.ds-panel');

    // Lazy load
    const lazyIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const img = e.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset['src'];
            }
            img.classList.add('ds-loaded');
            lazyIO.unobserve(img);
          }
        });
      },
      { rootMargin: '600px 0px' }
    );

    // Page counter
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt((e.target as HTMLElement).dataset.idx ?? '0', 10);
            setPageNum(idx + 1);
          }
        });
      },
      { threshold: 0.4 }
    );

    imgs.forEach((img) => {
      lazyIO.observe(img);
      countIO.observe(img);
      if (img.complete) img.classList.add('ds-loaded');
      else img.addEventListener('load', () => img.classList.add('ds-loaded'));
    });

    return () => { lazyIO.disconnect(); countIO.disconnect(); };
  }, [imagePaths]);

  /* ── Keyboard navigation ────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft'  && prevSlug) window.location.href = `/read/${prevSlug}`;
      if (e.key === 'ArrowRight' && nextSlug) window.location.href = `/read/${nextSlug}`;
      if (e.key === 'ArrowUp')   window.scrollBy({ top: -400, behavior: 'smooth' });
      if (e.key === 'ArrowDown') window.scrollBy({ top:  400, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prevSlug, nextSlug]);

  /* ── GA: chapter completion ─────────────────────────────────────────────── */
  useEffect(() => {
    if (progress >= 95 && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag?.('event', 'chapter_complete', {
        event_category: 'reader',
        event_label: chapterTitle,
        value: 1,
      });
    }
  }, [progress, chapterTitle]);

  const toggleNav = useCallback(() => {
    setShowNav((v) => {
      const next = !v;
      gsap.to(topNavRef.current, { y: next ? '0%' : '-110%', duration: 0.25, ease: 'power2.out' });
      gsap.to(botNavRef.current, { y: next ? '0%' : '110%',  duration: 0.25, ease: 'power2.out' });
      return next;
    });
  }, []);

  /* ── Placeholder blur-up SVG ────────────────────────────────────────────── */
  const placeholder =
    'data:image/svg+xml;base64,' +
    btoa('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"><rect width="100%" height="100%" fill="#111"/></svg>');

  return (
    <main
      className="bg-ds-bg min-h-screen relative select-none font-sans"
    >
      {/* ── Katana progress bar: The Breath of Crimson ────────────────────── */}
      <div
        className="fixed top-0 left-0 h-[4px] z-[9999] pointer-events-none"
        style={{
          width: `${progress}%`,
          background: 'var(--color-ds-primary-container)',
          boxShadow: '0 0 15px var(--color-ds-primary-container)',
          transition: 'width .08s linear',
        }}
      />

      {/* ── Katana scrollbar: The Blade ────────────────────────────────────── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 w-[4px] h-[60vh] bg-ds-surface-container rounded-full overflow-hidden z-50 shadow-gloom hidden md:block">
        <div
          ref={bladeRef}
          className="w-full bg-ds-primary-container rounded-full transition-all duration-100"
          style={{
            height: `${progress}%`,
            boxShadow: '0 0 12px var(--color-ds-primary-container)',
          }}
        />
        {/* Tsuba: Gold Accent */}
        <div
          className="absolute w-4 h-[8px] bg-ds-tertiary left-1/2 -translate-x-1/2 rounded-none z-10 shadow-lg"
          style={{ top: `${progress}%`, marginTop: '-4px', transition: 'top .1s linear' }}
        />
      </div>

      {/* ── Page badge ────────────────────────────────────────────────────── */}
      <div className="fixed left-6 bottom-[80px] z-50 text-[10px] font-black tracking-widest text-ds-text-dim/40 pointer-events-none uppercase">
        SCROLL {pageNum} / {total}
      </div>

      {/* ── Top nav: Glassmorphism ─────────────────────────────────────────── */}
      <nav
        ref={topNavRef}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4
                   glass-panel shadow-gloom no-border"
      >
        <div className="flex items-center gap-4">
          <Link href="/chapters" className="text-ds-text-dim hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest uppercase text-ds-primary-container leading-none mb-1">Chapter {chapterNum}</span>
            <span className="text-sm font-bold text-white truncate max-w-[40vw]">
              {chapterTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); setShowSettings((s) => !s); }}
            className="text-ds-text-dim hover:text-white p-2 transition-colors"
          >
            <Settings size={20} />
          </button>

          <div className="hidden md:flex items-center gap-1 bg-ds-surface-low px-1 py-1 shadow-inner">
            {prevSlug ? (
              <Link href={`/read/${prevSlug}`} className="p-2 text-ds-text-dim hover:text-white hover:bg-ds-surface-container transition-colors">
                <ChevronLeft size={20} />
              </Link>
            ) : (
              <span className="p-2 text-ds-bg/30 cursor-not-allowed"><ChevronLeft size={20} /></span>
            )}
            <Link href="/" className="p-2 text-ds-text-dim hover:text-white hover:bg-ds-surface-container transition-colors">
              <Home size={18} />
            </Link>
            {nextSlug ? (
              <Link href={`/read/${nextSlug}`} className="p-2 text-ds-text-dim hover:text-white hover:bg-ds-surface-container transition-colors">
                <ChevronRight size={20} />
              </Link>
            ) : (
              <span className="p-2 text-ds-bg/30 cursor-not-allowed"><ChevronRight size={20} /></span>
            )}
          </div>
        </div>
      </nav>

      {/* ── Settings panel ────────────────────────────────────────────────── */}
      {showSettings && (
        <div
          className="fixed top-20 right-6 z-50 bg-ds-surface shadow-gloom p-6 w-64 glass-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black tracking-widest uppercase text-ds-text-dim">Settings</span>
            <span className="text-[10px] font-black text-ds-primary-container">{imgWidth}PX</span>
          </div>
          <input
            type="range" min={320} max={1200} step={10} value={imgWidth}
            onChange={(e) => setImgWidth(Number(e.target.value))}
            className="w-full accent-ds-primary-container"
          />
        </div>
      )}

      {/* ── Tap overlay to toggle nav ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-30 cursor-pointer"
        style={{ pointerEvents: showNav ? 'none' : 'auto' }}
        onClick={toggleNav}
      />

      {/* ── Manga panels ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center pt-[72px] pb-32"
        style={{ maxWidth: imgWidth, margin: '0 auto' }}
        onClick={toggleNav}
      >
        <div className="flex items-center gap-4 py-8 opacity-20">
          <div className="h-[1px] w-12 bg-white"></div>
          <p className="text-[10px] tracking-[0.4em] text-white uppercase font-black">
            The Breath of Ink & Shadow
          </p>
          <div className="h-[1px] w-12 bg-white"></div>
        </div>

        {imagePaths.map((src, i) => (
          <div key={i} className="w-full bg-ds-bg min-h-[40vh] flex items-center justify-center relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-src={src}
              data-idx={i}
              src={i < 3 ? src : placeholder}
              alt={`${chapterTitle} page ${i + 1}`}
              className="ds-panel w-full h-auto block shadow-gloom"
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
              style={{ opacity: 0, transition: 'opacity .6s cubic-bezier(0.4, 0, 0.2, 1)' }}
              onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
            />
          </div>
        ))}
      </div>

      {/* ── End-of-chapter nav: Surface Shifts ───────────────────────────── */}
      <div className="max-w-3xl mx-auto px-8 pb-32 flex gap-6 flex-col sm:flex-row">
        {prevSlug ? (
          <Link
            href={`/read/${prevSlug}`}
            className="flex-1 py-6 surface-shift shadow-gloom text-center font-black text-xs tracking-widest text-ds-text-dim hover:text-white uppercase group"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">← Previous Scroll</span>
          </Link>
        ) : (
          <div className="flex-1 py-6 bg-ds-surface/30 text-center font-black text-xs tracking-widest text-ds-bg uppercase cursor-not-allowed">
            ← First Scroll
          </div>
        )}
        {nextSlug ? (
          <Link
            href={`/read/${nextSlug}`}
            className="flex-1 py-6 bg-ds-primary-container shadow-crimson text-center font-black text-xs tracking-widest text-white hover:brightness-125 transition-all uppercase group"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-block">Next Scroll →</span>
          </Link>
        ) : (
          <Link
            href="/chapters"
            className="flex-1 py-6 bg-ds-secondary-container shadow-gloom text-center font-black text-xs tracking-widest text-white hover:brightness-110 transition-all uppercase"
          >
            Return to Archive
          </Link>
        )}
      </div>

      {/* ── Bottom nav (mobile) ───────────────────────────────────────────── */}
      <nav
        ref={botNavRef}
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around
                   px-6 py-5 glass-panel shadow-gloom no-border md:hidden"
      >
        {prevSlug ? (
          <Link href={`/read/${prevSlug}`} className="flex flex-col items-center gap-1 text-ds-text-dim hover:text-white transition-colors">
            <ChevronLeft size={24} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-black">Prev</span>
          </Link>
        ) : (
          <span className="flex flex-col items-center gap-1 text-ds-bg/30">
            <ChevronLeft size={24} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-black">Prev</span>
          </span>
        )}

        <Link href="/" className="flex flex-col items-center gap-1 text-ds-primary hover:scale-110 transition-transform">
          <Home size={24} />
          <span className="text-[8px] uppercase tracking-[0.2em] font-black">Portal</span>
        </Link>

        {nextSlug ? (
          <Link href={`/read/${nextSlug}`} className="flex flex-col items-center gap-1 text-ds-text-dim hover:text-white transition-colors">
            <ChevronRight size={24} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-black">Next</span>
          </Link>
        ) : (
          <span className="flex flex-col items-center gap-1 text-ds-bg/30">
            <ChevronRight size={24} />
            <span className="text-[8px] uppercase tracking-[0.2em] font-black">Next</span>
          </span>
        )}
      </nav>

      <style>{`
        .ds-loaded { opacity: 1 !important; }
      `}</style>
    </main>
  );
}
