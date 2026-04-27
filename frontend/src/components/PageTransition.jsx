import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div className="relative min-h-[calc(100vh-88px)] overflow-hidden">
      <motion.div
        initial={{ opacity: 0.45, scaleY: 1 }}
        animate={{ opacity: 0, scaleY: 0 }}
        exit={{ opacity: 0.45, scaleY: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="pointer-events-none absolute inset-0 origin-top bg-gradient-to-b from-sky-100/40 to-transparent dark:from-sky-900/30"
      />

      <motion.div
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
