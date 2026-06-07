"use client";

import { useEffect, useRef, use, useMemo } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Simulated character database
const CHARACTER_DB: Record<string, any> = {
  tanjiro: {
    name: "Tanjiro Kamado",
    title: "Water & Sun Breathing",
    affiliation: "Demon Slayer Corps",
    description: "A kind-hearted boy whose family was slaughtered by demons, and whose sister Nezuko was turned into one. He joined the Demon Slayer Corps to find a cure for her and to prevent others from suffering the same tragedy.",
    color: "#45a29e", // Water green/blue
    particleType: "water"
  },
  rengoku: {
    name: "Kyojuro Rengoku",
    title: "Flame Hashira",
    affiliation: "Demon Slayer Corps",
    description: "The Flame Hashira of the Demon Slayer Corps. An enthusiastic and intensely passionate swordsman with a strong sense of duty, holding true to his mother's teaching that the strong must protect the weak.",
    color: "#ff4d00", // Flame red/orange
    particleType: "fire"
  },
  zenitsu: {
    name: "Zenitsu Agatsuma",
    title: "Thunder Breathing",
    affiliation: "Demon Slayer Corps",
    description: "A cowardly young man who forces himself to act brave. When he faints from extreme fear, his body moves on instinct, allowing him to use Thunder Breathing with incredible speed.",
    color: "#fbbf24", // Thunder yellow
    particleType: "thunder"
  },
  muzan: {
    name: "Muzan Kibutsuji",
    title: "The Progenitor of Demons",
    affiliation: "Twelve Kizuki",
    description: "The first of his kind, Muzan is cold-hearted, ruthless, and exceptionally intelligent. He is the progenitor of all other demons in existence and the leader of the Twelve Kizuki.",
    color: "#8a0303", // Blood red
    particleType: "blood"
  }
};

// Default fallback
const DEFAULT_CHAR = {
  name: "Unknown Character",
  title: "Unknown",
  affiliation: "Unknown",
  description: "Character data not found in the archives.",
  color: "#ffffff",
  particleType: "none"
};

// --- 3D Particle Components ---
function WaterParticles({ color }: { color: string }) {
  const count = 500;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      const speed = 0.01 + Math.random() * 0.03;
      temp.push({ x, y, z, speed, offset: Math.random() * Math.PI * 2 });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      // Flowing wave motion
      const y = p.y + Math.sin(time * 2 + p.x) * 0.5;
      const x = p.x - (time * p.speed * 50) % 20;
      
      dummy.position.set(
        x > -10 ? x : x + 20, 
        y, 
        p.z
      );
      dummy.rotation.z = Math.sin(time + p.offset) * 0.2;
      dummy.scale.setScalar(Math.sin(time * 2 + p.offset) * 0.5 + 0.5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.2, 0.05]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

function FireParticles({ color }: { color: string }) {
  const count = 800;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = -10 + Math.random() * 20;
      const z = (Math.random() - 0.5) * 10;
      const speed = 0.05 + Math.random() * 0.1;
      temp.push({ x, y, z, speed });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      // Rising sparks
      let currentY = p.y + (time * p.speed * 30);
      if (currentY > 10) currentY = -10 + (currentY % 20); // Reset at bottom
      
      const currentX = p.x + Math.sin(time * 3 + p.y) * 0.5;
      
      dummy.position.set(currentX, currentY, p.z);
      dummy.rotation.z = time * p.speed;
      
      // Fade out as they rise
      const scale = Math.max(0, 1 - (currentY + 10) / 20) * (Math.random() * 0.5 + 0.5);
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.08, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

function ProfileCanvas({ type, color }: { type: string, color: string }) {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {type === "water" && <WaterParticles color={color} />}
        {type === "fire" && <FireParticles color={color} />}
        {type === "thunder" && <FireParticles color={color} />} {/* Reuse fire logic for sparks */}
        {type === "blood" && <WaterParticles color={color} />} {/* Reuse water logic but slow it down in real app */}
        {/* Simple fallback */}
        {type === "none" && <ambientLight intensity={0.1} />}
      </Canvas>
    </div>
  );
}
// --- End 3D ---

export default function CharacterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const character = CHARACTER_DB[resolvedParams.id] || DEFAULT_CHAR;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRevealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reverse wipe in effect when landing on the page
    const tl = gsap.timeline();
    
    tl.to(bgRevealRef.current, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 0.8,
      ease: "power3.inOut"
    })
    .fromTo(".char-reveal", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    );
  }, []);

  return (
    <main className="min-h-screen bg-ds-bg relative overflow-hidden flex flex-col">
      {/* Wipe out layer on mount */}
      <div 
        ref={bgRevealRef} 
        className="fixed inset-0 bg-black z-50 pointer-events-none"
      />

      {/* 3D Background */}
      <ProfileCanvas type={character.particleType} color={character.color} />

      {/* Content */}
      <div className="relative z-10 flex-grow pt-24 pb-20" ref={containerRef}>
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/characters" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 char-reveal">
            <ArrowLeft size={20} />
            <span className="uppercase tracking-widest text-sm font-bold">Back to DB</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Info */}
            <div className="space-y-6">
              <div className="char-reveal">
                <span 
                  className="px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm border"
                  style={{ color: character.color, borderColor: `${character.color}40`, backgroundColor: `${character.color}10` }}
                >
                  {character.affiliation}
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white uppercase leading-none char-reveal">
                {character.name}
              </h1>
              
              <h2 className="text-2xl font-light italic text-gray-400 char-reveal">
                {character.title}
              </h2>
              
              <div className="w-16 h-1 my-8 char-reveal" style={{ backgroundColor: character.color }}></div>
              
              <p className="text-lg text-gray-300 leading-relaxed max-w-lg char-reveal">
                {character.description}
              </p>
            </div>
            
            {/* Right: Character Image Area */}
            <div className="relative h-[60vh] w-full char-reveal rounded-lg border border-white/5 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 overflow-hidden">
              <div className="absolute inset-0 ichimatsu-bg opacity-10"></div>
              {/* Silhouette or placeholder image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
                style={{ backgroundImage: `url('https://via.placeholder.com/800x1000/1a1c23/${character.color.replace('#', '')}?text=Character+Art')` }}
              ></div>
              
              <div className="relative z-10 w-full text-right">
                <div className="text-6xl md:text-9xl font-heading font-bold opacity-10 uppercase break-all leading-none" style={{ color: character.color }}>
                  {character.name.split(' ')[0]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
