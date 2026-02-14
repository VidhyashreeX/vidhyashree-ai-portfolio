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
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const targetCursor = useRef({ x: 0, y: 0 });
  const smoothCursor = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      scrollProgressRef.current = progress;
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  useEffect(() => {
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let moveRafId = 0;
    let frameRafId = 0;
    let pointerActive = false;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      ttl: number;
      size: number;
      alpha: number;
      spin: number;
      angle: number;
    };
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * Math.min(window.devicePixelRatio || 1, 2));
      canvas.height = Math.floor(window.innerHeight * Math.min(window.devicePixelRatio || 1, 2));
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(
        canvas.width / Math.max(window.innerWidth, 1),
        canvas.height / Math.max(window.innerHeight, 1),
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const center = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };
    targetCursor.current = center;
    smoothCursor.current = center;

    const onMouseMove = (event: MouseEvent) => {
      if (moveRafId) {
        window.cancelAnimationFrame(moveRafId);
      }
      moveRafId = window.requestAnimationFrame(() => {
        pointerActive = true;
        targetCursor.current = {
          x: event.clientX,
          y: event.clientY,
        };
      });
    };

    const spawnSmoke = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      const burst = pointerActive ? Math.max(2, Math.min(7, Math.floor(speed / 5) + 2)) : 1;

      for (let i = 0; i < burst; i += 1) {
        const spread = Math.random() * Math.PI * 2;
        particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          vx: -dx * 0.06 + Math.cos(spread) * (0.2 + Math.random() * 0.8),
          vy: -dy * 0.06 + Math.sin(spread) * (0.2 + Math.random() * 0.8),
          life: 0,
          ttl: 36 + Math.random() * 34,
          size: 24 + Math.random() * 36,
          alpha: 0.16 + Math.random() * 0.12,
          spin: (Math.random() - 0.5) * 0.04,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawSmoke = () => {
      const prevX = smoothCursor.current.x;
      const prevY = smoothCursor.current.y;
      const lerp = pointerActive ? 0.18 : 0.06;

      smoothCursor.current.x += (targetCursor.current.x - smoothCursor.current.x) * lerp;
      smoothCursor.current.y += (targetCursor.current.y - smoothCursor.current.y) * lerp;
      const dx = smoothCursor.current.x - prevX;
      const dy = smoothCursor.current.y - prevY;

      spawnSmoke(smoothCursor.current.x, smoothCursor.current.y, dx, dy);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const isBottomZone = scrollProgressRef.current > 0.72;

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.life += 1;
        if (p.life >= p.ttl) {
          particles.splice(i, 1);
          continue;
        }

        const t = p.life / p.ttl;
        p.x += p.vx;
        p.y += p.vy - 0.03;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.angle += p.spin;

        const fade = (1 - t) * p.alpha;
        const size = p.size * (0.75 + t * 1.25);
        const r = size * 0.5;
        const gradient = ctx.createRadialGradient(p.x, p.y, r * 0.06, p.x, p.y, r);
        if (isBottomZone) {
          gradient.addColorStop(0, `rgba(255, 219, 170, ${fade})`);
          gradient.addColorStop(0.45, `rgba(255, 124, 124, ${fade * 0.55})`);
          gradient.addColorStop(1, "rgba(48, 12, 20, 0)");
        } else {
          gradient.addColorStop(0, `rgba(206, 239, 255, ${fade})`);
          gradient.addColorStop(0.45, `rgba(96, 175, 255, ${fade * 0.55})`);
          gradient.addColorStop(1, "rgba(10, 24, 56, 0)");
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.translate(-p.x, -p.y);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, r * 1.15, r * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      frameRafId = window.requestAnimationFrame(drawSmoke);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    frameRafId = window.requestAnimationFrame(drawSmoke);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(moveRafId);
      window.cancelAnimationFrame(frameRafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <div
        className="fixed inset-0"
        style={{ background: "#030816" }}
      />
      <div
        className="fixed inset-0 site-photo-bg"
        style={{
          backgroundImage: "url('/background-photo.png')",
          imageRendering: "auto",
        }}
      />
      <div
        className="fixed inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 8, 24, 0.68) 0%, rgba(5, 12, 32, 0.62) 50%, rgba(18, 8, 18, 0.68) 100%)",
        }}
      />
      <canvas
        ref={smokeCanvasRef}
        className="fixed inset-0 mix-blend-screen opacity-95"
      />

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
