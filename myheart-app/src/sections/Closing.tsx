import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import { HER_SHORT, HIM_SHORT } from '../lib/constants';
import confetti from 'canvas-confetti';

export default function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  function celebrate() {
    const colors = ['#fbf7f0', '#e7d6bb', '#d8a8a0', '#a08a6a', '#ffffff'];
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.7 }, colors });
    setTimeout(() => confetti({ particleCount: 80, spread: 140, origin: { x: 0.2, y: 0.6 }, colors }), 200);
    setTimeout(() => confetti({ particleCount: 80, spread: 140, origin: { x: 0.8, y: 0.6 }, colors }), 400);
  }

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse, rgba(240,217,212,0.45), transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
        >
          <div
            className="text-xs uppercase tracking-[0.5em] mb-6"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            una cosa más
          </div>

          <h2
            className="mb-8 italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4.2vw, 3rem)',
              color: 'var(--color-ink)',
              fontWeight: 400,
              lineHeight: 1.25,
            }}
          >
            “Si tuviera que escoger entre todas las versiones del mundo,
            elegiría siempre la que tiene tu risa adentro.”
          </h2>

          <div
            className="mb-12 text-lg md:text-xl"
            style={{ fontFamily: 'var(--font-script)', color: 'var(--color-rose)', fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {HIM_SHORT} para {HER_SHORT}
          </div>

          <motion.button
            onClick={celebrate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm uppercase tracking-[0.3em] shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--color-rose), var(--color-sand))',
              color: 'var(--color-cream)',
            }}
          >
            <Heart size={16} fill="currentColor" className="heartbeat" />
            tócame
            <Heart size={16} fill="currentColor" className="heartbeat" />
          </motion.button>

          <div
            className="mt-16 text-[0.65rem] uppercase tracking-[0.4em]"
            style={{ color: 'var(--color-bronze)' }}
          >
            te quiero · te quiero · te quiero · te quiero · te quiero
          </div>
        </motion.div>
      </div>
    </section>
  );
}
