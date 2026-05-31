import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const DOT_COUNT = 12;
const DAMPING = 0.35;

interface Point {
  x: number;
  y: number;
}

/** 鼠标粒子柔性跟随（带阻尼延迟）。触屏 / 减少动态时不渲染 */
export function ParticleCursor() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const target: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const points: Point[] = Array.from({ length: DOT_COUNT }, () => ({ ...target }));
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let px = target.x;
      let py = target.y;
      points.forEach((p, i) => {
        p.x += (px - p.x) * DAMPING;
        p.y += (py - p.y) * DAMPING;
        px = p.x;
        py = p.y;
        const fade = 1 - i / points.length;
        ctx.beginPath();
        ctx.fillStyle = `rgba(246,231,193,${fade * 0.5})`;
        ctx.arc(p.x, p.y, fade * 6 + 1, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    loop();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduce]);

  if (reduce) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[70]" aria-hidden />;
}
