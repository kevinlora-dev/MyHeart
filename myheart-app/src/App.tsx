import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import LockScreen from './components/LockScreen';
import FloatingPetals from './components/FloatingPetals';
import MusicButton from './components/MusicButton';
import Hero from './sections/Hero';
import LiveCounter from './sections/LiveCounter';
import MonthlyTimeline from './sections/MonthlyTimeline';
import Gallery from './sections/Gallery';
import AboutHer from './sections/AboutHer';
import Closing from './sections/Closing';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [unlocked]);

  return (
    <div className="paper min-h-screen relative">
      {!unlocked && <LockScreen onUnlock={() => setUnlocked(true)} />}

      {unlocked && (
        <>
          <FloatingPetals count={14} />
          <MusicButton />
          <main className="relative z-10">
            <Hero />
            <LiveCounter />
            <MonthlyTimeline />
            <Gallery />
            <AboutHer />
            <Closing />
            <footer className="text-center py-10 text-[0.6rem] uppercase tracking-[0.5em]" style={{ color: 'var(--color-bronze)' }}>
              Karlita · Kevin · 15.03.2026
            </footer>
          </main>
        </>
      )}
    </div>
  );
}
