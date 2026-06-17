import { useState, useEffect, useRef } from 'react';

type LineType = 'prompt' | 'output' | 'comment' | 'error';

interface FullLine {
  type: LineType;
  content: string;
}

interface CmdCtx {
  startedAt: number;
  cmdHistory: string[];
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

const WORK_SLUGS: Record<string, string> = {
  'latency-reduction': '/work/01-latency-reduction/',
  'k8s-migration': '/work/02-infra-migration/',
  'pipeline-rebuild': '/work/03-pipeline-rebuild/',
};

// ── helpers ───────────────────────────────────────────────────────────────

function pad(n: number, w = 2) { return n.toString().padStart(w, '0'); }

function formatUptime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${h}h ${m}m ${pad(s)}s` : `${m}m ${pad(s)}s`;
}

function out(content: string): FullLine { return { type: 'output', content }; }
function err(content: string): FullLine { return { type: 'error', content }; }

// ── command implementations ──────────────────────────────────────────────

function cmdHelp(includeHidden = false): FullLine[] {
  const visible: FullLine[] = [
    out('available commands:'),
    out('  whoami            print current user'),
    out('  cat ./about.txt   print bio'),
    out('  ls ./work/        list case studies'),
    out('  ls ./drafts/      list writing drafts'),
    out('  open <slug>       navigate to case study'),
    out('  tree ./work/      show case studies as a tree'),
    out('  date              show current date'),
    out('  uptime            show session uptime'),
    out('  clear             clear interactive history'),
    out(''),
    out("pro tip: press ⌘K (ctrl+K) anywhere for site-wide navigation"),
  ];
  if (!includeHidden) {
    visible.splice(visible.length - 2, 0, out(''));
    visible.splice(visible.length - 2, 0, out("  help --hidden     reveal more commands"));
    return visible;
  }
  return [
    ...visible.slice(0, -2),
    out(''),
    out('hidden commands:'),
    out('  top / htop        show fake process list'),
    out('  pwd               print working directory'),
    out('  echo <msg>        echo a message'),
    out('  cowsay <msg>      ASCII cow says <msg>'),
    out('  history           show command history'),
    out('  whoami --verbose  longer bio'),
    out('  vim               (good luck)'),
    out('  sudo <anything>   no'),
    out('  exit / logout     futile'),
    ...visible.slice(-2),
  ];
}

function cmdUptime(now: Date, startedAt: number): FullLine[] {
  const elapsed = Math.max(0, Math.floor((now.getTime() - startedAt) / 1000));
  const time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  // mimic real `uptime` output
  return [out(`${time} up ${formatUptime(elapsed)},  1 user,  load average: 0.42, 0.38, 0.51`)];
}

function cmdDate(now: Date): FullLine[] {
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getUTCDay()];
  const month   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getUTCMonth()];
  const day = pad(now.getUTCDate());
  const time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  return [out(`${weekday} ${month} ${day} ${time} UTC ${now.getUTCFullYear()}`)];
}

function cmdTop(now: Date, startedAt: number): FullLine[] {
  const upStr = formatUptime(Math.max(0, Math.floor((now.getTime() - startedAt) / 1000)));
  const time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  return [
    out(`top - ${time} up ${upStr},  1 user,  load avg: 0.42, 0.38, 0.51`),
    out(`Tasks:   7 total,   6 running,   1 sleeping,   0 stopped,   0 zombie`),
    out(`%Cpu(s):  3.2 us,  1.1 sy,  0.0 ni, 95.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st`),
    out(``),
    out(`  PID  USER     %CPU  %MEM  COMMAND`),
    out(` 1247  steve    14.3   2.8  terminal-island (react)`),
    out(` 1342  steve     6.8   4.2  networkgraph-r3f (three.js)`),
    out(` 1418  steve     3.1   1.4  livemetrics-poll`),
    out(` 1521  steve     2.4   0.9  command-palette`),
    out(` 1612  steve     1.8   0.7  view-transitions`),
    out(` 1701  steve     0.9   0.3  status-bar (tick)`),
    out(` 1812  steve     0.1   0.1  loader-boot (idle)`),
  ];
}

function cmdTree(): FullLine[] {
  return [
    out('./work/'),
    out('├── 01-latency-reduction/    p99 cut 40%'),
    out('│   ├── README.mdx'),
    out('│   └── diagram.svg'),
    out('├── 02-infra-migration/      EC2 → k3s, zero-downtime'),
    out('│   ├── README.mdx'),
    out('│   └── diagram.svg'),
    out('└── 03-pipeline-rebuild/     flake 6% → 0.4%'),
    out('    ├── README.mdx'),
    out('    └── diagram.svg'),
    out(''),
    out('3 directories, 6 files'),
  ];
}

function cmdCowsay(msg: string): FullLine[] {
  const text = msg.trim() || 'moo';
  const len = text.length;
  const top = ' ' + '_'.repeat(len + 2);
  const bot = ' ' + '-'.repeat(len + 2);
  return [
    out(top),
    out(`< ${text} >`),
    out(bot),
    out('        \\   ^__^'),
    out('         \\  (oo)\\_______'),
    out('            (__)\\       )\\/\\'),
    out('                ||----w |'),
    out('                ||     ||'),
  ];
}

function cmdVim(): FullLine[] {
  return [
    out('~'),
    out('~'),
    out('~'),
    out('~'),
    out('~'),
    out('"untitled.txt" [New File]                                          0,0-1     All'),
    out(':'),
    out(''),
    out("(to escape vim, type ':q' below. you have ~30 years of company.)"),
  ];
}

function cmdWhoamiVerbose(): FullLine[] {
  return [
    out('steve-mokay'),
    out('───'),
    out('backend & infrastructure engineer · 6yr'),
    out('go · kubernetes · postgres · terraform · cloudflare'),
    out('built services at 50k req/s · keeps p99 in check'),
    out('runs a homelab to keep the production reflexes warm'),
    out(''),
    out('   contact: mokaysteve@gmail.com'),
    out('   github:  github.com/steveokay'),
  ];
}

function cmdHistory(history: string[]): FullLine[] {
  if (history.length === 0) return [out('(no history yet)')];
  // history is stored most-recent-first; render oldest-first with indices
  return history.slice().reverse().map((cmd, i) => out(`  ${pad(i + 1, 4)}  ${cmd}`));
}

// ── dispatch ─────────────────────────────────────────────────────────────

function processCommand(raw: string, ctx: CmdCtx): FullLine[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const cmd = trimmed.toLowerCase();
  const now = new Date();

  if (cmd === 'clear') return [{ type: 'comment', content: '__clear__' }];

  // exact matches
  switch (cmd) {
    case 'whoami':                  return [out('steve-mokay')];
    case 'whoami --verbose':
    case 'whoami -v':               return cmdWhoamiVerbose();
    case 'help':                    return cmdHelp(false);
    case 'help --hidden':
    case 'help -a':
    case 'help --all':              return cmdHelp(true);
    case 'cat ./about.txt':
    case 'cat about.txt':           return [
      out('Backend & infra engineer. 6yr. Go, k8s, Postgres.'),
      out('Built services at 50k req/s. Keeps p99 in check.'),
    ];
    case 'ls':
    case 'ls ./work/':
    case 'ls work/':
    case 'ls work':                 return [out('latency-reduction/  k8s-migration/  pipeline-rebuild/')];
    case 'ls ./drafts/':
    case 'ls drafts/':
    case 'ls drafts':               return [
      out('tracing-hot-paths-in-go-with-pprof.md         [draft]'),
      out('zero-downtime-migrations-at-50k-req-s.md      [draft]'),
      out('what-six-percent-flaky-tests-actually-cost.md [draft]'),
    ];
    case 'tree':
    case 'tree ./work/':
    case 'tree work':
    case 'tree work/':              return cmdTree();
    case 'pwd':                     return [out('/home/steve-mokay/portfolio')];
    case 'date':                    return cmdDate(now);
    case 'uptime':                  return cmdUptime(now, ctx.startedAt);
    case 'top':
    case 'htop':                    return cmdTop(now, ctx.startedAt);
    case 'history':                 return cmdHistory(ctx.cmdHistory);
    case 'vim':
    case 'nvim':
    case 'vi':                      return cmdVim();
    case ':q':
    case ':q!':
    case ':wq':
    case ':wq!':
    case ':x':                      return [out('q: thank you. you are free now.')];
    case 'exit':
    case 'logout':
    case 'quit':                    return [err('not allowed: you are inside a portfolio. there is no escape.')];
    case 'man':                     return [out('rtfm not implemented. type \'help\' instead.')];
    case 'sudo':                    return [err('usage: sudo <command>. (it won\'t work anyway.)')];
    case 'rm':
    case 'rm -rf /':
    case 'rm -rf':
    case 'rm /':                    return [err('nice try.')];
  }

  // pattern matches (case-preserving for echo / cowsay args)
  const sudoMatch = trimmed.match(/^sudo\s+(.+)/i);
  if (sudoMatch) {
    const target = sudoMatch[1].split(/\s+/)[0];
    return [
      err(`Sorry, user 'steve-mokay' is not in the sudoers file.`),
      err(`This incident will be reported (tried: ${target}).`),
    ];
  }

  const cowMatch = trimmed.match(/^cowsay\s+(.+)/i);
  if (cowMatch) return cmdCowsay(cowMatch[1]);

  const echoMatch = trimmed.match(/^echo\s+(.+)/i);
  if (echoMatch) return [out(echoMatch[1])];

  if (cmd.startsWith('rm ') || cmd === 'rm') {
    return [err('nice try.')];
  }

  const openMatch = cmd.match(/^open\s+(\S+)/);
  if (openMatch) {
    const slug = openMatch[1];
    if (WORK_SLUGS[slug]) {
      window.location.href = WORK_SLUGS[slug];
      return [out(`navigating to ${slug}...`)];
    }
    return [err(`open: no case study '${slug}'. try ls ./work/`)];
  }

  // matches the classic git-cli unknown-command hint
  return [err(`command not found: ${trimmed}. type 'help' for commands.`)];
}

// ── boot sequence steps ──────────────────────────────────────────────────

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

// ── component ────────────────────────────────────────────────────────────

export default function Terminal() {
  const [lines, setLines] = useState<FullLine[]>([]);
  const [done, setDone] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<FullLine[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    document.getElementById('terminal-seed')?.remove();
    startedAtRef.current = Date.now();

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
      const output = processCommand(cmd, {
        startedAt: startedAtRef.current,
        cmdHistory,
      });

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
        <div key={i} className="leading-7 whitespace-pre">
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
        <div key={`h-${i}`} className="leading-7 whitespace-pre">
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
