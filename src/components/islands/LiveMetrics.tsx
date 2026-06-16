import { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  status: 'ok' | 'warn' | 'error';
  latencyMs: number;
}

interface MetricsData {
  uptime: string;
  requestsPerSecond: number;
  lastDeploy: string;
  status: 'ok' | 'degraded' | 'error';
  services: ServiceStatus[];
}

interface Props {
  buildTime: string;
}

const METRICS_URL = (import.meta as Record<string, Record<string, string>>).env
  ?.PUBLIC_METRICS_API_URL ?? '';

const DOT: Record<string, string> = {
  ok: '#22c55e',
  warn: '#f59e0b',
  degraded: '#f59e0b',
  error: '#ef4444',
};

function formatBuildTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// Skeleton shown when API is unreachable or URL not set.
// Shows real build timestamp so the widget always has meaningful content.
function Skeleton({ buildTime, connecting }: { buildTime: string; connecting: boolean }) {
  return (
    <div className="font-mono text-xs" role="region" aria-label="Live system metrics">
      <div className="flex flex-wrap gap-8 mb-4">
        <Stat label="uptime" value="—" dim />
        <Stat label="req/s" value="—" dim />
        <Stat label="last deploy" value={formatBuildTime(buildTime)} />
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent"
            style={{ animation: connecting ? 'status-pulse 2.4s ease-in-out infinite' : 'none' }}
            aria-hidden="true"
          />
          <span className="text-fg-muted">
            {connecting ? 'connecting' : 'metrics offline'}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap gap-4 border-t border-border pt-3">
        {['metrics-api', 'k8s', 'grafana'].map((name) => (
          <span key={name} className="flex items-center gap-1.5 text-fg-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-muted" aria-hidden="true" />
            {name}
            <span className="font-tabular text-fg-muted">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LiveMetrics({ buildTime }: Props) {
  const [data, setData] = useState<MetricsData | null>(null);
  const [state, setState] = useState<'loading' | 'live' | 'unreachable'>('loading');

  useEffect(() => {
    if (!METRICS_URL) {
      setState('unreachable');
      return;
    }

    const poll = async () => {
      try {
        const res = await fetch(`${METRICS_URL}/metrics`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error('non-2xx');
        setData(await res.json());
        setState('live');
      } catch {
        setState('unreachable');
      }
    };

    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  if (state === 'loading') {
    return <Skeleton buildTime={buildTime} connecting={true} />;
  }

  if (state === 'unreachable' || !data) {
    return <Skeleton buildTime={buildTime} connecting={!!METRICS_URL} />;
  }

  return (
    <div className="font-mono text-xs" role="region" aria-label="Live system metrics">
      <div className="flex flex-wrap gap-8 mb-4">
        <Stat label="uptime" value={data.uptime} />
        <Stat label="req/s" value={data.requestsPerSecond.toLocaleString()} />
        <Stat label="last deploy" value={data.lastDeploy || formatBuildTime(buildTime)} />
        <span className="flex items-center gap-1.5" aria-label={`overall: ${data.status}`}>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: DOT[data.status] }}
            aria-hidden="true"
          />
          <span className="text-fg-secondary">{data.status}</span>
        </span>
      </div>

      {data.services.length > 0 && (
        <div className="flex flex-wrap gap-4 border-t border-border pt-3">
          {data.services.map((svc) => (
            <span key={svc.name} className="flex items-center gap-1.5 text-fg-muted">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: DOT[svc.status] }}
                aria-hidden="true"
              />
              {svc.name}
              <span className="font-tabular">{svc.latencyMs}ms</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, dim }: { label: string; value: string | number; dim?: boolean }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="text-fg-muted text-[10px] uppercase tracking-widest">{label}</span>
      <span className={`font-tabular ${dim ? 'text-fg-muted' : 'text-fg'}`}>{value}</span>
    </span>
  );
}
