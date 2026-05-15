import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { durationSinceAnniversary, type Duration } from '../lib/time';
import { Heart } from 'lucide-react';

const labels: { key: keyof Duration; label: string }[] = [
  { key: 'years', label: 'años' },
  { key: 'months', label: 'meses' },
  { key: 'days', label: 'días' },
  { key: 'hours', label: 'horas' },
  { key: 'minutes', label: 'minutos' },
  { key: 'seconds', label: 'segundos' },
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function Digit({ value }: { value: string }) {
  return (
    <div className="relative inline-block h-[1.1em] overflow-hidden align-middle" style={{ width: '0.62em' }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default function LiveCounter() {
  const [dur, setDur] = useState<Duration>(durationSinceAnniversary());

  useEffect(() => {
    const id = setInterval(() => setDur(durationSinceAnniversary()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(231, 214, 187, 0.6), transparent 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <div
          className="text-xs uppercase tracking-[0.5em] mb-3"
          style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
        >
          desde el 15 de marzo, 2026
        </div>
        <h2
          className="mb-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--color-ink)',
            fontWeight: 400,
          }}
        >
          Llevamos juntos
        </h2>
        <div className="flex justify-center mb-12">
          <Heart size={24} className="heartbeat" style={{ color: 'var(--color-rose)' }} fill="currentColor" />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {labels.map(({ key, label }, i) => {
            const v = dur[key] as number;
            const text = pad(v);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="glass rounded-2xl px-3 py-5 md:py-7"
              >
                <div
                  className="font-light leading-none mb-2 flex justify-center"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 5.5vw, 4rem)',
                    color: 'var(--color-ink)',
                  }}
                >
                  {text.split('').map((d, idx) => (
                    <Digit key={idx} value={d} />
                  ))}
                </div>
                <div
                  className="text-[0.65rem] md:text-xs uppercase tracking-[0.25em]"
                  style={{ color: 'var(--color-bronze)' }}
                >
                  {label}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-10 grid grid-cols-3 gap-4 max-w-2xl mx-auto text-sm"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          <div>
            <div className="font-light text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              {dur.totalDays.toLocaleString('es')}
            </div>
            <div className="text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: 'var(--color-bronze)' }}>
              días enteros
            </div>
          </div>
          <div>
            <div className="font-light text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              {dur.totalHours.toLocaleString('es')}
            </div>
            <div className="text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: 'var(--color-bronze)' }}>
              horas
            </div>
          </div>
          <div>
            <div className="font-light text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
              {dur.totalMinutes.toLocaleString('es')}
            </div>
            <div className="text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: 'var(--color-bronze)' }}>
              minutos
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
