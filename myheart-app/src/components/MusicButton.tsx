import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX } from 'lucide-react';

const SONG_PATH = '/audio/song.mp3';

export default function MusicButton() {
  const [playing, setPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(SONG_PATH);
    a.loop = true;
    a.volume = 0.18;
    a.preload = 'none';
    a.addEventListener('error', () => setHasAudio(false));
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setHasAudio(false));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
    >
      <AnimatePresence>
        {!hasAudio && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-full px-3 py-2 text-[0.65rem] uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-bronze)' }}
          >
            coloca un .mp3 en /audio/song.mp3
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: playing
            ? 'linear-gradient(135deg, var(--color-rose), var(--color-sand))'
            : 'linear-gradient(135deg, var(--color-cream), var(--color-beige))',
          color: 'var(--color-ink)',
        }}
        aria-label={playing ? 'pausar música' : 'reproducir música'}
      >
        {playing ? <Volume2 size={20} /> : hasAudio ? <Music size={20} /> : <VolumeX size={20} />}
        {playing && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid var(--color-rose)' }}
              animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid var(--color-rose)' }}
              animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
