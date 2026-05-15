import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { HER_NAME, HIM_NAME, HER_SHORT, HIM_SHORT } from '../lib/constants';
import { Heart } from 'lucide-react';

export default function Hero() {
  const ampRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const headerLetters = document.querySelectorAll('.hero-letter');
    animate(headerLetters, {
      opacity: [0, 1],
      translateY: [40, 0],
      rotate: [-3, 0],
      delay: stagger(35),
      duration: 1100,
      ease: 'outExpo',
    });

    if (ampRef.current) {
      animate(ampRef.current, {
        opacity: [0, 1],
        scale: [0.6, 1],
        rotate: [-20, 0],
        delay: 1200,
        duration: 900,
        ease: 'outElastic(1, 0.6)',
      });
    }

    if (lineRef.current) {
      const len = lineRef.current.getTotalLength();
      lineRef.current.style.strokeDasharray = `${len}`;
      lineRef.current.style.strokeDashoffset = `${len}`;
      animate(lineRef.current, {
        strokeDashoffset: [len, 0],
        delay: 800,
        duration: 2200,
        ease: 'inOutQuad',
      });
    }
  }, []);

  const splitName = (name: string, cls: string) =>
    name.split('').map((c, i) => (
      <span key={i} className={`hero-letter inline-block ${cls}`} style={{ whiteSpace: c === ' ' ? 'pre' : undefined }}>
        {c}
      </span>
    ));

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <div className="aurora" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[0.7rem] md:text-xs uppercase tracking-[0.5em]"
        style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
      >
        15 · 03 · 2026
      </motion.div>

      <div className="relative mt-6 mb-4">
        <h1
          className="leading-[0.95]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 11vw, 9rem)',
            color: 'var(--color-ink)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
          }}
        >
          <div className="italic">{splitName(HIM_SHORT, '')}</div>
          <span
            ref={ampRef}
            className="inline-block my-2"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(4rem, 14vw, 11rem)',
              color: 'var(--color-rose)',
              lineHeight: 0.5,
            }}
          >
            &amp;
          </span>
          <div className="italic" style={{ color: 'var(--color-rose)' }}>{splitName(HER_SHORT, '')}</div>
        </h1>

        {/* underline brush */}
        <svg
          className="absolute -bottom-6 left-1/2 -translate-x-1/2"
          width="320"
          height="20"
          viewBox="0 0 320 20"
          fill="none"
        >
          <path
            ref={lineRef}
            d="M2 10 C 60 2, 120 18, 180 10 S 280 4, 318 10"
            stroke="var(--color-sand)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="mt-12 max-w-xl text-base md:text-lg italic"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
      >
        {HIM_NAME} <span className="opacity-50">+</span> {HER_NAME}
        <br />
        <span className="text-sm not-italic" style={{ color: 'var(--color-bronze)' }}>
          Una historia que apenas comienza.
        </span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--color-bronze)' }}
      >
        <Heart size={16} className="heartbeat" fill="currentColor" />
        <div className="text-[0.65rem] uppercase tracking-[0.4em]">desliza hacia abajo</div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, var(--color-bronze), transparent)' }}
        />
      </motion.div>
    </section>
  );
}
