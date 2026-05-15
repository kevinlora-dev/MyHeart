import { useMemo } from 'react';

interface Props {
  count?: number;
}

export default function FloatingPetals({ count = 14 }: Props) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: i,
        left: `${(i * 100) / count + (i * 7) % 20}%`,
        x: `${(i % 2 === 0 ? 1 : -1) * (40 + (i % 5) * 18)}px`,
        dur: `${14 + (i % 7) * 1.4}s`,
        delay: `${i * 0.8}s`,
        scale: 0.6 + ((i % 5) * 0.18),
        rot: (i * 23) % 360,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {petals.map((p) => (
        <div
          key={p.key}
          className="petal"
          style={
            {
              left: p.left,
              '--x': p.x,
              '--dur': p.dur,
              '--delay': p.delay,
              transform: `scale(${p.scale}) rotate(${p.rot}deg)`,
            } as React.CSSProperties
          }
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            {/* Lily-inspired silhouette */}
            <path
              d="M12 1 C 13.5 7 17 10 22 12 C 17 14 13.5 17 12 23 C 10.5 17 7 14 2 12 C 7 10 10.5 7 12 1 Z"
              fill="#fdfaf5"
              stroke="#e7d6bb"
              strokeWidth="0.6"
              opacity="0.85"
            />
            <circle cx="12" cy="12" r="1.8" fill="#d8a8a0" />
          </svg>
        </div>
      ))}
    </div>
  );
}
