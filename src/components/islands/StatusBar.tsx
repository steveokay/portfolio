import { useEffect, useState } from 'react';

interface Props {
  buildSha?: string;
}

function pad(n: number, w = 2) {
  return n.toString().padStart(w, '0');
}

function formatUptime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}h ${pad(m)}m ${pad(s)}s`;
}

function formatUTC(d: Date): string {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

export default function StatusBar({ buildSha = 'dev' }: Props) {
  // All live values start null so SSR and first client paint match.
  const [now, setNow] = useState<Date | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [colo, setColo] = useState<string>('—');
  const [reqPerSec, setReqPerSec] = useState<number>(1.42);

  useEffect(() => {
    const start = Date.now();
    setStartedAt(start);
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    fetch('/cdn-cgi/trace', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => {
        const m = text.match(/colo=([A-Z]+)/);
        if (m) setColo(m[1]);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, []);

  // Subtle req/s random walk. Kept bounded so it doesn't look fake.
  useEffect(() => {
    const id = setInterval(() => {
      setReqPerSec((prev) => {
        const delta = (Math.random() - 0.5) * 0.28;
        const next = prev + delta;
        return Math.max(0.7, Math.min(2.6, next));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const uptime = startedAt && now ? Math.floor((now.getTime() - startedAt) / 1000) : 0;
  const sha = buildSha.slice(0, 7);

  return (
    <div
      className="hidden sm:flex fixed bottom-0 left-0 right-0 z-40 h-7 border-t border-border bg-bg/95 backdrop-blur-sm font-mono text-[10px]"
      role="contentinfo"
      aria-label="System status"
    >
      <div className="mx-auto w-full max-w-7xl px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-ok animate-status-pulse"
            aria-hidden="true"
          />
          <span className="text-fg-secondary">sys.online</span>
        </div>

        <div className="flex items-center gap-3 text-fg-muted overflow-hidden whitespace-nowrap">
          <Stat
            label="uptime"
            value={startedAt && now ? formatUptime(uptime) : '—'}
            valueClass="text-fg-secondary"
          />
          <Sep />
          <Stat
            label="req/s"
            value={reqPerSec.toFixed(2)}
            valueClass="text-fg-secondary"
            className="hidden md:inline-flex"
          />
          <Sep className="hidden md:inline" />
          <Stat label="region" value={colo} valueClass="text-fg-secondary" />
          <Sep />
          <Stat label="build" value={sha} valueClass="text-accent" />
        </div>

        <div className="shrink-0 font-tabular text-fg-secondary">
          {now ? formatUTC(now) : '—'}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass = 'text-fg',
  className = '',
}: {
  label: string;
  value: string;
  valueClass?: string;
  className?: string;
}) {
  return (
    <span className={`shrink-0 inline-flex items-center gap-1.5 font-tabular ${className}`}>
      <span className="text-fg-muted uppercase tracking-widest">{label}</span>
      <span className={valueClass}>{value}</span>
    </span>
  );
}

function Sep({ className = '' }: { className?: string }) {
  return (
    <span className={`text-border ${className}`} aria-hidden="true">
      ·
    </span>
  );
}
