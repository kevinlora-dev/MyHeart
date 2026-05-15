import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { Heart, KeyRound, Sparkles } from 'lucide-react';

const PASSWORD = '15032026';

interface Props {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    const letters = titleRef.current.querySelectorAll('.letter');
    animate(letters, {
      opacity: [0, 1],
      translateY: [24, 0],
      delay: stagger(70, { start: 200 }),
      duration: 900,
      ease: 'outExpo',
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim() === PASSWORD) {
      setUnlocking(true);
      setTimeout(onUnlock, 1200);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
      setValue('');
    }
  }

  const titleText = 'Para ti, Amor';
  const letters = titleText.split('').map((c, i) => (
    <span key={i} className="letter inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : undefined }}>
      {c}
    </span>
  ));

  return (
    <AnimatePresence>
      {!unlocking ? (
        <motion.div
          key="lock"
          className="fixed inset-0 z-50 paper overflow-hidden"
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
          transition={{ duration: 1 }}
        >
          <div className="aurora" />

          {/* Floating petals */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="petal"
              style={
                {
                  left: `${(i * 6.2) % 100}%`,
                  '--x': `${(i % 2 === 0 ? 1 : -1) * (40 + (i % 5) * 20)}px`,
                  '--dur': `${12 + (i % 6) * 1.5}s`,
                  '--delay': `${i * 0.6}s`,
                } as React.CSSProperties
              }
            >
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  d="M12 2 C 14 7 18 9 22 12 C 18 15 14 17 12 22 C 10 17 6 15 2 12 C 6 9 10 7 12 2 Z"
                  fill="#f4ead8"
                  opacity="0.85"
                />
              </svg>
            </div>
          ))}

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.4em] text-ink-soft mb-6 font-cinzel"
              style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-cinzel)' }}
            >
              Una página secreta
            </motion.div>

            <h1
              ref={titleRef}
              className="text-center"
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                lineHeight: 1,
                color: 'var(--color-ink)',
              }}
            >
              {letters}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 max-w-md text-center text-base md:text-lg italic"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
            >
              Lo que sigue es tuyo. <br />
              El día en que dejamos de ser dos. <br />
              <span className="text-sm opacity-60">(dd · mm · aaaa)</span>
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              onSubmit={handleSubmit}
              className="mt-10 w-full max-w-sm"
            >
              <div className="glass rounded-2xl p-2 flex items-center gap-2">
                <div className="pl-3 text-bronze" style={{ color: 'var(--color-bronze)' }}>
                  <KeyRound size={20} />
                </div>
                <motion.input
                  animate={error ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  type="password"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder=""
                  className="flex-1 bg-transparent outline-none py-3 text-lg tracking-widest text-center placeholder:opacity-40"
                  style={{ color: 'var(--color-ink)' }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2.5 text-sm font-medium transition hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-beige), var(--color-sand))',
                    color: 'var(--color-ink)',
                  }}
                >
                  Abrir
                </button>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-center text-sm"
                  style={{ color: 'var(--color-rose)' }}
                >
                  No es esa fecha. Piensa en el día que todo cambió.
                </motion.div>
              )}
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4, duration: 1 }}
              className="mt-12 flex items-center gap-2 text-xs uppercase tracking-[0.35em]"
              style={{ color: 'var(--color-bronze)' }}
            >
              <Sparkles size={14} />
              <span>Hecho con mucho cariño y amor</span>
              <Heart size={14} className="heartbeat" />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="unlocking"
          className="fixed inset-0 z-50 paper flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Heart size={80} fill="#d8a8a0" stroke="#d8a8a0" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
