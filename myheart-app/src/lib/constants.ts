export const ANNIVERSARY = new Date('2026-03-15T00:00:00');
export const HER_BIRTHDAY = new Date('2004-10-18T00:00:00');
export const HIM_NAME = 'Kevin Fernando Lora Garcia';
export const HER_NAME = 'Karlita Gisel Mendez Miranda';
export const HIM_SHORT = 'Kevin';
export const HER_SHORT = 'Karlita';

export interface Chapter {
  keys: string[];
  title: string;
  subtitle: string;
  date?: string;
}

export const CHAPTERS: Chapter[] = [
  { keys: ['Salida'],            title: 'Primera Salida con Foto',     subtitle: 'Donde todo comenzó a sentirse distinto', date: '07 de marzo, 2026' },
  { keys: ['Campeonato'],        title: 'Campeonato AnoP',              subtitle: 'Donde me apoyaste, gritaste, reíste, y donde conociste a Pachi y Lukas, me enamoré mucho de ti aquí',          date: '08 de marzo, 2026' },
  { keys: ['Casa'],              title: 'Tardes en Casa',             subtitle: 'Estos días en mi casa los disruté muchísimo, comiendo, viendo pelis, durmiendo, casi siempre durmiendo XD',  date: 'marzo, 2026' },
  { keys: ['Pacasmayo'],         title: 'Pacasmayo',                  subtitle: 'Una salida y lugar que jamás olvidaré porque aquí fue donde me arriesgué :3',       date: '14–15 de marzo, 2026' },
  { keys: ['Hotel', 'Cine', 'Carro'], title: 'Fotos Randoms',         subtitle: 'Momentos "sueltos" que no necesitan explicación :3',  date: 'a lo largo del camino' },
  { keys: ['PrimerMesCumplido'], title: 'Nuestro Primer Mes',         subtitle: '15 de abril — el primero de muchos',  date: '15 de abril, 2026' },
];
