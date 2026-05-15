import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react';
import manifest from '../manifest.json';
import { CHAPTERS } from '../lib/constants';

interface Media {
  src: string;
  type: 'image' | 'video';
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState<{ items: Media[]; index: number } | null>(null);

  function openLightbox(items: Media[], index: number) {
    setLightbox({ items, index });
  }
  function closeLightbox() {
    setLightbox(null);
  }
  function prev() {
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length } : lb));
  }
  function next() {
    setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : lb));
  }

  return (
    <section className="relative py-28">
      <div className="text-center px-6 mb-16 max-w-3xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.5em] mb-3"
          style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
        >
          nuestros capítulos
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--color-ink)',
            fontWeight: 400,
          }}
        >
          Lugares donde te quiero más
        </h2>
        <p
          className="mt-4 italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
        >
          Cada foto es un minuto que no quiero devolverle al tiempo.
        </p>
      </div>

      <div className="space-y-24">
        {CHAPTERS.map((ch, idx) => {
          const items: Media[] = [];
          for (const key of ch.keys) {
            const entry = (manifest as any)[key];
            if (!entry) continue;
            for (const src of entry.photos as string[]) items.push({ src, type: 'image' });
            for (const src of entry.videos as string[]) items.push({ src, type: 'video' });
          }
          if (items.length === 0) return null;
          return (
            <Chapter
              key={ch.keys.join('-')}
              index={idx}
              title={ch.title}
              subtitle={ch.subtitle}
              date={ch.date}
              items={items}
              onOpen={openLightbox}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            items={lightbox.items}
            index={lightbox.index}
            onClose={closeLightbox}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Chapter({
  index,
  title,
  subtitle,
  date,
  items,
  onOpen,
}: {
  index: number;
  title: string;
  subtitle: string;
  date?: string;
  items: Media[];
  onOpen: (items: Media[], i: number) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollBy(delta: number) {
    railRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div
            className="text-[0.65rem] uppercase tracking-[0.4em] mb-2"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            Capítulo · {String(index + 1).padStart(2, '0')}
            {date ? ` · ${date}` : ''}
          </div>
          <h3
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              color: 'var(--color-ink)',
              fontWeight: 400,
            }}
          >
            {title}
          </h3>
          <p
            className="italic mt-1 max-w-lg"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
          >
            {subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scrollBy(-360)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center transition hover:scale-110"
            style={{ color: 'var(--color-ink)' }}
            aria-label="anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy(360)}
            className="w-10 h-10 rounded-full glass flex items-center justify-center transition hover:scale-110"
            style={{ color: 'var(--color-ink)' }}
            aria-label="siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={railRef} className="rail-scroll overflow-x-auto pb-6">
        <div className="flex gap-4 px-6 min-w-max">
          {items.map((m, i) => (
            <MediaCard key={m.src} media={m} onClick={() => onOpen(items, i)} idx={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MediaCard({ media, onClick, idx }: { media: Media; onClick: () => void; idx: number }) {
  const isLandscape = idx % 3 === 0;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group relative shrink-0 overflow-hidden rounded-2xl shadow-lg"
      style={{
        width: isLandscape ? 480 : 320,
        height: 400,
        background: 'var(--color-cream-100)',
      }}
    >
      {media.type === 'image' ? (
        <img
          src={'/' + media.src}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <>
          <video
            src={'/' + media.src}
            preload="metadata"
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md"
              style={{ background: 'rgba(255, 252, 245, 0.85)' }}
            >
              <Play size={26} fill="var(--color-ink)" style={{ color: 'var(--color-ink)' }} />
            </div>
          </div>
        </>
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(59,47,35,0.55), transparent)' }}
      />
      <div
        className="absolute bottom-3 left-3 text-[0.65rem] uppercase tracking-[0.3em] flex items-center gap-1.5"
        style={{ color: '#fff' }}
      >
        {media.type === 'video' ? <Play size={11} /> : <ImageIcon size={11} />}
        <span>#{String(idx + 1).padStart(2, '0')}</span>
      </div>
    </motion.button>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: Media[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const m = items[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{ background: 'rgba(20, 14, 8, 0.92)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
      >
        <ChevronRight />
      </button>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
      >
        <X />
      </button>

      <motion.div
        key={m.src}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-6xl max-h-[88vh] w-full flex items-center justify-center"
      >
        {m.type === 'image' ? (
          <img src={'/' + m.src} alt="" className="max-w-full max-h-[88vh] rounded-lg shadow-2xl" />
        ) : (
          <video
            src={'/' + m.src}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-[88vh] rounded-lg shadow-2xl"
          />
        )}
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs uppercase tracking-[0.3em]">
        {index + 1} / {items.length}
      </div>
    </motion.div>
  );
}
