// Replace SERVICES with live data from your metrics API once wired up.
// For now, values are manually maintained.

interface Service {
  name: string;
  description: string;
  status: 'ok' | 'warn' | 'error' | 'unknown';
  uptime?: string;
  latency?: string;
}

const SERVICES: Service[] = [
  {
    name: 'metrics-api',
    description: 'Prometheus exporter + REST facade',
    status: 'ok',
    uptime: '14d 6h',
    latency: '8ms',
  },
  {
    name: 'homelab k8s',
    description: '3-node k3s cluster, Raspberry Pi 5',
    status: 'ok',
    uptime: '30d',
  },
  {
    name: 'grafana',
    description: 'Metrics dashboard',
    status: 'ok',
    latency: '12ms',
  },
];

const LABEL: Record<string, string> = {
  ok: 'operational',
  warn: 'degraded',
  error: 'outage',
  unknown: 'unknown',
};

const DOT: Record<string, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  error: 'bg-error',
  unknown: 'bg-unknown',
};

const TEXT: Record<string, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  error: 'text-error',
  unknown: 'text-unknown',
};

export default function LabStatus() {
  return (
    <div className="font-mono text-xs" role="region" aria-label="Lab service status">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-fg-muted text-[10px] uppercase tracking-widest border-b border-border">
            <th className="text-left pb-3 font-normal">service</th>
            <th className="text-left pb-3 font-normal">status</th>
            <th className="text-right pb-3 font-normal hidden sm:table-cell">uptime</th>
            <th className="text-right pb-3 font-normal hidden sm:table-cell">p50</th>
          </tr>
        </thead>
        <tbody>
          {SERVICES.map((svc) => (
            <tr key={svc.name} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-4">
                <div className="text-fg">{svc.name}</div>
                <div className="text-fg-muted text-[10px] mt-0.5">{svc.description}</div>
              </td>
              <td className="py-3 pr-4">
                <span className={`flex items-center gap-1.5 ${TEXT[svc.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${DOT[svc.status]}`} aria-hidden="true" />
                  {LABEL[svc.status]}
                </span>
              </td>
              <td className="py-3 text-right text-fg-secondary font-tabular hidden sm:table-cell">
                {svc.uptime ?? '—'}
              </td>
              <td className="py-3 text-right text-fg-secondary font-tabular hidden sm:table-cell">
                {svc.latency ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
