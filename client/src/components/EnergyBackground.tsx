import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleFlow() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create a nice flowing sine wave structure of particles
  const count = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20; // Spread wide horizontally
      const y = (Math.random() - 0.5) * 20; // Spread vertically
      const z = (Math.random() - 0.5) * 10; // Depth
      
      // Bias positions towards a central flow
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Wave animation
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Get original x position for stable wave calculation relative to X
      const x = positions[i3]; 
      
      // Gentle sine wave movement on Y axis based on X position and Time
      ref.current.geometry.attributes.position.array[i3 + 1] = 
        positions[i3 + 1] + Math.sin(time * 0.5 + x * 0.5) * 0.5;
        
      // Subtle pulse on Z
      ref.current.geometry.attributes.position.array[i3 + 2] = 
        positions[i3 + 2] + Math.cos(time * 0.3 + x * 0.3) * 0.2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // Slight rotation of the entire system
    ref.current.rotation.y = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00f0ff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function EnergyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-background pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ParticleFlow />
      </Canvas>
    </div>
  );
}
