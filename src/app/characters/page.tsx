"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CHARACTERS = [
  { id: "tanjiro", name: "Tanjiro Kamado", affiliation: "Demon Slayer Corps", height: "1", color: "from-ds-secondary/10 to-ds-bg" },
  { id: "nezuko", name: "Nezuko Kamado", affiliation: "Demon Slayer Corps", height: "2", color: "from-ds-primary/10 to-ds-bg" },
  { id: "zenitsu", name: "Zenitsu Agatsuma", affiliation: "Demon Slayer Corps", height: "1", color: "from-ds-tertiary/10 to-ds-bg" },
  { id: "inosuke", name: "Inosuke Hashibira", affiliation: "Demon Slayer Corps", height: "1", color: "from-ds-secondary/10 to-ds-bg" },
  { id: "giyu", name: "Giyu Tomioka", affiliation: "Demon Slayer Corps", height: "2", color: "from-ds-secondary/10 to-ds-bg" },
  { id: "rengoku", name: "Kyojuro Rengoku", affiliation: "Demon Slayer Corps", height: "1", color: "from-ds-primary/10 to-ds-bg" },
  
  { id: "muzan", name: "Muzan Kibutsuji", affiliation: "Twelve Kizuki", height: "2", color: "from-ds-primary-container/20 to-ds-bg" },
  { id: "kokushibo", name: "Kokushibo", affiliation: "Twelve Kizuki", height: "1", color: "from-ds-primary-container/10 to-ds-bg" },
  { id: "doma", name: "Doma", affiliation: "Twelve Kizuki", height: "1", color: "from-ds-secondary/10 to-ds-bg" },
  { id: "akaza", name: "Akaza", affiliation: "Twelve Kizuki", height: "2", color: "from-ds-primary/10 to-ds-bg" },
];

export default function CharactersPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        ".character-card",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)" }
      );
    }
  }, []);

  const handleCharacterClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (transitionOverlayRef.current) {
      // 3D/Wipe Transition before navigating
      const tl = gsap.timeline({
        onComplete: () => {
          router.push(`/characters/${id}`);
        }
      });
      
      tl.set(transitionOverlayRef.current, { transformOrigin: "left center" })
        .to(transitionOverlayRef.current, {
          scaleX: 1,
          duration: 0.6,
          ease: "expo.inOut"
        })
        .to(".character-card", {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          stagger: 0.02
        }, "<0.2");
    }
  };

  const slayers = CHARACTERS.filter(c => c.affiliation === "Demon Slayer Corps");
  const demons = CHARACTERS.filter(c => c.affiliation === "Twelve Kizuki");

  return (
    <main className="min-h-screen bg-ds-bg pt-24 pb-20 relative overflow-hidden">
      {/* GSAP Transition Overlay */}
      <div 
        ref={transitionOverlayRef} 
        className="fixed inset-0 bg-black z-50 scale-x-0 origin-right pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>
        <div className="flex items-center gap-4 mb-20">
          <Link href="/" className="text-ds-text-dim hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Character <span className="text-ds-primary-container">Database</span>
          </h1>
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-black text-white mb-10 pb-4 border-b border-ds-secondary-container/20 uppercase tracking-tight">Demon Slayer Corps</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mb-16">
          {slayers.map((char) => (
            <a 
              href={`/characters/${char.id}`} 
              key={char.id} 
              onClick={(e) => handleCharacterClick(e, char.id)}
              className={`character-card block relative break-inside-avoid bg-gradient-to-b ${char.color} border-l-2 border-ds-secondary/20 overflow-hidden group hover:border-ds-secondary transition-all hover:-translate-y-2 shadow-gloom ${char.height === "2" ? "h-96" : "h-64"}`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <p className="text-[10px] font-black tracking-widest text-ds-secondary uppercase mb-1 opacity-60">Hashira Level</p>
                <h3 className="font-heading text-3xl font-black text-white group-hover:text-ds-secondary transition-colors uppercase leading-none">{char.name}</h3>
                <p className="text-ds-text-dim text-xs font-bold uppercase tracking-widest mt-2">{char.affiliation}</p>
              </div>
            </a>
          ))}
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-black text-white mb-10 pb-4 border-b border-ds-primary-container/20 uppercase tracking-tight">Twelve Kizuki & Demons</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {demons.map((char) => (
            <a 
              href={`/characters/${char.id}`} 
              key={char.id} 
              onClick={(e) => handleCharacterClick(e, char.id)}
              className={`character-card block relative break-inside-avoid bg-gradient-to-b ${char.color} border-l-2 border-ds-primary-container/20 overflow-hidden group hover:border-ds-primary-container transition-all hover:-translate-y-2 shadow-gloom ${char.height === "2" ? "h-96" : "h-64"}`}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <p className="text-[10px] font-black tracking-widest text-ds-primary-container uppercase mb-1 opacity-60">Upper Moon</p>
                <h3 className="font-heading text-3xl font-black text-white group-hover:text-ds-primary-container transition-colors uppercase leading-none">{char.name}</h3>
                <p className="text-ds-text-dim text-xs font-bold uppercase tracking-widest mt-2">{char.affiliation}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
