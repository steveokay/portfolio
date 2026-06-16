import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

interface NodeDef { id: string; x: number; y: number; amber?: boolean }
interface EdgeDef { from: string; to: string; amber: boolean }

const NODES: NodeDef[] = [
  { id: 'github',      x: -4.2, y:  2.2 },
  { id: 'actions',     x:  0.0, y:  2.2 },
  { id: 'cloudflare',  x:  4.2, y:  2.2, amber: true },
  { id: 'homelab',     x: -1.8, y:  0.0 },
  { id: 'go',          x: -3.8, y: -1.6 },
  { id: 'metrics',     x:  0.6, y: -1.6, amber: true },
  { id: 'postgres',    x: -4.2, y: -3.2 },
  { id: 'redis',       x: -2.2, y: -3.2 },
  { id: 'prometheus',  x:  1.8, y: -3.2 },
];

const EDGES: EdgeDef[] = [
  { from: 'github',    to: 'actions',    amber: false },
  { from: 'actions',   to: 'cloudflare', amber: false },
  { from: 'actions',   to: 'homelab',    amber: false },
  { from: 'homelab',   to: 'go',         amber: false },
  { from: 'homelab',   to: 'metrics',    amber: false },
  { from: 'go',        to: 'postgres',   amber: false },
  { from: 'go',        to: 'redis',      amber: false },
  { from: 'metrics',   to: 'prometheus', amber: false },
  { from: 'metrics',   to: 'cloudflare', amber: true  },
];

function getNode(id: string) {
  return NODES.find(n => n.id === id)!;
}

function EdgeLine({ edge, index }: { edge: EdgeDef; index: number }) {
  const a = getNode(edge.from);
  const b = getNode(edge.to);

  const obj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(a.x, a.y, 0),
      new THREE.Vector3(b.x, b.y, 0),
    ]);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(edge.amber ? '#ffb000' : '#1e1e1e'),
      opacity: edge.amber ? 0.3 : 0.45,
      transparent: true,
    });
    return new THREE.Line(geo, mat);
  }, [a.x, a.y, b.x, b.y, edge.amber]);

  return <primitive key={index} object={obj} />;
}

interface PacketDef { edgeIdx: number; speed: number; offset: number }

function Packet({ edgeIdx, speed, offset }: PacketDef) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(offset);
  const edge = EDGES[edgeIdx];
  const a = getNode(edge.from);
  const b = getNode(edge.to);

  useFrame((_, delta) => {
    t.current = (t.current + speed * delta) % 1;
    const v = t.current;
    ref.current.position.x = a.x + (b.x - a.x) * v;
    ref.current.position.y = a.y + (b.y - a.y) * v;
  });

  const r = edge.amber ? 0.065 : 0.042;
  const color = edge.amber ? '#ffb000' : '#333333';
  const opacity = edge.amber ? 0.95 : 0.55;

  return (
    <mesh ref={ref} position={[a.x, a.y, 0.1]}>
      <circleGeometry args={[r, 8]} />
      <meshBasicMaterial color={color} opacity={opacity} transparent />
    </mesh>
  );
}

function NodeDot({ node }: { node: NodeDef }) {
  const color = node.amber ? '#ffb000' : '#2a2a2a';
  const opacity = node.amber ? 0.6 : 0.8;
  return (
    <mesh position={[node.x, node.y, 0.05]}>
      <circleGeometry args={[0.09, 8]} />
      <meshBasicMaterial color={color} opacity={opacity} transparent />
    </mesh>
  );
}

// Deterministic-looking but varied packet speeds
const PACKETS: PacketDef[] = EDGES.map((_, i) => ({
  edgeIdx: i,
  speed: 0.14 + ((i * 73 + 17) % 100) / 600,
  offset: ((i * 137 + 41) % 100) / 100,
}));

function Scene() {
  return (
    <>
      {EDGES.map((edge, i) => <EdgeLine key={i} edge={edge} index={i} />)}
      {NODES.map((node) => <NodeDot key={node.id} node={node} />)}
      {PACKETS.map((p, i) => <Packet key={i} {...p} />)}
    </>
  );
}

export default function NetworkGraph() {
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setReady(true);
  }, []);

  if (!ready || reduce) return <div className="absolute inset-0" aria-hidden="true" />;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ opacity: 0.55 }}>
      <Canvas
        orthographic
        camera={{ zoom: 85, position: [0, 0, 10], near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
