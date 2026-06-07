"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function WisteriaPetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 300;
  
  // Create dummy object to compute matrix
  const dummy = new THREE.Object3D();
  
  // We'll use useFrame to animate the petals falling
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      // Create some random starting positions based on index
      const x = (Math.sin(i * 13.5) * 10) + Math.sin(time * 0.5 + i) * 2;
      const y = ((Math.cos(i * 3.2) * 10) - time * (1 + (i % 3) * 0.5)) % 20 + 10;
      const z = (Math.sin(i * 7.1) * 10) + Math.cos(time * 0.3 + i) * 1;
      
      dummy.position.set(x, y - 10, z);
      dummy.rotation.x = time * 0.5 + i;
      dummy.rotation.y = time * 0.3 + i;
      dummy.rotation.z = time * 0.2 + i;
      
      const scale = 0.1 + (i % 3) * 0.05;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 0.5]} />
      <meshBasicMaterial 
        color="#c197d2" // Wisteria purple
        side={THREE.DoubleSide} 
        transparent={true} 
        opacity={0.8}
      />
    </instancedMesh>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={['#131313']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#84D5C5" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D32F2F" />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <WisteriaPetals />
        </Float>
      </Canvas>
    </div>
  );
}
