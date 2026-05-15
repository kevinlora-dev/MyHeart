import { useEffect, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { animate, stagger } from 'animejs';
import {
  Heart, Flower, Drumstick, Fish, Eye, Smile, Sparkles, Baby, Sun, Cake, Tv,
  Coffee, BookOpen, HandHeart, MapPin, Star, Leaf,
} from 'lucide-react';
import { moonPhaseAt } from '../lib/moon';
import { HER_BIRTHDAY } from '../lib/constants';

// ============================================================================
// Moon SVG (existing)
// ============================================================================
function MoonSVG({ phase, illumination }: { phase: number; illumination: number }) {
  const size = 220;
  const r = 90;
  const cx = size / 2;
  const cy = size / 2;
  const waxing = phase < 0.5;
  const k = illumination;
  const a = r * Math.abs(1 - 2 * k);
  const shadowSide = waxing ? -1 : 1;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="moon-glow">
      <defs>
        <radialGradient id="moonGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="60%" stopColor="#f5e6c8" />
          <stop offset="100%" stopColor="#d9c4a3" />
        </radialGradient>
        <radialGradient id="moonShadow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#3b2f23" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1a140e" stopOpacity="1" />
        </radialGradient>
        <filter id="craters">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.85  0 0 0 0 0.78  0 0 0 0 0.62  0 0 0 0.4 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <mask id="moonMask">
          <rect width={size} height={size} fill="black" />
          <circle cx={cx} cy={cy} r={r} fill="white" />
        </mask>
      </defs>
      <g mask="url(#moonMask)">
        <circle cx={cx} cy={cy} r={r} fill="url(#moonGrad)" />
        <circle cx={cx} cy={cy} r={r} fill="url(#moonGrad)" filter="url(#craters)" opacity="0.4" />
        <circle cx={cx - 25} cy={cy - 20} r="10" fill="#d4bd99" opacity="0.5" />
        <circle cx={cx + 18} cy={cy + 10} r="7" fill="#d4bd99" opacity="0.4" />
        <circle cx={cx - 12} cy={cy + 30} r="12" fill="#d4bd99" opacity="0.35" />
        <circle cx={cx + 30} cy={cy - 35} r="5" fill="#d4bd99" opacity="0.45" />
        {(() => {
          let shadowPath;
          if (k < 0.5) {
            const sweepOuter = shadowSide === -1 ? 0 : 1;
            const sweepEllipse = shadowSide === -1 ? 0 : 1;
            shadowPath = `M ${cx} ${cy - r}
              A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy + r}
              A ${a} ${r} 0 0 ${1 - sweepEllipse} ${cx} ${cy - r} Z`;
          } else {
            const sweepOuter = shadowSide === -1 ? 1 : 0;
            const sweepEllipse = shadowSide === -1 ? 1 : 0;
            shadowPath = `M ${cx} ${cy - r}
              A ${a} ${r} 0 0 ${sweepEllipse} ${cx} ${cy + r}
              A ${r} ${r} 0 0 ${sweepOuter} ${cx} ${cy - r} Z`;
          }
          return <path d={shadowPath} fill="url(#moonShadow)" />;
        })()}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fbf7f0" strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}

// ============================================================================
// Animated quote — anime.js letter-by-letter on scroll
// ============================================================================
function AnimatedQuote({
  text,
  variant = 'script',
  delay = 0,
}: {
  text: string;
  variant?: 'script' | 'display';
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const letters = ref.current.querySelectorAll('.q-letter');
    animate(letters, {
      opacity: [0, 1],
      translateY: [18, 0],
      filter: ['blur(8px)', 'blur(0px)'],
      delay: stagger(35, { start: delay }),
      duration: 900,
      ease: 'outExpo',
    });
  }, [inView, delay]);

  const isScript = variant === 'script';
  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        fontFamily: isScript ? 'var(--font-script)' : 'var(--font-display)',
        fontSize: isScript ? 'clamp(2.5rem, 7vw, 5.5rem)' : 'clamp(1.25rem, 2.5vw, 2rem)',
        lineHeight: isScript ? 1.05 : 1.4,
        color: isScript ? 'var(--color-rose)' : 'var(--color-ink)',
        fontStyle: isScript ? 'normal' : 'italic',
      }}
    >
      {text.split('').map((c, i) => (
        <span
          key={i}
          className="q-letter inline-block"
          style={{ whiteSpace: c === ' ' ? 'pre' : undefined, opacity: 0 }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

// ============================================================================
// Reason / Fact card
// ============================================================================
function ReasonCard({
  icon, title, description, accent = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: number;
}) {
  const accents = [
    'rgba(216,168,160,0.18)', // rose
    'rgba(231,214,187,0.25)', // beige
    'rgba(240,217,212,0.22)', // blush
    'rgba(217,196,163,0.20)', // sand
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5 relative overflow-hidden h-full"
    >
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
        style={{ background: accents[accent % accents.length] }}
      />
      <div className="relative flex items-start gap-3">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--color-cream-100)', color: 'var(--color-bronze)' }}
        >
          {icon}
        </div>
        <div>
          <div
            className="mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--color-ink)',
            }}
          >
            {title}
          </div>
          <div
            className="text-[0.85rem] italic leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
          >
            {description}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FactCard({
  icon, label, value, description, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 md:p-7 relative overflow-hidden"
    >
      <div
        className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-25"
        style={{ background: color ?? 'var(--color-beige)' }}
      />
      <div
        className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--color-cream-100)', color: 'var(--color-bronze)' }}
      >
        {icon}
      </div>
      <div className="text-[0.6rem] uppercase tracking-[0.35em] mb-2" style={{ color: 'var(--color-bronze)' }}>
        {label}
      </div>
      <div className="text-xl md:text-2xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
        {value}
      </div>
      <div className="text-sm italic" style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-display)' }}>
        {description}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Plan A-Z — horizontal scroll of dates from A to Z
// ============================================================================
const PLAN_AZ: { letter: string; idea: string }[] = [
  { letter: 'A', idea: 'Alitas' },
  { letter: 'B', idea: 'Brunch en Pacas (Desalmuerzo)' },
  { letter: 'C', idea: 'Campamento playa & Cine' },
  { letter: 'D', idea: 'Desayunito' },
  { letter: 'E', idea: 'Entrenamiento (leg, sup)' },
  { letter: 'G', idea: 'Gaming Night' },
  { letter: 'H', idea: 'Helados' },
  { letter: 'I', idea: 'Comida Italiana' },
  { letter: 'J', idea: 'Juegos de mesa · Jugos' },
  { letter: 'K', idea: 'Karaoke · Karting' },
  { letter: 'L', idea: 'Lonchecito' },
  { letter: 'M', idea: 'Mirador · Museo · Maratón de pelis' },
  { letter: 'N', idea: 'Night Drive' },
  { letter: 'O', idea: 'Onigiri en casa' },
  { letter: 'P', idea: 'Picnic' },
  { letter: 'Q', idea: 'Tarde de Quesos' },
  { letter: 'R', idea: 'Road Trip · Rolls de canela' },
  { letter: 'S', idea: 'Sushi (makis)' },
  { letter: 'T', idea: 'Tacos' },
  { letter: 'V', idea: 'Voluntariado · Viaje' },
  { letter: 'W', idea: 'Waffles + Paint' },
  { letter: 'X', idea: 'Xtreme' },
  { letter: 'Y', idea: 'Yo elijo tu outfit' },
  { letter: 'Z', idea: 'Zoológico · Datos curiosos' },
];

// ============================================================================
// Main component
// ============================================================================
export default function AboutHer() {
  const moon = useMemo(() => moonPhaseAt(HER_BIRTHDAY), []);
  const pct = Math.round(moon.illumination * 100);

  const reasons: { icon: React.ReactNode; title: string; description: string }[] = [
    { icon: <Eye size={20} />,       title: 'Tu mirada',          description: 'Tiene algo que no puedo explicar, pero tu mirada es muy profunda.' },
    { icon: <Smile size={20} />,     title: 'Tu sonrisa',         description: 'Una de las cosas que más me enamora y más cuando la sueltas relajada.' },
    { icon: <Sparkles size={20} />,  title: 'Tu luz',             description: 'Esa que se nota en cualquier lugar donde estés.' },
    { icon: <HandHeart size={20} />, title: 'Tu corazón',         description: 'En cómo te preocupas por los demás (cómo cuidas a la Sra. María).' },
    { icon: <Baby size={20} />,      title: 'Tu amor por los niños', description: 'La ternura que les tienes me derrite el día.' },
    { icon: <BookOpen size={20} />,  title: 'Tu carrera',         description: 'Trabajo Social — el reflejo más grande del corazón que tienes.' },
    { icon: <Leaf size={20} />,      title: 'Tu humildad',        description: 'Humilde, tranquila, alegre, dulce. En ese orden y en todos.' },
    { icon: <Heart size={20} />,     title: 'Tus gestitos',       description: 'Esos pequeños movimientos tuyos que ya reconozco entre mil.' },
    { icon: <Star size={20} />,      title: 'Cómo me escuchas',   description: 'Aunque no entiendas todo lo que digo, estás ahí, y eso lo es todo.' },
    { icon: <Sun size={20} />,       title: 'Cómo me cambias',    description: 'Soy más abierto, más paciente, mejor enamorado por ti.' },
    { icon: <MapPin size={20} />,    title: 'Tu compañía',        description: 'Incluso sin hacer nada, contigo el tiempo se siente bonito.' },
    { icon: <Flower size={20} />,    title: 'Tu esencia',         description: 'No me enamoré de tu rostro — me enamoré de quien eres.' },
  ];

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(244,234,216,0.6), transparent 60%)' }}
      />
      <div className="relative max-w-6xl mx-auto">

        {/* ---------- Header ---------- */}
        <div className="text-center mb-16">
          <div
            className="text-xs uppercase tracking-[0.5em] mb-3"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            Tú
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--color-ink)',
              fontWeight: 400,
            }}
          >
            Pequeñas cosas que adoro de ti
          </h2>
          <p
            className="mt-4 max-w-xl mx-auto italic"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
          >
            Una lista que no termina, pero que intento contarte poco a poco.
          </p>
        </div>

        {/* ---------- Moon card ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1 }}
          className="glass rounded-3xl p-8 md:p-12 mb-16 grid md:grid-cols-2 gap-8 items-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(59,47,35,0.04), rgba(216,168,160,0.08))' }}
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 2, height: 2, background: 'var(--color-bronze)',
                  left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`,
                  opacity: 0.5 + ((i % 5) * 0.1),
                }}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <MoonSVG phase={moon.phase} illumination={moon.illumination} />
            </motion.div>
          </div>
          <div>
            <div
              className="text-[0.65rem] uppercase tracking-[0.4em] mb-2"
              style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
            >
              18 · 10 · 2004
            </div>
            <h3
              className="mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: 'var(--color-ink)' }}
            >
              La luna que te recibió
            </h3>
            <p className="italic mb-5" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}>
              El día que naciste, el cielo lucía una <strong style={{ color: 'var(--color-ink)' }}>{moon.name}</strong> con un {pct}% de iluminación.
              La luna no brilla por sí sola — brilla porque alguien la ilumina. Y desde que estás en mi vida, así brillo yo.
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="font-light text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                  {pct}%
                </div>
                <div className="text-[0.65rem] uppercase tracking-[0.3em]" style={{ color: 'var(--color-bronze)' }}>
                  iluminación
                </div>
              </div>
              <div>
                <div className="font-light text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                  {moon.age.toFixed(1)}d
                </div>
                <div className="text-[0.65rem] uppercase tracking-[0.3em]" style={{ color: 'var(--color-bronze)' }}>
                  edad lunar
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- Reasons grid ---------- */}
        <div className="text-center mb-10">
          <div
            className="text-[0.65rem] uppercase tracking-[0.4em] mb-2"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            doce razones, de un millón
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              color: 'var(--color-ink)',
            }}
          >
            Lo que me enamora de ti
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-20">
          {reasons.map((r, i) => (
            <ReasonCard key={r.title} icon={r.icon} title={r.title} description={r.description} accent={i} />
          ))}
        </div>

        {/* ---------- Quote 1 ---------- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="mb-24"
        >
          <AnimatedQuote text="Veo a la mujer de mis sueños" variant="script" />
          <div
            className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.5em]"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            cuando me preguntas qué veo cuando te miro
          </div>
        </motion.div>

        {/* ---------- The magic of 15 ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9 }}
          className="glass rounded-3xl p-8 md:p-12 mb-20 text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(240,217,212,0.45), transparent 65%)' }}
          />
          <div
            className="relative text-[0.65rem] uppercase tracking-[0.5em] mb-4"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            por qué un 15
          </div>
          <div className="relative flex items-center justify-center gap-4 md:gap-8 mb-6">
            {[
              { n: '7', l: 'Karlita' },
              { op: '+' },
              { n: '7', l: 'Kevin' },
              { op: '+' },
              { n: '1', l: 'Dios' },
              { op: '=' },
              { n: '15', l: 'nosotros', highlight: true },
            ].map((x, i) =>
              x.op ? (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    color: 'var(--color-bronze)',
                    opacity: 0.6,
                  }}
                >
                  {x.op}
                </div>
              ) : (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="flex flex-col items-center"
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: x.highlight ? 'clamp(3rem, 6vw, 5rem)' : 'clamp(2rem, 4vw, 3.5rem)',
                      fontWeight: 300,
                      color: x.highlight ? 'var(--color-rose)' : 'var(--color-ink)',
                      lineHeight: 1,
                    }}
                  >
                    {x.n}
                  </div>
                  <div
                    className="mt-2 text-[0.6rem] uppercase tracking-[0.3em]"
                    style={{ color: 'var(--color-bronze)' }}
                  >
                    {x.l}
                  </div>
                </motion.div>
              )
            )}
          </div>
          <p
            className="relative italic max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
          >
            Tú el 7, yo el 7 — perfectos a nuestra manera. Y el 1 que es Dios, quien une todo.
            Por eso cada 15 me sabe distinto al resto del calendario.
          </p>
        </motion.div>

        {/* ---------- Facts grid (expanded) ---------- */}
        <div className="text-center mb-8">
          <div
            className="text-[0.65rem] uppercase tracking-[0.4em] mb-2"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            cositas tuyas
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              color: 'var(--color-ink)',
            }}
          >
            Las cosas que sé de ti
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-20">
          <FactCard
            icon={
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-white border" style={{ borderColor: 'var(--color-beige-dark)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-beige)' }} />
              </div>
            }
            label="color favorito"
            value="Blanco · Beige"
            description="El color de los amaneceres antes que hablemos."
            color="rgba(231,214,187,0.6)"
          />
          <FactCard
            icon={<Flower size={22} />}
            label="su flor"
            value="Lirios rosados"
            description="Elegantes, suaves, como tú cuando te ríes naturalmente."
            color="rgba(240,217,212,0.7)"
          />
          <FactCard
            icon={<Drumstick size={22} />}
            label="comida"
            value="Alitas · Makis"
            description="Ahora también los makis. Me reservo invitarte a los dos en la misma cena."
            color="rgba(240,217,212,0.6)"
          />
          <FactCard
            icon={<Cake size={22} />}
            label="torta favorita"
            value="Chocolate con fresas"
            description="La próxima vez la pido. Para verte sonreír (Esto literal me da vida)."
            color="rgba(216,168,160,0.4)"
          />
          <FactCard
            icon={<Fish size={22} />}
            label="personaje Disney"
            value="La Sirenita"
            description="Curiosa, soñadora, con esa voz que cambia el mundo de quien la escucha."
            color="rgba(216,168,160,0.5)"
          />
          <FactCard
            icon={<Tv size={22} />}
            label="serie"
            value="Gossip Girl"
            description="Aún no la vemos, pero pronto la veremos."
            color="rgba(231,214,187,0.55)"
          />
          <FactCard
            icon={<Coffee size={22} />}
            label="desayuno fav"
            value="Tostada con huevo a la inglesa y palta"
            description="Con ensalada de frutas. Te lo voy a preparar tantas veces como me dejes."
            color="rgba(255,255,255,0.7)"
          />
        </div>

        {/* ---------- Plan A-Z ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9 }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <div
              className="text-[0.65rem] uppercase tracking-[0.4em] mb-2"
              style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
            >
              promesas pendientes
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                color: 'var(--color-ink)',
              }}
            >
              Plan de citas de la A a la Z
            </h3>
            <p
              className="mt-3 italic max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
            >
              Una idea por letra del abecedario. Las iremos tachando juntos, sin prisa.
            </p>
          </div>
          <div className="rail-scroll overflow-x-auto pb-4">
            <div className="flex gap-3 px-2 min-w-max">
              {PLAN_AZ.map((p, i) => (
                <motion.div
                  key={p.letter}
                  initial={{ opacity: 0, y: 16, rotate: -3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                  transition={{ delay: (i % 12) * 0.03, duration: 0.5 }}
                  className="glass rounded-2xl px-5 py-6 w-48 md:w-56 shrink-0 text-center"
                  style={{
                    background:
                      i % 2 === 0
                        ? 'linear-gradient(160deg, rgba(255,255,255,0.85), rgba(231,214,187,0.35))'
                        : 'linear-gradient(160deg, rgba(255,252,245,0.85), rgba(240,217,212,0.35))',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-script)',
                      fontSize: '4rem',
                      lineHeight: 0.8,
                      color: 'var(--color-rose)',
                    }}
                  >
                    {p.letter}
                  </div>
                  <div
                    className="mt-3 text-sm leading-snug italic"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
                  >
                    {p.idea}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---------- 17 maneras de hacerla feliz ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9 }}
          className="glass rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden"
        >
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'var(--color-rose)' }}
          />
          <div className="relative">
            <div
              className="text-[0.65rem] uppercase tracking-[0.45em] mb-2"
              style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
            >
              promesas conmigo mismo
            </div>
            <h3
              className="mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                color: 'var(--color-ink)',
              }}
            >
              Diecisiete formas de hacerte feliz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {[
                'Regalarte flores en días normales',
                'Darte palabras de seguridad cuando dudes de ti',
                'Mandarte "pienso en ti" en mitad del día',
                'Sorprenderte con una cita improvisada',
                'Escribirte cartas a mano',
                'Besitos en la frente, siempre',
                'Recordarte que eres amada',
                'Decirte "aishiteru" con presencia',
                'Dejarte usar mi ropa',
                'Abrazarte mucho',
                'Protegerte sin invadirte',
                'Llamarte mi mujer con ternura',
                'Abrazos largos, de los que no se sueltan',
                'Acompañarte aunque estés callada',
                'Detalles sin motivo',
                'Mostrarte en redes — cuando se ama no se esconde',
                'Estar contigo aunque te pongas "fría", y cuidarte cuando estés enfermita',
              ].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--color-rose)' }}
                  />
                  <div
                    className="text-[0.95rem] leading-snug"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink-soft)' }}
                  >
                    {line}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---------- Final quote ---------- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2 }}
          className="mb-12"
        >
          <div
            className="text-center text-[0.65rem] uppercase tracking-[0.5em] mb-6"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-cinzel)' }}
          >
            y al final, lo único cierto
          </div>
          <AnimatedQuote text="Soy más humano por amarte" variant="script" />
        </motion.div>

        {/* ---------- Closing line ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2" style={{ color: 'var(--color-bronze)' }}>
            <Heart size={14} className="heartbeat" fill="currentColor" />
            <div className="text-[0.65rem] uppercase tracking-[0.45em]">tuyo, siempre</div>
            <Heart size={14} className="heartbeat" fill="currentColor" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
