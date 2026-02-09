import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleFlow() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create a nice flowing sine wave structure of particles
  const count = 5000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40; // Wider spread
      const y = (Math.random() - 0.5) * 20; 
      const z = (Math.random() - 0.5) * 10; 
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      
      // Energy wire flow: particles move along sine waves
      // We create "strands" by grouping particles based on their index
      const strand = i % 5;
      const speed = 0.5 + strand * 0.1;
      const amplitude = 0.8 + strand * 0.2;
      
      ref.current.geometry.attributes.position.array[i3 + 1] = 
        y + Math.sin(time * speed + x * 0.4 + strand) * amplitude;
        
      ref.current.geometry.attributes.position.array[i3 + 2] = 
        positions[i3 + 2] + Math.cos(time * speed * 0.8 + x * 0.3) * 0.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = Math.sin(time * 0.05) * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function EnergyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Dynamic smoke/gradient background */}
      <div 
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          opacity: 0.9
        }}
      />
      
      {/* Moving smoke screen effect overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,100,100,0.1),transparent_70%)] animate-smoke-1" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(150,150,150,0.1),transparent_60%)] animate-smoke-2" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background z-10" />
      
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ParticleFlow />
      </Canvas>
    </div>
  );
}
