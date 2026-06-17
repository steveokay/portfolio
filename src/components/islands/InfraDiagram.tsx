import { useState } from 'react';

type NodeId =
  | 'github' | 'actions' | 'cloudflare'
  | 'go' | 'metrics-api' | 'postgres' | 'redis' | 'prometheus' | 'grafana';

interface NodeMeta {
  label: string;
  detail: string;
}

const NODE_META: Record<NodeId, NodeMeta> = {
  github:       { label: 'GitHub',           detail: 'Source of truth. Push to main triggers the pipeline.' },
  actions:      { label: 'GitHub Actions',   detail: 'Builds, tests, deploys site and provisions infra via Terraform.' },
  cloudflare:   { label: 'Cloudflare Pages', detail: 'Static site CDN. Global edge, zero cold starts.' },
  go:           { label: 'Go services',      detail: '~50k req/s HTTP. Talks to Postgres, Redis, and the metrics API.' },
  'metrics-api':{ label: 'metrics-api',      detail: 'Public endpoint on the homelab. Feeds live data to the portfolio.' },
  postgres:     { label: 'PostgreSQL',       detail: 'Primary data store. Single JOIN queries, no ORM.' },
  redis:        { label: 'Redis',            detail: 'Read-through cache. TTL=60s for reference data. 82% hit rate.' },
  prometheus:   { label: 'Prometheus',       detail: 'Scrapes Go services every 15s. Powers Grafana dashboards.' },
  grafana:      { label: 'Grafana',          detail: 'Internal observability. Not public, but it\'s real.' },
};

// Each path links a set of node IDs it connects
interface PathDef {
  id: string;
  nodes: NodeId[];
  d: string;         // SVG path/polyline points (simplified to polyline for most)
  isPolyline?: boolean;
  strokeBase: string;
  strokeHover: string;
  strokeWidth?: number;
  dashed?: boolean;
  markerEnd?: 'ha' | 'hm' | 'hd';
  label?: string;
  labelX?: number;
  labelY?: number;
  labelRotate?: number;
}

const PATHS: PathDef[] = [
  {
    id: 'git-push',
    nodes: ['github', 'actions'],
    d: '149,62 286,62',
    isPolyline: true,
    strokeBase: '#333',
    strokeHover: '#888',
    markerEnd: 'hm',
    label: 'git push',
    labelX: 218,
    labelY: 55,
  },
  {
    id: 'deploy-site',
    nodes: ['actions', 'cloudflare'],
    d: '479,62 626,62',
    isPolyline: true,
    strokeBase: '#333',
    strokeHover: '#888',
    markerEnd: 'hm',
    label: 'deploy site',
    labelX: 553,
    labelY: 55,
  },
  {
    id: 'terraform',
    nodes: ['actions', 'go'],
    d: '383,87 383,126 220,126 220,163',
    isPolyline: true,
    strokeBase: '#252525',
    strokeHover: '#666',
    markerEnd: 'hd',
    dashed: true,
    label: 'terraform apply · deploy infra',
    labelX: 306,
    labelY: 120,
  },
  {
    id: 'go-postgres',
    nodes: ['go', 'postgres'],
    d: '80,234 80,254',
    isPolyline: true,
    strokeBase: '#222',
    strokeHover: '#555',
    markerEnd: 'hd',
  },
  {
    id: 'go-redis',
    nodes: ['go', 'redis'],
    d: '118,234 170,254',
    isPolyline: true,
    strokeBase: '#222',
    strokeHover: '#555',
    markerEnd: 'hd',
  },
  {
    id: 'go-metrics',
    nodes: ['go', 'metrics-api'],
    d: '163,213 426,213',
    isPolyline: true,
    strokeBase: '#2a2a2a',
    strokeHover: '#777',
    markerEnd: 'hm',
    label: 'export metrics',
    labelX: 295,
    labelY: 208,
  },
  {
    id: 'live-poll',
    nodes: ['metrics-api', 'cloudflare'],
    d: '540,213 592,213 592,62 626,62',
    isPolyline: true,
    strokeBase: '#ffb000',
    strokeHover: '#ffd060',
    strokeWidth: 1.5,
    markerEnd: 'ha',
    label: 'live metrics poll',
    labelX: 601,
    labelY: 138,
    labelRotate: -90,
  },
];

// Which paths to highlight when a node is hovered
function getActivePaths(node: NodeId | null): Set<string> {
  if (!node) return new Set();
  return new Set(PATHS.filter((p) => p.nodes.includes(node)).map((p) => p.id));
}

