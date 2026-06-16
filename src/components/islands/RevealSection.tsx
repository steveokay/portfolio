import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
}

export default function RevealSection({ children, delay = 0 }: Props) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
