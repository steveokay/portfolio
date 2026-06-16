import { useState, useEffect } from 'react';

type LineType = 'prompt' | 'output' | 'comment';

interface FullLine {
  type: LineType;
  content: string;
}

type Step =
  | { kind: 'char'; renderedIdx: number; char: string }
  | { kind: 'line'; line: FullLine };

const SCRIPT: FullLine[] = [
  { type: 'comment', content: '# portfolio.sh' },
  { type: 'prompt',  content: 'whoami' },
  { type: 'output',  content: 'steve-mokay' },
  { type: 'prompt',  content: 'cat ./about.txt' },
  { type: 'output',  content: 'Backend & infra engineer. 6yr. Go, k8s, Postgres.' },
  { type: 'output',  content: 'Built services at 50k req/s. Keeps p99 in check.' },
  { type: 'prompt',  content: 'ls ./work/' },
  { type: 'output',  content: 'latency-reduction/  k8s-migration/  pipeline-rebuild/' },
];

const CHAR_DELAY = 55;
const LINE_DELAY = 180;

// Build steps with concrete rendered indices so we never need SCRIPT.indexOf
function buildSteps(): Step[] {
  const steps: Step[] = [];
  let renderedCount = 0;

  for (const line of SCRIPT) {
    if (line.type === 'prompt') {
      const idx = renderedCount++;
      steps.push({ kind: 'line', line: { type: 'prompt', content: '' } });
      for (const char of line.content) {
        steps.push({ kind: 'char', renderedIdx: idx, char });
      }
    } else {
      renderedCount++;
      steps.push({ kind: 'line', line });
    }
  }
  return steps;
}

const STEPS = buildSteps();

export default function Terminal() {
  const [lines, setLines] = useState<FullLine[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Remove the static LCP seed — Terminal is now in control
    document.getElementById('terminal-seed')?.remove();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLines(SCRIPT);
      setDone(true);
      return;
    }

    let stepIdx = 0;
    let cancelled = false;

    const advance = () => {
      if (cancelled) return;
      if (stepIdx >= STEPS.length) { setDone(true); return; }

      const step = STEPS[stepIdx++];

      if (step.kind === 'line') {
        setLines((prev) => [...prev, step.line]);
        setTimeout(advance, step.line.type === 'prompt' ? 0 : LINE_DELAY);
      } else {
        setLines((prev) => {
          const next = [...prev];
          const target = next[step.renderedIdx];
          if (!target) return prev;
          next[step.renderedIdx] = { ...target, content: target.content + step.char };
          return next;
        });
        setTimeout(advance, CHAR_DELAY);
      }
    };

    advance();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      className="font-mono text-sm bg-surface border border-border p-4 overflow-x-auto"
      role="region"
      aria-label="Terminal introduction"
      aria-live="polite"
      aria-atomic="false"
    >
      {lines.map((line, i) => (
        <div key={i} className="leading-7">
          {line.type === 'prompt' && (
            <span>
              <span className="text-accent select-none mr-1.5">❯</span>
              <span className="text-fg">{line.content}</span>
            </span>
          )}
          {line.type === 'output' && (
            <span className="text-fg-secondary pl-5">{line.content}</span>
          )}
          {line.type === 'comment' && (
            <span className="text-fg-muted">{line.content}</span>
          )}
        </div>
      ))}
      {done && (
        <div className="leading-7">
          <span className="text-accent select-none mr-1.5">❯</span>
          <span
            className="inline-block w-2 h-[1.1em] bg-accent align-middle animate-cursor-blink"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
