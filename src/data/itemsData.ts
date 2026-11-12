/**
 * Items Repository & Chilean Traditional Nature Remedies
 */

import { InventoryItem, JobClass } from '../types/game';

export const INITIAL_ITEMS: Record<string, InventoryItem> = {
  matico: {
    id: 'matico',
    name: 'Hojas de Matico',
    category: 'curativo',
    description: 'Hierba medicinal milenaria chilena que cicatriza heridas. Restaura 80 PS a un espíritu o a Bárbara.',
    count: 5,
    icon: '🍃',
    effectType: 'heal_hp',
    effectValue: 80,
    price: 35,
  },
  infusion_calafate: {
    id: 'infusion_calafate',
    name: 'Infusión de Calafate',
    category: 'curativo',
    description: 'Brebaje de bayas silvestres de la Patagonia. Restaura 150 PS y cura estados alterados.',
    count: 3,
    icon: '🫐',
    effectType: 'cure_status',
    effectValue: 150,
    price: 65,
  },
  empanada: {
    id: 'empanada',
    name: 'Empanada de Horno',
    category: 'curativo',
    description: 'Comida tradicional nutritiva. Revive a un aliado debilitado con el 50% de sus PS máximos.',
    count: 2,
    icon: '🥟',
    effectType: 'revive',
    effectValue: 50,
    price: 90,
  },
  gota_termal: {
    id: 'gota_termal',
    name: 'Gota Termal de Pucón',
    category: 'curativo',
    description: 'Agua mineral caliente con minerales puros. Restaura 50 PM de energía táctica.',
    count: 4,
    icon: '💧',
    effectType: 'heal_mp',
    effectValue: 50,
    price: 45,
  },
  orbe_resonancia: {
    id: 'orbe_resonancia',
    name: 'Orbe de Resonancia Pewén',
    category: 'captura',
    description: 'Esfera tallada en madera fósil andina que permite sincronizar y reclutar espíritus salvajes.',
    count: 8,
    icon: '🔮',
    effectType: 'resonance',
    effectValue: 1,
    price: 50,
  },
  esencia_pewen: {
    id: 'esencia_pewen',
    name: 'Resina de Pewén',
    category: 'esencia',
    description: 'Poderosa savia sagrada. Permite catalizar la evolución de espíritus de Planta/Tierra en el Santuario.',
    count: 1,
    icon: '🌿',
    effectType: 'evolution',
    effectValue: 1,
    price: 180,
  },
  corazon_basalto: {
    id: 'corazon_basalto',
    name: 'Corazón de Basalto',
    category: 'esencia',
    description: 'Piedra volcánica que late con calor perpetuo. Desbloquea la evolución de espíritus de Fuego.',
    count: 1,
    icon: '🔥',
    effectType: 'evolution',
    effectValue: 1,
    price: 180,
  },
  cristal_hielo: {
    id: 'cristal_hielo',
    name: 'Cristal de Hielo Azul',
    category: 'esencia',
    description: 'Gema tallada en los ventisqueros de Hornopirén. Desbloquea evoluciones de Hielo y Austral.',
    count: 1,
    icon: '❄️',
    effectType: 'evolution',
    effectValue: 1,
    price: 180,
  }
};

export interface JobDefinition {
  id: JobClass;
  name: string;
  title: string;
  description: string;
  icon: string;
  statBonus: {
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  specialty: string;
}

export const JOBS_CONFIG: Record<JobClass, JobDefinition> = {
  naturalista: {
    id: 'naturalista',
    name: 'Naturalista Andina',
    title: 'Sanadora y Guardiana de la Vida',
    description: 'Especialista en botánica y sanación autóctona. Potencia la curación de hierbas y regenera la salud del grupo en combate.',
    icon: '🌱',
    statBonus: { hp: 40, mp: 30, attack: 5, defense: 10, speed: 10 },
    specialty: 'Curaciones +50% y regeneración pasiva de 5% PS cada turno',
  },
  chaman: {
    id: 'chaman',
    name: 'Chamán Elemental',
    title: 'Maestra de las Fuerzas Primordiales',
    description: 'Canaliza la fuerza del volcán, los ríos y los vientos cordilleranos. Desata destructivos hechizos multi-objetivo.',
    icon: '⚡',
    statBonus: { hp: 10, mp: 60, attack: 25, defense: 0, speed: 15 },
    specialty: 'Ataques elementales causan +30% daño de sinergia',
  },
  guardaparque: {
    id: 'guardaparque',
    name: 'Guardaparque Táctico',
    title: 'Defensora de las Fronteras Silvestres',
    description: 'Conoce los terrenos más hostiles y el comportamiento de las fieras. Provoca a los enemigos y protege a los aliados heridos.',
    icon: '🛡️',
    statBonus: { hp: 60, mp: 10, attack: 20, defense: 35, speed: 5 },
    specialty: 'Defensa incrementada en 40% y absorbe daño para proteger a espíritus con poca vida',
  },
  mistica: {
    id: 'mistica',
    name: 'Mística Austral',
    title: 'Oráculo de los Fiordos y el Hielo',
    description: 'Comulga con las estrellas del sur y los glaciares eternos. Acelera la barra de Invocación y manipula los turnos de combate.',
    icon: '🌌',
    statBonus: { hp: 25, mp: 45, attack: 15, defense: 15, speed: 30 },
    specialty: 'La barra de Invocación de la Naturaleza carga el doble de rápido',
  }
};
