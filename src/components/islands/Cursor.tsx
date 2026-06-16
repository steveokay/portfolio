import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch-primary devices and reduced-motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // Dot follows instantly
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Scale ring up on links/buttons
    const onLinkEnter = () => ring.classList.add('cursor-hover');
    const onLinkLeave = () => ring.classList.remove('cursor-hover');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    const bindLinks = () => {
      document.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('mouseenter', onLinkEnter);
        el.addEventListener('mouseleave', onLinkLeave);
      });
    };
    bindLinks();

    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: '50%',
          background: '#ffb000',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
        }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          borderRadius: '50%',
          border: '1px solid rgba(255, 176, 0, 0.45)',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, border-color 0.2s ease',
        }}
      />
    </>
  );
}