interface TooltipState {
  id: NodeId;
  x: number;
  y: number;
}

export default function InfraDiagram() {
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const activePaths = getActivePaths(hovered);

  const nodeProps = (id: NodeId, cx: number, cy: number) => ({
    onMouseEnter: (e: React.MouseEvent) => {
      setHovered(id);
      setTooltip({ id, x: cx, y: cy });
    },
    onMouseLeave: () => { setHovered(null); setTooltip(null); },
    style: { cursor: 'default' },
  });

  const pathStroke = (p: PathDef) => {
    const active = activePaths.has(p.id);
    if (!hovered) return p.strokeBase;
    return active ? p.strokeHover : p.strokeBase;
  };

  const nodeOpacity = (id: NodeId) => {
    if (!hovered) return 1;
    const active = PATHS.some((p) => activePaths.has(p.id) && p.nodes.includes(id));
    return active || id === hovered ? 1 : 0.35;
  };

  return (
    <figure className="mb-14 overflow-x-auto" aria-label="Infrastructure architecture diagram">
      <svg
        viewBox="0 0 820 305"
        width="100%"
        style={{ minWidth: 560 }}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily='"Commit Mono", "JetBrains Mono", Menlo, monospace'
        role="img"
        aria-labelledby="infra-title"
      >
        <title id="infra-title">
          Interactive infrastructure diagram. Hover nodes to highlight data-flow paths.
        </title>

        <defs>
          <marker id="ha" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0,0.5 0,6.5 6.5,3.5" fill="#ffb000" />
          </marker>
          <marker id="hm" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0,0.5 0,6.5 6.5,3.5" fill="#555555" />
          </marker>
          <marker id="hd" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0,0.5 0,6.5 6.5,3.5" fill="#333333" />
          </marker>
          {/* Hover marker variants */}
          <marker id="ha-h" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0,0.5 0,6.5 6.5,3.5" fill="#ffd060" />
          </marker>
          <marker id="hm-h" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0,0.5 0,6.5 6.5,3.5" fill="#888888" />
          </marker>
          <marker id="hd-h" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0,0.5 0,6.5 6.5,3.5" fill="#666666" />
          </marker>
        </defs>

        {/* ── Paths ── */}
        {PATHS.map((p) => {
          const active = activePaths.has(p.id);
          const stroke = pathStroke(p);
          const marker = p.markerEnd
            ? `url(#${p.markerEnd}${active && hovered ? '-h' : ''})`
            : undefined;
          return (
            <g key={p.id} style={{ transition: 'opacity 0.15s ease' }}>
              <polyline
                points={p.d}
                fill="none"
                stroke={stroke}
                strokeWidth={p.strokeWidth ?? 1}
                strokeDasharray={p.dashed ? '5,3' : undefined}
                markerEnd={marker}
                style={{ transition: 'stroke 0.15s ease' }}
              />
              {p.label && (
                <text
                  x={p.labelRotate ? 0 : p.labelX}
                  y={p.labelRotate ? 0 : p.labelY}
                  fill={stroke}
                  textAnchor="middle"
                  fontSize={9}
                  transform={p.labelRotate ? `translate(${p.labelX},${p.labelY}) rotate(${p.labelRotate})` : undefined}
                  style={{ transition: 'fill 0.15s ease' }}
                >
                  {p.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── ROW 1: CI/CD ── */}
        <g opacity={nodeOpacity('github')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('github', 84, 62)}>
          <rect x="20" y="38" width="128" height="48" rx="2" fill="#111" stroke={hovered === 'github' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="84" y="59" fill="#e2e2e2" textAnchor="middle" fontSize="11" fontWeight="500">GitHub</text>
          <text x="84" y="74" fill="#555" textAnchor="middle" fontSize="9.5">repo · main branch</text>
        </g>

        <g opacity={nodeOpacity('actions')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('actions', 383, 62)}>
          <rect x="288" y="38" width="190" height="48" rx="2" fill="#111" stroke={hovered === 'actions' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="383" y="59" fill="#e2e2e2" textAnchor="middle" fontSize="11" fontWeight="500">GitHub Actions</text>
          <text x="383" y="74" fill="#555" textAnchor="middle" fontSize="9.5">build · test · deploy</text>
        </g>

        <g opacity={nodeOpacity('cloudflare')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('cloudflare', 714, 62)}>
          <rect x="628" y="38" width="172" height="48" rx="2" fill="#111" stroke={hovered === 'cloudflare' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="714" y="58" fill="#e2e2e2" textAnchor="middle" fontSize="11" fontWeight="500">Cloudflare Pages</text>
          <text x="714" y="73" fill="#555" textAnchor="middle" fontSize="9.5">CDN · static · global</text>
        </g>

        {/* ── ROW 2: Homelab container ── */}
        <rect x="20" y="165" width="540" height="130" rx="2" fill="none" stroke="#1e1e1e" strokeWidth="1" strokeDasharray="6,3" />
        <text x="32" y="181" fill="#2c2c2c" fontSize="9" letterSpacing="0.06em">HOMELAB · k3s · Raspberry Pi 5 · IaC: Terraform</text>

        <g opacity={nodeOpacity('go')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('go', 101, 213)}>
          <rect x="40" y="192" width="122" height="42" rx="2" fill="#111" stroke={hovered === 'go' ? '#ffb000' : '#2a2a2a'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="101" y="211" fill="#e2e2e2" textAnchor="middle" fontSize="11" fontWeight="500">Go services</text>
          <text x="101" y="225" fill="#555" textAnchor="middle" fontSize="9.5">~50k req/s · HTTP</text>
        </g>

        <g opacity={nodeOpacity('metrics-api')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('metrics-api', 484, 213)}>
          <rect x="428" y="192" width="112" height="42" rx="2" fill="#111" stroke={hovered === 'metrics-api' ? '#ffb000' : 'rgba(255,176,0,0.55)'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="484" y="211" fill="#ffb000" textAnchor="middle" fontSize="11" fontWeight="500">metrics-api</text>
          <text x="484" y="225" fill="#cc8c00" textAnchor="middle" fontSize="9.5">public · /metrics</text>
        </g>

        {/* Data tier */}
        <g opacity={nodeOpacity('postgres')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('postgres', 82, 270)}>
          <rect x="40" y="256" width="85" height="28" rx="2" fill="#111" stroke={hovered === 'postgres' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="82" y="274" fill="#555" textAnchor="middle" fontSize="10.5">Postgres</text>
        </g>

        <g opacity={nodeOpacity('redis')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('redis', 170, 270)}>
          <rect x="136" y="256" width="68" height="28" rx="2" fill="#111" stroke={hovered === 'redis' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="170" y="274" fill="#555" textAnchor="middle" fontSize="10.5">Redis</text>
        </g>

        <g opacity={nodeOpacity('prometheus')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('prometheus', 269, 270)}>
          <rect x="216" y="256" width="106" height="28" rx="2" fill="#111" stroke={hovered === 'prometheus' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="269" y="274" fill="#555" textAnchor="middle" fontSize="10.5">Prometheus</text>
        </g>

        <g opacity={nodeOpacity('grafana')} style={{ transition: 'opacity 0.15s ease' }} {...nodeProps('grafana', 374, 270)}>
          <rect x="334" y="256" width="80" height="28" rx="2" fill="#111" stroke={hovered === 'grafana' ? '#ffb000' : '#1e1e1e'} strokeWidth="1" style={{ transition: 'stroke 0.15s ease' }} />
          <text x="374" y="274" fill="#555" textAnchor="middle" fontSize="10.5">Grafana</text>
        </g>

        {/* ── Tooltip ── */}
        {tooltip && (() => {
          const meta = NODE_META[tooltip.id];
          const tw = 210;
          // Clamp so tooltip stays within viewBox
          const tx = Math.min(Math.max(tooltip.x - tw / 2, 4), 820 - tw - 4);
          const ty = tooltip.y < 160 ? tooltip.y + 36 : tooltip.y - 52;
          return (
            <g>
              <rect x={tx} y={ty} width={tw} height={40} rx="2" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
              <text x={tx + 8} y={ty + 14} fill="#ffb000" fontSize="9.5" fontWeight="500">{meta.label}</text>
              <foreignObject x={tx + 8} y={ty + 19} width={tw - 16} height={20}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: 8.5, color: '#888', lineHeight: 1.4, fontFamily: 'inherit' }}>
                  {meta.detail}
                </div>
              </foreignObject>
            </g>
          );
        })()}
      </svg>

      {/* Hint */}
      <p className="font-mono text-[10px] text-fg-muted mt-3 text-center tracking-widest">
        hover nodes to trace data flow
      </p>
    </figure>
  );
}
