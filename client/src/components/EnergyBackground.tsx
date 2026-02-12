import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Wire({ index, color }: { index: number; color: string }) {
  const ref = useRef<THREE.Line>(null);
  const segments = 80;
  const frameAccumulator = useRef(0);

  const basePositions = useMemo(() => {
    const positions = new Float32Array(segments * 3);
    const offset = (index - 2) * 1.4;
    for (let i = 0; i < segments; i += 1) {
      const x = (i / (segments - 1) - 0.5) * 46;
      positions[i * 3] = x;
      positions[i * 3 + 1] = offset + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, [index]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    frameAccumulator.current += delta;
    if (frameAccumulator.current < 1 / 36) return;
    frameAccumulator.current = 0;

    const time = clock.getElapsedTime();
    const position = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < segments; i += 1) {
      const i3 = i * 3;
      const x = basePositions[i3];
      const wave = Math.sin(time * 0.6 + x * 0.3 + index) * (0.6 + index * 0.05);
      const pulse = Math.cos(time * 0.5 + x * 0.4 - index) * 0.8;

      position[i3 + 1] = basePositions[i3 + 1] + wave;
      position[i3 + 2] = basePositions[i3 + 2] + pulse;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = Math.sin(time * 0.05 + index) * 0.05;
  });

  return (
    <line ref={ref as any}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={segments}
          array={basePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

function NeonWires() {
  const colors = ["#00f0ff", "#2d7cff"];
  return (
    <group>
      {colors.map((color, index) => (
        <Wire key={color} index={index} color={color} />
      ))}
    </group>
  );
}

export function EnergyBackground() {
  const gradientRef = useRef<HTMLDivElement>(null);
  const plasmaCoreRef = useRef<HTMLDivElement>(null);
  const plasmaTrailRef = useRef<HTMLDivElement>(null);
  const plasmaSparkRef = useRef<HTMLDivElement>(null);
  const targetCursor = useRef({ x: 0, y: 0 });
  const smoothCursor = useRef({ x: 0, y: 0 });
  const trailCursor = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateGradient = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      gradientRef.current?.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    updateGradient();
    window.addEventListener("scroll", updateGradient, { passive: true });
    window.addEventListener("resize", updateGradient);

    return () => {
      window.removeEventListener("scroll", updateGradient);
      window.removeEventListener("resize", updateGradient);
    };
  }, []);

  useEffect(() => {
    let moveRafId = 0;
    let smoothRafId = 0;

    const center = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };
    targetCursor.current = center;
    smoothCursor.current = center;
    trailCursor.current = center;

    const onMouseMove = (event: MouseEvent) => {
      if (moveRafId) {
        window.cancelAnimationFrame(moveRafId);
      }
      moveRafId = window.requestAnimationFrame(() => {
        targetCursor.current = {
          x: event.clientX,
          y: event.clientY,
        };
      });
    };

    const smoothFollow = () => {
      const coreLerp = 0.18;
      const trailLerp = 0.08;

      smoothCursor.current.x += (targetCursor.current.x - smoothCursor.current.x) * coreLerp;
      smoothCursor.current.y += (targetCursor.current.y - smoothCursor.current.y) * coreLerp;
      trailCursor.current.x += (smoothCursor.current.x - trailCursor.current.x) * trailLerp;
      trailCursor.current.y += (smoothCursor.current.y - trailCursor.current.y) * trailLerp;

      if (plasmaCoreRef.current) {
        plasmaCoreRef.current.style.left = `${smoothCursor.current.x}px`;
        plasmaCoreRef.current.style.top = `${smoothCursor.current.y}px`;
      }
      if (plasmaTrailRef.current) {
        plasmaTrailRef.current.style.left = `${trailCursor.current.x - 8}px`;
        plasmaTrailRef.current.style.top = `${trailCursor.current.y + 4}px`;
      }
      if (plasmaSparkRef.current) {
        plasmaSparkRef.current.style.left = `${trailCursor.current.x - 18}px`;
        plasmaSparkRef.current.style.top = `${trailCursor.current.y + 12}px`;
      }

      smoothRafId = window.requestAnimationFrame(smoothFollow);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    smoothRafId = window.requestAnimationFrame(smoothFollow);
    return () => {
      window.cancelAnimationFrame(moveRafId);
      window.cancelAnimationFrame(smoothRafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <div
        ref={gradientRef}
        className="absolute inset-0 scroll-gradient"
        style={{
          background: "linear-gradient(180deg, #0c0c0f 0%, #1c1c1f 40%, #bfbfbf 100%)",
        }}
      />
      <div
        className="absolute inset-0 animated-gradient opacity-30 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(0,240,255,0.28), transparent 48%), radial-gradient(circle at 82% 28%, rgba(50,120,255,0.24), transparent 52%)",
        }}
      />
      <div className="absolute inset-0">
        <div
          ref={plasmaTrailRef}
          className="absolute rounded-full"
          style={{
            width: "112px",
            height: "72px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse at 40% 38%, rgba(124, 210, 255, 0.2) 0%, rgba(46, 125, 255, 0.14) 46%, rgba(8, 30, 98, 0) 78%)",
            filter: "blur(11px)",
          }}
        />
        <div
          ref={plasmaSparkRef}
          className="absolute rounded-full"
          style={{
            width: "44px",
            height: "44px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle at 35% 35%, rgba(168, 228, 255, 0.16) 0%, rgba(35, 102, 222, 0.1) 52%, rgba(9, 34, 96, 0) 78%)",
            filter: "blur(8px)",
          }}
        />
        <div
          ref={plasmaCoreRef}
          className="absolute rounded-full"
          style={{
            width: "74px",
            height: "74px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle at 34% 30%, rgba(218, 246, 255, 0.42) 0%, rgba(106, 195, 255, 0.3) 36%, rgba(28, 98, 225, 0.2) 62%, rgba(8, 34, 90, 0) 84%)",
            filter: "blur(2px)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div className="fixed inset-0">
        <Canvas
          camera={{ position: [0, 0, 16], fov: 60 }}
          dpr={[0.75, 1]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <NeonWires />
        </Canvas>
      </div>
    </div>
  );
}
