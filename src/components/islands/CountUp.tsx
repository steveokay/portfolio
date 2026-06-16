import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;   // e.g. "68%", "12 svc", "40%"
  label: string;
  duration?: number;
}

function parseTarget(raw: string): { prefix: string; num: number; suffix: string } {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { prefix: '', num: 0, suffix: raw };
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
}

export default function CountUp({ value, label, duration = 1200 }: Props) {
  const { prefix, num, suffix } = parseTarget(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDisplay(num); return; }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * num));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num, duration]);

  return (
    <div ref={ref} className="border-l-2 border-accent pl-4">
      <div className="font-mono text-2xl text-accent font-tabular">
        {prefix}{display}{suffix}
      </div>
      <div className="text-sm text-fg-secondary mt-0.5">{label}</div>
    </div>
  );
}
