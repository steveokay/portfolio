import { useEffect, useRef, useState } from 'react';

interface Props {
  totalMin: number;
  words: number;
}

const BLOCKS = 20;

function buildBar(pct: number): string {
  const filled = Math.round(pct * BLOCKS);
  const empty = BLOCKS - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export default function ReadingProgress({ totalMin, words }: Props) {
  const [pct, setPct] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    function measure() {
      rafRef.current = null;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      setPct(p);
    }

    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const minLeft = Math.max(0, Math.ceil(totalMin * (1 - pct)));
  const percent = Math.round(pct * 100);
  const status = minLeft === 0 ? 'finished' : `${minLeft} min remaining`;

  return (
    <div
      className="sticky top-8 z-30 -mx-4 px-4 py-2 mb-8 bg-bg/90 backdrop-blur-sm border-y border-border font-mono text-[11px] flex items-center gap-3 overflow-hidden"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="text-accent select-none whitespace-pre" aria-hidden="true">
        {buildBar(pct)}
      </span>
      <span className="font-tabular text-fg-secondary tabular-nums shrink-0">
        {percent.toString().padStart(2, ' ')}%
      </span>
      <span className="text-border shrink-0" aria-hidden="true">·</span>
      <span className="font-tabular text-fg-muted shrink-0 truncate">{status}</span>
      <span className="text-border shrink-0 hidden sm:inline" aria-hidden="true">·</span>
      <span className="font-tabular text-fg-muted shrink-0 hidden sm:inline">
        {words.toLocaleString()} words
      </span>
    </div>
  );
}
