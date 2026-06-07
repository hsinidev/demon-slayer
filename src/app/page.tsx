"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero3D from "@/components/Hero3D";
import Link from "next/link";
import { Menu, Download, BookOpen, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const LATEST_CHAPTERS = [
  { num: 205, title: "A life that shines through time", cover: "/manga/Kimetsu_no_Yaiba/Chapter 205 - A life that shines through time/1.jpg" },
  { num: 204, title: "A world without demons", cover: "/manga/Kimetsu_no_Yaiba/Chapter 204 - A world without demons/1.jpg" },
  { num: 203, title: "The End of the Thread", cover: "/manga/Kimetsu_no_Yaiba/Chapter 203 - The End of the Thread/1.jpg" },
  { num: 202, title: "Let's Go Back", cover: "/manga/Kimetsu_no_Yaiba/Chapter 202 - Let's Go Back/1.jpg" },
  { num: 201, title: "Chapter 201", cover: "/manga/Kimetsu_no_Yaiba/Chapter 201/1.jpg" },
];

export default function Home() {
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header Glassmorphism scroll effect
    ScrollTrigger.create({
      start: "top -20",
      end: 99999,
      onToggle: (self) => {
        if (self.isActive) {
          headerRef.current?.classList.add("glass-panel", "shadow-gloom");
        } else {
          headerRef.current?.classList.remove("glass-panel", "shadow-gloom");
        }
      }
    });

    // Cinematic Entrance
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.fromTo(
      titleRef.current,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 2, delay: 0.5 }
    )
    .fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      "-=1.5"
    );

    // Grid stagger entrance
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, []);

  return (
    <main className="min-h-screen relative font-sans text-ds-text selection:bg-ds-primary selection:text-white bg-ds-bg overflow-x-hidden">
      {/* 3D Atmosphere */}
      <Hero3D />

      {/* Cinematic Navigation */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 flex items-center justify-center text-ds-primary font-heading font-black text-3xl group-hover:scale-110 transition-transform duration-500">
              <span className="absolute inset-0 bg-ds-primary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>
              鬼
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-white leading-none">
                DEMON <span className="text-ds-primary">SLAYER</span>
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-ds-secondary font-bold">Editorial Edition</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-10 font-medium text-sm tracking-widest uppercase">
            {["Chapters", "Characters", "Archive"].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="hover:text-ds-primary transition-colors relative group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ds-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <button className="bg-ds-primary-container text-white px-8 py-3 rounded-none font-bold text-xs tracking-widest shadow-crimson hover:brightness-110 transition-all transform active:scale-95 uppercase">
              Download App
            </button>
          </nav>

          <button className="md:hidden text-white">
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* Hero: The Breath of Ink */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        {/* Layered Text Shadows for depth */}
        <div className="relative z-10 text-center max-w-5xl">
          <h1 
            ref={titleRef}
            className="font-heading text-6xl md:text-9xl lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter mb-8"
          >
            THE <span className="text-ds-primary relative">BREATH<span className="absolute -bottom-4 left-0 w-full h-1 bg-ds-primary/30 blur-md"></span></span>
            <br />
            OF INK
          </h1>
          <p ref={subtitleRef} className="text-xl md:text-2xl text-ds-text-dim max-w-2xl mx-auto leading-relaxed font-light mb-12">
            Experience the Taisho era through a cinematic lens. 
            High-fidelity scans meets cutting-edge interaction.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link 
              href="/chapters" 
              className="px-10 py-5 bg-white text-black font-black text-lg tracking-tight hover:bg-ds-primary hover:text-white transition-all duration-500 shadow-gloom group flex items-center gap-3"
            >
              START READING
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-ds-surface-low text-ds-tertiary border border-ds-tertiary/20 font-bold text-lg hover:bg-ds-tertiary hover:text-ds-bg transition-all duration-500 shadow-gloom uppercase tracking-tight">
              LATEST UPDATE
            </button>
          </div>
        </div>
        
        {/* Decorative Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-white/[0.02] pointer-events-none select-none">
          滅
        </div>
      </section>

      {/* Editorial Content Grid: No Lines, Just Surfaces */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-baseline justify-between mb-16">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter uppercase">
                Recent <span className="text-ds-primary">Scrolls</span>
              </h2>
              <div className="w-24 h-1 bg-ds-primary"></div>
            </div>
            <Link href="/chapters" className="text-ds-text-dim hover:text-ds-secondary transition-colors text-sm font-bold tracking-widest uppercase flex items-center gap-2">
              Explore All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {LATEST_CHAPTERS.map((chapter) => (
              <Link 
                href={`/read/${chapter.num}`} 
                key={chapter.num}
                className="group flex flex-col bg-ds-surface-low shadow-gloom hover:translate-y-[-8px] transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-ds-surface-container">
                  {/* Glass overlay on hover */}
                  <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-ds-bg via-ds-primary-container/20 to-transparent">
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white">
                      <span className="text-xs font-black tracking-widest uppercase">Read Now</span>
                      <BookOpen size={16} className="text-ds-tertiary" />
                    </div>
                  </div>
                  
                  {/* Cinematic Scale Effect */}
                  <div className="absolute inset-0 bg-ds-surface-container flex items-center justify-center text-ds-text/10 font-black text-6xl italic opacity-50">
                    {chapter.num}
                  </div>
                  
                  {/* Decorative Slash (Animated in CSS) */}
                  <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-ds-primary/10 to-transparent skew-x-[-20deg] group-hover:animate-[slash_0.8s_ease-out_forwards]"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black tracking-[0.2em] text-ds-primary-container uppercase">Chapter {chapter.num}</span>
                    <span className="w-4 h-[1px] bg-ds-primary-container/30"></span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white line-clamp-1 leading-snug group-hover:text-ds-primary transition-colors">
                    {chapter.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footer: Editorial Design */}
      <footer className="relative z-10 bg-ds-surface-low pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
            <div className="max-w-md">
              <div className="font-heading text-3xl font-black text-white mb-6 tracking-tighter uppercase">
                DEMON <span className="text-ds-primary">SLAYER</span>
              </div>
              <p className="text-ds-text-dim leading-relaxed mb-8">
                The ultimate portal for Kimetsu no Yaiba fans. Immersive storytelling meet performance-driven interface.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 bg-ds-bg hover:bg-ds-primary transition-colors cursor-pointer"></div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-white font-black text-xs tracking-widest uppercase mb-6">Explore</h4>
                <ul className="flex flex-col gap-4 text-sm text-ds-text-dim">
                  <li><Link href="/chapters" className="hover:text-white transition-colors">Latest Scrolls</Link></li>
                  <li><Link href="/characters" className="hover:text-white transition-colors">Character Gallery</Link></li>
                  <li><Link href="/archive" className="hover:text-white transition-colors">Chronicles</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black text-xs tracking-widest uppercase mb-6">System</h4>
                <ul className="flex flex-col gap-4 text-sm text-ds-text-dim">
                  <li><Link href="/dmca" className="hover:text-white transition-colors">Copyright</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Legacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-ds-text-dim text-[10px] tracking-widest uppercase font-bold">
              &copy; {new Date().getFullYear()} Demon Slayer Manga Online. Taisho Era Reimagined.
            </p>
            <div className="text-[10px] tracking-[0.4em] uppercase text-ds-primary font-black">
              Breath of Ink & Shadow
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
