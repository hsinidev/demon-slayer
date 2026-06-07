'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

export default function ArchiveClient({ arcGroups }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Entrance Animation
    const tl = gsap.timeline();
    tl.fromTo('.archive-header', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
      .fromTo('.arc-card', { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out' }, '-=0.5');

    // Horizontal scroll effect if on desktop? No, let's stick to vertical for better mobile-first consistency with the "Breath of Ink" theme.
  }, []);

  return (
    <main className="min-h-screen bg-ds-bg text-ds-text overflow-x-hidden selection:bg-ds-primary-container selection:text-white">
      {/* Decorative Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-20">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-ds-primary-container/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-ds-tertiary/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24" ref={containerRef}>
        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <div className="archive-header mb-20">
          <Link href="/" className="flex items-center gap-2 text-ds-text-dim hover:text-ds-primary-container transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black tracking-widest uppercase">The Main Hall</span>
          </Link>
          
          <h1 className="font-heading text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-6">
            The <span className="text-ds-primary-container italic">Chronicles</span>
          </h1>
          <p className="text-xl text-ds-text-dim max-w-2xl font-light leading-relaxed">
            A chronological survey of the Taisho era conflict. 
            Navigate through the arcs that defined the legacy of the Demon Slayer Corps.
          </p>
        </div>

        {/* ── Arc Grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-24 relative">
          {/* Vertical Progress Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 hidden md:block"></div>

          {arcGroups.map((group, idx) => {
            const firstChapter = group.chapters[0];
            const thumbSrc = `/manga/Kimetsu_no_Yaiba/${encodeURIComponent(firstChapter.folderName)}/${encodeURIComponent(firstChapter.thumb)}`;
            const isEven = idx % 2 === 0;

            return (
              <section 
                key={group.arc} 
                className={`arc-card flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Arc Visual */}
                <div className="flex-1 w-full group relative">
                  <div className="aspect-[16/9] overflow-hidden bg-ds-surface-low shadow-gloom relative">
                    <img 
                      src={thumbSrc} 
                      alt={group.arc}
                      className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 grayscale hover:grayscale-0 opacity-40 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ds-bg via-transparent to-transparent"></div>
                    <div className="absolute inset-0 border border-white/5 group-hover:border-ds-primary-container/30 transition-colors"></div>
                    
                    {/* Chapter Count Badge */}
                    <div className="absolute bottom-8 right-8 flex items-center gap-3">
                      <div className="w-12 h-[1px] bg-ds-primary-container"></div>
                      <span className="text-xs font-black tracking-widest text-ds-primary-container uppercase">
                        {group.chapters.length} Scrolls
                      </span>
                    </div>
                  </div>
                  
                  {/* Arc Number Shadow */}
                  <div className={`absolute -top-12 ${isEven ? '-left-12' : '-right-12'} text-9xl font-black text-white/[0.03] select-none pointer-events-none hidden lg:block uppercase`}>
                    Arc {idx + 1}
                  </div>
                </div>

                {/* Arc Details */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`flex flex-col ${isEven ? 'md:items-start' : 'md:items-end'}`}>
                    <span className="text-ds-primary-container font-black tracking-[0.3em] uppercase text-xs mb-4 flex items-center gap-3">
                      <Clock size={14} />
                      Chronological Order
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
                      {group.arc}
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
                      <span className="px-4 py-1 bg-ds-surface-container text-ds-text-dim text-[10px] font-bold uppercase tracking-widest">
                        Episodes {group.chapters[0].num} — {group.chapters[group.chapters.length - 1].num}
                      </span>
                    </div>
                    <Link 
                      href={`/chapters?arc=${encodeURIComponent(group.arc)}`}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-ds-primary-container hover:text-white transition-all duration-500 group"
                    >
                      Enter Arc
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Global Footer: Simple version for Archive */}
      <footer className="py-20 border-t border-white/5 bg-ds-surface-low">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-heading text-xl font-black text-white tracking-tighter uppercase">
            DEMON <span className="text-ds-primary-container">SLAYER</span>
          </div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-ds-text-dim font-bold">
            Breath of Ink & Shadow &copy; {new Date().getFullYear()}
          </div>
          <div className="flex gap-8">
            <Link href="/chapters" className="text-xs font-bold tracking-widest uppercase hover:text-ds-primary-container transition-colors">Chapters</Link>
            <Link href="/characters" className="text-xs font-bold tracking-widest uppercase hover:text-ds-primary-container transition-colors">Characters</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
