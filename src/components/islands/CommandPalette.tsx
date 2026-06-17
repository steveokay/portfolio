import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigate } from 'astro:transitions/client';

type Category = 'jump' | 'open' | 'external' | 'action';

interface Command {
  id: string;
  label: string;
  description?: string;
  category: Category;
  keywords?: string[];
  action: () => void;
}

function jumpTo(hash: string) {
  return () => {
    const onHome = location.pathname === '/' || location.pathname === '/index.html' || location.pathname === '';
    if (onHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/' + hash);
    }
  };
}

function openInternal(path: string) {
  return () => navigate(path);
}

function openExternal(url: string) {
  return () => window.open(url, '_blank', 'noopener,noreferrer');
}

const COMMANDS: Command[] = [
  { id: 'jump-about',    category: 'jump', label: 'Jump to about',    keywords: ['bio', 'who'],                action: jumpTo('#about') },
  { id: 'jump-work',     category: 'jump', label: 'Jump to work',     keywords: ['projects', 'case studies'],  action: jumpTo('#work') },
  { id: 'jump-stack',    category: 'jump', label: 'Jump to stack',    keywords: ['tools', 'tech'],             action: jumpTo('#stack') },
  { id: 'jump-lab',      category: 'jump', label: 'Jump to lab',      keywords: ['homelab', 'now'],            action: jumpTo('#lab') },
  { id: 'jump-writing',  category: 'jump', label: 'Jump to writing',  keywords: ['posts', 'blog', 'drafts'],   action: jumpTo('#writing') },
  { id: 'jump-contact',  category: 'jump', label: 'Jump to contact',  keywords: ['email', 'reach'],            action: jumpTo('#contact') },

  { id: 'work-latency',  category: 'open', label: 'Open work/latency-reduction', description: 'p99 cut 40%',     keywords: ['p99', 'performance', 'latency'], action: openInternal('/work/01-latency-reduction/') },
  { id: 'work-k8s',      category: 'open', label: 'Open work/k8s-migration',     description: 'EC2 → k3s',       keywords: ['kubernetes', 'k8s', 'migration'], action: openInternal('/work/02-infra-migration/') },
  { id: 'work-pipeline', category: 'open', label: 'Open work/pipeline-rebuild',  description: 'flake 6% → 0.4%', keywords: ['ci', 'cd', 'jenkins', 'pipeline'], action: openInternal('/work/03-pipeline-rebuild/') },

  { id: 'gh-repo',    category: 'external', label: 'Open github (this site source)', keywords: ['source', 'code', 'repo'], action: openExternal('https://github.com/steveokay/portfolio') },
  { id: 'gh-profile', category: 'external', label: 'Open github profile',             keywords: ['github', 'commits'],      action: openExternal('https://github.com/mokaysteve') },
  { id: 'email',      category: 'external', label: 'Send email',                      keywords: ['mail', 'contact'],        action: () => { location.href = 'mailto:mokaysteve@gmail.com'; } },

  { id: 'copy-url',   category: 'action', label: 'Copy link to current page', keywords: ['share', 'url'], action: () => { void navigator.clipboard.writeText(location.href); } },
  { id: 'copy-email', category: 'action', label: 'Copy email to clipboard',  keywords: ['mail'],          action: () => { void navigator.clipboard.writeText('mokaysteve@gmail.com'); } },
];

const REDUCE = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return COMMANDS;
    const tokens = q.split(/\s+/);
    return COMMANDS.filter((cmd) => {
      const hay = [cmd.label, cmd.description ?? '', cmd.category, ...(cmd.keywords ?? [])]
        .join(' ')
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    function onOpen() { setOpen(true); }
    window.addEventListener('cmdk:open', onOpen);
    return () => window.removeEventListener('cmdk:open', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => { clearTimeout(t); document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(Math.max(0, filtered.length - 1));
  }, [filtered.length, activeIdx]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(Math.max(0, filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[activeIdx];
      if (cmd) { cmd.action(); setOpen(false); }
    }
  }

  const transition = REDUCE ? { duration: 0 } : { duration: 0.14 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[14vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            className="relative w-full max-w-[560px] bg-surface border border-border shadow-[0_24px_72px_-12px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, scale: REDUCE ? 1 : 0.96, y: REDUCE ? 0 : -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: REDUCE ? 1 : 0.96, y: REDUCE ? 0 : -8 }}
            transition={transition}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border font-mono text-sm">
              <span className="text-accent select-none" aria-hidden="true">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                onKeyDown={handleKey}
                placeholder="Type a command…"
                className="flex-1 bg-transparent text-fg outline-none placeholder:text-fg-muted caret-accent"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Search commands"
                aria-controls="cmdk-list"
                aria-activedescendant={filtered[activeIdx] ? `cmd-${filtered[activeIdx].id}` : undefined}
              />
              <kbd className="text-[10px] text-fg-muted border border-border px-1 py-0.5 leading-none">esc</kbd>
            </div>

            <ul
              ref={listRef}
              id="cmdk-list"
              role="listbox"
              aria-label="Available commands"
              className="max-h-[50vh] overflow-y-auto py-1"
            >
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-fg-muted font-mono text-xs text-center">
                  no commands match "{query}"
                </li>
              )}
              {filtered.map((cmd, i) => (
                <li
                  key={cmd.id}
                  id={`cmd-${cmd.id}`}
                  data-idx={i}
                  role="option"
                  aria-selected={i === activeIdx}
                  className={`px-4 py-2 flex items-center justify-between gap-4 cursor-pointer font-mono text-sm border-l-2 ${
                    i === activeIdx
                      ? 'bg-accent-subtle border-accent text-fg'
                      : 'border-transparent text-fg-secondary'
                  }`}
                  onClick={() => { cmd.action(); setOpen(false); }}
                  onMouseMove={() => setActiveIdx(i)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] uppercase shrink-0 tracking-widest ${i === activeIdx ? 'text-accent' : 'text-fg-muted'}`}>
                      {cmd.category}
                    </span>
                    <span className="truncate">{cmd.label}</span>
                  </div>
                  {cmd.description && (
                    <span className="text-[10px] text-fg-muted shrink-0 hidden sm:block">{cmd.description}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-4 py-2 flex items-center justify-between font-mono text-[10px] text-fg-muted">
              <span>
                <kbd className="border border-border px-1 leading-none">↑↓</kbd> navigate
                <kbd className="border border-border px-1 leading-none ml-3">↵</kbd> select
              </span>
              <span className="font-tabular">{filtered.length}/{COMMANDS.length}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
