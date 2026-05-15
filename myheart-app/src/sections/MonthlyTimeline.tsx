import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ANNIVERSARY } from '../lib/constants';
import { monthAnniversaries, nextAnniversary, isAnniversaryToday } from '../lib/time';
import { Sparkles, Heart, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const MONTH_NAMES = [
  'Primer mes',
  'Segundo mes',
  'Tercer mes',
  'Cuarto mes',
  'Quinto mes',
  'Sexto mes',
  'Séptimo mes',
  'Octavo mes',
  'Noveno mes',
  'Décimo mes',
  'Onceavo mes',
  'Un año',
  'Trece meses',
  'Catorce meses',
  'Quince meses',
  'Dieciséis meses',
  'Diecisiete meses',
  'Dieciocho meses',
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function formatDate(d: Date) {
  return `${pad(d.getDate())} · ${pad(d.getMonth() + 1)} · ${d.getFullYear()}`;
}

export default function MonthlyTimeline() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const list = useMemo(() => monthAnniversaries(18), []);
  const next = nextAnniversary(now);
  const diffMs = Math.max(0, next.getTime() - now.getTime());
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs / 3600000) % 24);
  const minutes = Math.floor((diffMs / 60000) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const isMonthlyToday = isAnniversaryToday(now);

  useEffect(() => {
    if (isMonthlyToday) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbf7f0', '#e7d6bb', '#d8a8a0', '#a08a6a'],
      });
    }
  }, [isMonthlyToday]);

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <div
            className="text-xs uppercase tracking-[0.5em] mb-3"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            cada 15
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--color-ink)',
              fontWeight: 400,
            }}
          >
            Cumplemeses
          </h2>
          <p
            className="mt-4 italic max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
          >
            Cada 15 es nuestro pequeño cumplemes, ando emocionado por los siguientes :D.
          </p>
        </div>

        {/* Countdown to next */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-6 md:p-10 mb-14 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-4" style={{ color: 'var(--color-bronze)' }}>
            <Calendar size={16} />
            <div className="text-xs uppercase tracking-[0.35em]">
              {isMonthlyToday ? '¡hoy es cumplemés!' : 'próximo cumplemés'}
            </div>
          </div>
          <div
            className="text-center mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              color: 'var(--color-ink)',
            }}
          >
            {formatDate(next)}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { v: days, l: 'días' },
              { v: hours, l: 'h' },
              { v: minutes, l: 'min' },
              { v: seconds, l: 'seg' },
            ].map((x, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-light leading-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    color: 'var(--color-ink)',
                  }}
                >
                  {pad(x.v)}
                </div>
                <div
                  className="text-[0.6rem] md:text-xs uppercase tracking-[0.3em] mt-2"
                  style={{ color: 'var(--color-bronze)' }}
                >
                  {x.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline rail */}
        <div className="relative">
          <div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--color-beige-dark), transparent)',
            }}
          />
          <div className="rail-scroll relative overflow-x-auto pb-6">
            <div className="flex gap-5 px-2 min-w-max">
              {[ANNIVERSARY, ...list].map((d, i) => {
                const past = d.getTime() <= now.getTime();
                const isNext = !past && d.getTime() === next.getTime();
                const label = i === 0 ? 'Inicio' : (MONTH_NAMES[i - 1] ?? `${i} meses`);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.04, duration: 0.5 }}
                    className="relative shrink-0 w-44 md:w-52"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative w-3 h-3 rounded-full mb-3 ${isNext ? 'ring-4' : ''}`}
                        style={{
                          background: past ? 'var(--color-rose)' : 'var(--color-beige-dark)',
                          ['--tw-ring-color' as any]: 'rgba(216,168,160,0.3)',
                          boxShadow: past ? '0 0 12px rgba(216,168,160,0.6)' : 'none',
                        }}
                      >
                        {isNext && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ background: 'var(--color-rose)' }}
                            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <div
                        className="glass rounded-xl px-3 py-3 text-center w-full"
                        style={{
                          opacity: past ? 1 : 0.7,
                          borderColor: isNext ? 'var(--color-rose)' : undefined,
                        }}
                      >
                        <div
                          className="text-[0.6rem] uppercase tracking-[0.25em] mb-1"
                          style={{ color: past ? 'var(--color-rose)' : 'var(--color-bronze)' }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            color: 'var(--color-ink)',
                          }}
                          className="text-sm md:text-base"
                        >
                          {formatDate(d)}
                        </div>
                        <div className="mt-2 flex justify-center">
                          {past ? (
                            <Heart size={14} fill="var(--color-rose)" style={{ color: 'var(--color-rose)' }} />
                          ) : (
                            <Sparkles size={14} style={{ color: 'var(--color-bronze)' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
