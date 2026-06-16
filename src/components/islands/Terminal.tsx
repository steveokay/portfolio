import { useState, useEffect, useRef } from 'react';

type LineType = 'prompt' | 'output' | 'comment' | 'error';

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

const COMMANDS: Record<string, () => FullLine[]> = {
  whoami: () => [{ type: 'output', content: 'steve-mokay' }],
  help: () => [
    { type: 'output', content: 'available commands:' },
    { type: 'output', content: '  whoami            print current user' },
    { type: 'output', content: '  cat ./about.txt   print bio' },
    { type: 'output', content: '  ls ./work/        list case studies' },
    { type: 'output', content: '  ls ./drafts/      list writing drafts' },
    { type: 'output', content: '  open <slug>       navigate to case study' },
    { type: 'output', content: '  clear             clear interactive history' },
  ],
  'cat ./about.txt': () => [
    { type: 'output', content: 'Backend & infra engineer. 6yr. Go, k8s, Postgres.' },
    { type: 'output', content: 'Built services at 50k req/s. Keeps p99 in check.' },
  ],
  'ls ./work/': () => [
    { type: 'output', content: 'latency-reduction/  k8s-migration/  pipeline-rebuild/' },
  ],
  'ls ./drafts/': () => [
    { type: 'output', content: 'tracing-hot-paths-in-go-with-pprof.md        [draft]' },
    { type: 'output', content: 'zero-downtime-migrations-at-50k-req-s.md     [draft]' },
    { type: 'output', content: 'what-six-percent-flaky-tests-actually-cost.md [draft]' },
  ],
};

const WORK_SLUGS: Record<string, string> = {
  'latency-reduction': '/work/latency-reduction',
  'k8s-migration': '/work/k8s-migration',
  'pipeline-rebuild': '/work/pipeline-rebuild',
};

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

function processCommand(raw: string): FullLine[] {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];

  if (cmd === 'clear') return [{ type: 'comment', content: '__clear__' }];

  if (COMMANDS[cmd]) return COMMANDS[cmd]();

  const openMatch = cmd.match(/^open\s+(\S+)/);
  if (openMatch) {
    const slug = openMatch[1];
    if (WORK_SLUGS[slug]) {
      window.location.href = WORK_SLUGS[slug];
      return [{ type: 'output', content: `navigating to ${slug}...` }];
    }
    return [{ type: 'error', content: `open: no case study '${slug}'. try ls ./work/` }];
  }

  return [{ type: 'error', content: `command not found: ${raw.trim()}. type 'help' for commands.` }];
}

export default function Terminal() {
  const [lines, setLines] = useState<FullLine[]>([]);
  const [done, setDone] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<FullLine[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (done) inputRef.current?.focus();
  }, [done]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, lines]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const cmd = input;
      const output = processCommand(cmd);

      if (output.length === 1 && output[0].content === '__clear__') {
        setHistory([]);
      } else {
        setHistory((prev) => [
          ...prev,
          { type: 'prompt', content: cmd },
          ...output,
        ]);
      }

      if (cmd.trim()) setCmdHistory((prev) => [cmd, ...prev]);
      setInput('');
      setHistoryIdx(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIdx - 1;
      if (next < 0) { setHistoryIdx(-1); setInput(''); }
      else { setHistoryIdx(next); setInput(cmdHistory[next] ?? ''); }
    }
  }

  return (
    <div
      className="font-mono text-sm bg-surface border border-border p-4 overflow-x-auto"
      role="region"
      aria-label="Interactive terminal"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Boot sequence */}
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

      {/* Interactive history */}
      {history.map((line, i) => (
        <div key={`h-${i}`} className="leading-7">
          {line.type === 'prompt' && (
            <span>
              <span className="text-accent select-none mr-1.5">❯</span>
              <span className="text-fg">{line.content}</span>
            </span>
          )}
          {line.type === 'output' && (
            <span className="text-fg-secondary pl-5">{line.content}</span>
          )}
          {line.type === 'error' && (
            <span className="text-red-400 pl-5">{line.content}</span>
          )}
        </div>
      ))}

      {/* Interactive input prompt */}
      {done && (
        <div className="leading-7 flex items-center">
          <span className="text-accent select-none mr-1.5" aria-hidden="true">❯</span>
          <span className="relative flex-1">
            <span className="text-fg invisible" aria-hidden="true">{input || ' '}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="absolute inset-0 w-full bg-transparent text-fg outline-none border-none caret-accent"
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
