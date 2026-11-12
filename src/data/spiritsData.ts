/**
 * Chilean Nature Spirits & Evolutionary Lines
 * Inspired by Pokémon Rojo Fuego evolution mechanics and Final Fantasy creature summons
 */

import { SpiritCreature, ElementalSkill, EvolutionStage, ElementType } from '../types/game';

// Standard elemental skills repository
export const SKILLS_DB: Record<string, ElementalSkill> = {
  // Planta / Flora skills
  hoja_pewen: {
    id: 'hoja_pewen',
    name: 'Hoja de Pewén',
    element: 'planta',
    power: 40,
    mpCost: 5,
    accuracy: 95,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Dispara afiladas hojas del árbol sagrado de los Andes.',
    animationColor: '#22c55e',
  },
  raiz_ancestral: {
    id: 'raiz_ancestral',
    name: 'Raíz Ancestral',
    element: 'planta',
    power: 70,
    mpCost: 14,
    accuracy: 90,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Raíces milenarias brotan del suelo para inmovilizar al rival.',
    effectType: 'paralyze',
    effectChance: 0.35,
    animationColor: '#16a34a',
  },
  bendicion_forestal: {
    id: 'bendicion_forestal',
    name: 'Manto de la Selva',
    element: 'planta',
    power: 0,
    mpCost: 12,
    accuracy: 100,
    category: 'heal',
    target: 'all_allies',
    description: 'La savia de la selva valdiviana regenera la salud del grupo.',
    effectType: 'heal',
    animationColor: '#4ade80',
  },
  furia_de_araucaria: {
    id: 'furia_de_araucaria',
    name: 'Cataclismo Pehuenche',
    element: 'planta',
    power: 120,
    mpCost: 28,
    accuracy: 85,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Poder definitivo de la Araucaria milenaria que estremece la tierra.',
    animationColor: '#15803d',
  },

  // Fuego / Magma skills
  chispa_magma: {
    id: 'chispa_magma',
    name: 'Chispa de Magma',
    element: 'fuego',
    power: 42,
    mpCost: 5,
    accuracy: 95,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Lanza una pequeña brasa ardiente nacida del cráter.',
    effectType: 'burn',
    effectChance: 0.2,
    animationColor: '#f97316',
  },
  aliento_volcanico: {
    id: 'aliento_volcanico',
    name: 'Aliento Volcánico',
    element: 'fuego',
    power: 75,
    mpCost: 15,
    accuracy: 90,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Una llamarada de fuego y azufre del Villarrica envuelve al enemigo.',
    effectType: 'burn',
    effectChance: 0.4,
    animationColor: '#ef4444',
  },
  escudo_de_ceniza: {
    id: 'escudo_de_ceniza',
    name: 'Manto de Ceniza',
    element: 'fuego',
    power: 0,
    mpCost: 10,
    accuracy: 100,
    category: 'support',
    target: 'self',
    description: 'Aumenta drásticamente la defensa física y refleja daño menor.',
    effectType: 'defense_buff',
    animationColor: '#78716c',
  },
  furia_del_pillan: {
    id: 'furia_del_pillan',
    name: 'Ira del Pillán',
    element: 'fuego',
    power: 125,
    mpCost: 30,
    accuracy: 90,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Invocación del espíritu del volcán que desata ríos de magma puro.',
    effectType: 'burn',
    effectChance: 0.6,
    animationColor: '#dc2626',
  },

  // Agua / Lagos skills
  chorro_lago: {
    id: 'chorro_lago',
    name: 'Chorro del Lago',
    element: 'agua',
    power: 40,
    mpCost: 5,
    accuracy: 95,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Corriente pura de las aguas cristalinas del Lago Villarrica.',
    animationColor: '#0ea5e9',
  },
  cascada_caburgua: {
    id: 'cascada_caburgua',
    name: 'Salto del Caburgua',
    element: 'agua',
    power: 72,
    mpCost: 14,
    accuracy: 90,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Torrente impetuoso de aguas turquesas que golpea con fuerza descomunal.',
    animationColor: '#0284c7',
  },
  neblina_sanadora: {
    id: 'neblina_sanadora',
    name: 'Neblina Termal',
    element: 'agua',
    power: 0,
    mpCost: 12,
    accuracy: 100,
    category: 'heal',
    target: 'single_ally',
    description: 'Vapor curativo de las termas de Pucón que sana heridas y estados.',
    effectType: 'heal',
    animationColor: '#38bdf8',
  },
  maremoto_austral: {
    id: 'maremoto_austral',
    name: 'Maremoto de los Fiordos',
    element: 'agua',
    power: 115,
    mpCost: 26,
    accuracy: 88,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Olas gélidas de los fiordos de Hornopirén que barren a todos los rivales.',
    animationColor: '#0369a1',
  },

  // Viento / Cielo skills
  rafaga_andina: {
    id: 'rafaga_andina',
    name: 'Ráfaga Andina',
    element: 'viento',
    power: 40,
    mpCost: 5,
    accuracy: 95,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Viento cortante que desciende desde las cumbres de la cordillera.',
    animationColor: '#a855f7',
  },
  canto_del_chucao: {
    id: 'canto_del_chucao',
    name: 'Canto del Chucao',
    element: 'viento',
    power: 65,
    mpCost: 12,
    accuracy: 92,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Canto místico del bosque que aturde y debilita la resistencia del rival.',
    effectType: 'attack_buff',
    animationColor: '#c084fc',
  },
  vendaval_valdiviano: {
    id: 'vendaval_valdiviano',
    name: 'Vendaval del Sur',
    element: 'viento',
    power: 110,
    mpCost: 24,
    accuracy: 90,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Torbellino austral que arrasa con velocidad implacable.',
    animationColor: '#9333ea',
  },

  // Hielo / Patagónico skills
  escarcha_austral: {
    id: 'escarcha_austral',
    name: 'Punzón Glaciar',
    element: 'hielo',
    power: 45,
    mpCost: 6,
    accuracy: 95,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Esquirla helada moldeada en los ventisqueros de Hornopirén.',
    effectType: 'freeze',
    effectChance: 0.25,
    animationColor: '#06b6d4',
  },
  alud_patagonico: {
    id: 'alud_patagonico',
    name: 'Alud Patagónico',
    element: 'hielo',
    power: 80,
    mpCost: 16,
    accuracy: 85,
    category: 'elemental',
    target: 'single_enemy',
    description: 'Masa de nieve y hielo milenario que congela al impacto.',
    effectType: 'freeze',
    effectChance: 0.45,
    animationColor: '#22d3ee',
  },
  cero_absoluto: {
    id: 'cero_absoluto',
    name: 'Resplandor Glaciar',
    element: 'hielo',
    power: 120,
    mpCost: 28,
    accuracy: 88,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Temperatura glacial que detiene el tiempo y congela el campo de batalla.',
    animationColor: '#67e8f9',
  },

  // Tierra / Cordillera skills
  placaje_cordillerano: {
    id: 'placaje_cordillerano',
    name: 'Placaje Silvestre',
    element: 'tierra',
    power: 40,
    mpCost: 4,
    accuracy: 100,
    category: 'physical',
    target: 'single_enemy',
    description: 'Carga frontal con toda la fuerza del sotobosque.',
    animationColor: '#b45309',
  },
  terremoto_andino: {
    id: 'terremoto_andino',
    name: 'Falla de San Ramón',
    element: 'tierra',
    power: 85,
    mpCost: 18,
    accuracy: 90,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Fisuras telúricas que sacuden violentamente el terreno.',
    animationColor: '#92400e',
  },

  // Barbara's Job Skills (Final Fantasy III inspiration)
  balsamo_curativo: {
    id: 'balsamo_curativo',
    name: 'Ungüento de Matico',
    element: 'normal',
    power: 0,
    mpCost: 8,
    accuracy: 100,
    category: 'heal',
    target: 'single_ally',
    description: 'Aplica hojas de matico ancestral para restaurar 60 PS.',
    effectType: 'heal',
    animationColor: '#10b981',
  },
  infusion_calafate: {
    id: 'infusion_calafate',
    name: 'Brebaje de Calafate',
    element: 'normal',
    power: 0,
    mpCost: 12,
    accuracy: 100,
    category: 'heal',
    target: 'all_allies',
    description: 'Quien come calafate siempre vuelve. Cura estados y restaura PS al grupo.',
    effectType: 'heal',
    animationColor: '#8b5cf6',
  },
  llamado_ancestral: {
    id: 'llamado_ancestral',
    name: 'Armonía de la Tierra',
    element: 'sagrado',
    power: 0,
    mpCost: 15,
    accuracy: 100,
    category: 'support',
    target: 'all_allies',
    description: 'Aumenta el ataque y la velocidad del equipo durante 3 turnos.',
    effectType: 'attack_buff',
    animationColor: '#eab308',
  },
  disparo_tactico: {
    id: 'disparo_tactico',
    name: 'Flecha Silvestre',
    element: 'tierra',
    power: 55,
    mpCost: 8,
    accuracy: 95,
    category: 'physical',
    target: 'single_enemy',
    description: 'Tiro preciso con arco de madera de Coigüe que perfora defensas.',
    animationColor: '#854d0e',
  },
  sintesis_elemental: {
    id: 'sintesis_elemental',
    name: 'Fusión Cuádruple',
    element: 'sagrado',
    power: 100,
    mpCost: 25,
    accuracy: 90,
    category: 'elemental',
    target: 'all_enemies',
    description: 'Combina Fuego, Agua, Tierra y Viento en un pulso elemental devastador.',
    animationColor: '#f59e0b',
  }
};

// Evolution Line Templates
export interface SpiritTemplate {
  baseId: string;
  defaultName: string;
  scientificName: string;
  primaryElement: ElementType;
  secondaryElement?: ElementType;
  rarity: 'común' | 'raro' | 'místico' | 'legendario';
  lore: string;
  naturalHistory: string;
  evolutionLine: EvolutionStage[];
}

export const SPIRITS_REGISTRY: Record<string, SpiritTemplate> = {
  // 1. Brotín -> Pehuén Guardián -> Araucaria Cósmica (Planta / Sagrado)
  brotin: {
    baseId: 'brotin',
    defaultName: 'Brotín',
    scientificName: 'Araucaria araucana sylvestris',
    primaryElement: 'planta',
    rarity: 'raro',
    lore: 'Nacido de un piñón sagrado en las laderas andinas. Sus tiernos brotes canalizan la energía vital de la tierra.',
    naturalHistory: 'Inspirado en el Pehuén o Araucaria chilena, conífera endémica declarada Monumento Natural que vive más de 1.000 años en la Cordillera de los Andes.',
    evolutionLine: [
      {
        stage: 1,
        name: 'Brotín',
        title: 'Brote de Pewén',
        description: 'Un pequeño espíritu arbóreo lleno de energía y curiosidad.',
        spriteKey: 'brotin_1',
        icon: '🌱',
        baseHp: 65,
        baseMp: 40,
        baseAttack: 45,
        baseDefense: 50,
        baseSpAttack: 55,
        baseSpDefense: 52,
        baseSpeed: 48,
        requiredLevel: 1,
        signatureSkill: SKILLS_DB.hoja_pewen,
      },
      {
        stage: 2,
        name: 'Pehuén Guardián',
        title: 'Protector de los Valles',
        description: 'Su corteza se ha endurecido como roca y sus ramas forman una coraza protectora.',
        spriteKey: 'brotin_2',
        icon: '🌲',
        baseHp: 110,
        baseMp: 70,
        baseAttack: 70,
        baseDefense: 85,
        baseSpAttack: 88,
        baseSpDefense: 82,
        baseSpeed: 60,
        requiredLevel: 10,
        requiredItem: 'Resina de Pewén',
        signatureSkill: SKILLS_DB.raiz_ancestral,
      },
      {
        stage: 3,
        name: 'Araucaria Ancestral',
        title: 'Titán Sagrado de los Andes',
        description: 'Espíritu legendario con milenios de sabiduría. Canaliza el latido de la Cordillera de los Andes.',
        spriteKey: 'brotin_3',
        icon: '🌳',
        baseHp: 180,
        baseMp: 120,
        baseAttack: 95,
        baseDefense: 130,
        baseSpAttack: 135,
        baseSpDefense: 125,
        baseSpeed: 75,
        requiredLevel: 22,
        requiredItem: 'Gema Milenaria Pewén',
        signatureSkill: SKILLS_DB.furia_de_araucaria,
      }
    ]
  },

  // 2. Pillancito -> Salamandra de Magma -> Pillán del Fuego Eterno (Fuego / Tierra)
  pillancito: {
    baseId: 'pillancito',
    defaultName: 'Pillancito',
    scientificName: 'Liolaemus volcanicus ignis',
    primaryElement: 'fuego',
    secondaryElement: 'tierra',
    rarity: 'raro',
    lore: 'Criatura surgida de los respiraderos de lava del cráter del Volcán Villarrica (Ruka Pillán).',
    naturalHistory: 'Basado en los lagartos adaptados a las cumbres volcánicas de la Araucanía y en la mitología mapuche del Pillán, espíritu del trueno y el magma.',
    evolutionLine: [
      {
        stage: 1,
        name: 'Pillancito',
        title: 'Chispa Volcánica',
        description: 'Un espíritu inquieto y ardiente que danza alegre sobre las cenizas calientes.',
        spriteKey: 'pillancito_1',
        icon: '🔥',
        baseHp: 58,
        baseMp: 45,
        baseAttack: 52,
        baseDefense: 42,
        baseSpAttack: 62,
        baseSpDefense: 45,
        baseSpeed: 58,
        requiredLevel: 1,
        signatureSkill: SKILLS_DB.chispa_magma,
      },
      {
        stage: 2,
        name: 'Salamandra Ignea',
        title: 'Bestia del Basalto',
        description: 'Reptil de fuego cuya cola quema con la intensidad de la roca fundida subterránea.',
        spriteKey: 'pillancito_2',
        icon: '🦎',
        baseHp: 98,
        baseMp: 75,
        baseAttack: 80,
        baseDefense: 72,
        baseSpAttack: 102,
        baseSpDefense: 70,
        baseSpeed: 78,
        requiredLevel: 10,
        requiredItem: 'Corazón de Basalto',
        signatureSkill: SKILLS_DB.aliento_volcanico,
      },
      {
        stage: 3,
        name: 'Pillán Titán de Fuego',
        title: 'Señor del Volcán Villarrica',
        description: 'La manifestación viva del Ruka Pillán. Su rugido estremece la Novena Región de Chile.',
        spriteKey: 'pillancito_3',
        icon: '🌋',
        baseHp: 165,
        baseMp: 130,
        baseAttack: 110,
        baseDefense: 98,
        baseSpAttack: 148,
        baseSpDefense: 105,
        baseSpeed: 95,
        requiredLevel: 22,
        requiredItem: 'Núcleo Magmático Ancestral',
        signatureSkill: SKILLS_DB.furia_del_pillan,
      }
    ]
  },

  // 3. Hualita -> Garza Mística -> Reina de los Lagos del Sur (Agua / Hielo)
  hualita: {
    baseId: 'hualita',
    defaultName: 'Hualita',
    scientificName: 'Podiceps major lacustris',
    primaryElement: 'agua',
    rarity: 'raro',
    lore: 'Navega en las aguas transparentes de los lagos de Pucón y Villarrica cantando a la luna llena.',
    naturalHistory: 'Inspirada en el Huala, el somormujo más grande de Sudamérica que bucea en los lagos y esteros del sur de Chile con gran agilidad subacuática.',
    evolutionLine: [
      {
        stage: 1,
        name: 'Hualita',
        title: 'Gota del Lago',
        description: 'Un suave espíritu de agua dulce que calma las corrientes y purifica el entorno.',
        spriteKey: 'hualita_1',
        icon: '💧',
        baseHp: 62,
        baseMp: 50,
        baseAttack: 40,
        baseDefense: 48,
        baseSpAttack: 58,
        baseSpDefense: 60,
        baseSpeed: 52,
        requiredLevel: 1,
        signatureSkill: SKILLS_DB.chorro_lago,
      },
      {
        stage: 2,
        name: 'Garza de Caburgua',
        title: 'Espíritu de las Cascadas',
        description: 'Elegante ave acuática cuyas alas desprenden gotas de rocío curativo.',
        spriteKey: 'hualita_2',
        icon: '🪶',
        baseHp: 105,
        baseMp: 85,
        baseAttack: 65,
        baseDefense: 76,
        baseSpAttack: 92,
        baseSpDefense: 95,
        baseSpeed: 74,
        requiredLevel: 10,
        requiredItem: 'Gota Termal de Pucón',
        signatureSkill: SKILLS_DB.cascada_caburgua,
      },
      {
        stage: 3,
        name: 'Dama del Lago Sagrado',
        title: 'Soberana de las Aguas del Sur',
        description: 'Encarnación de la pureza de los ríos y lagos araucanos. Controla la lluvia y las mareas.',
        spriteKey: 'hualita_3',
        icon: '🌊',
        baseHp: 170,
        baseMp: 140,
        baseAttack: 85,
        baseDefense: 110,
        baseSpAttack: 138,
        baseSpDefense: 140,
        baseSpeed: 90,
        requiredLevel: 22,
        requiredItem: 'Esencia de Aguas Pristinas',
        signatureSkill: SKILLS_DB.maremoto_austral,
      }
    ]
  },

  // 4. Chucao -> Chucao Tempestuoso -> Señor de los Vientos (Viento / Normal)
  chucao: {
    baseId: 'chucao',
    defaultName: 'Chucao',
    scientificName: 'Scelorchilus rubecula',
    primaryElement: 'viento',
    rarity: 'común',
    lore: 'La legendaria avecilla del bosque nativo. Su canto predice la buena o mala fortuna del viajero.',
    naturalHistory: 'Ave endémica del bosque templado austral de Chile. Famosa en la tradición popular chilena por augurar buena fortuna si canta a la derecha de la senda.',
    evolutionLine: [
      {
        stage: 1,
        name: 'Chucao',
        title: 'Ave del Buen Augurio',
        description: 'Pequeño pájaro rojizo y vivaz que salta ágilmente entre el sotobosque.',
        spriteKey: 'chucao_1',
        icon: '🐦',
        baseHp: 50,
        baseMp: 42,
        baseAttack: 48,
        baseDefense: 38,
        baseSpAttack: 50,
        baseSpDefense: 44,
        baseSpeed: 70,
        requiredLevel: 1,
        signatureSkill: SKILLS_DB.rafaga_andina,
      },
      {
        stage: 2,
        name: 'Chucao Tempestuoso',
        title: 'Heraldo de la Tormenta',
        description: 'Sus alas despliegan ráfagas que dispersan la niebla más densa.',
        spriteKey: 'chucao_2',
        icon: '🦅',
        baseHp: 85,
        baseMp: 70,
        baseAttack: 75,
        baseDefense: 62,
        baseSpAttack: 82,
        baseSpDefense: 68,
        baseSpeed: 105,
        requiredLevel: 10,
        requiredItem: 'Pluma del Viento Sur',
        signatureSkill: SKILLS_DB.canto_del_chucao,
      },
      {
        stage: 3,
        name: 'Señor de los Vientos',
        title: 'Cóndor de la Selva Valdiviana',
        description: 'Vuela majestuoso sobre las copas de los árboles dominando cada brisa de la Patagonia.',
        spriteKey: 'chucao_3',
        icon: '🌪️',
        baseHp: 140,
        baseMp: 110,
        baseAttack: 105,
        baseDefense: 85,
        baseSpAttack: 115,
        baseSpDefense: 92,
        baseSpeed: 135,
        requiredLevel: 22,
        requiredItem: 'Vórtice del Cielo Andino',
        signatureSkill: SKILLS_DB.vendaval_valdiviano,
      }
    ]
  },

  // 5. Puducito -> Pudú Astado -> Gran Ciervo Sagrado (Tierra / Planta)
  puducito: {
    baseId: 'puducito',
    defaultName: 'Puducito',
    scientificName: 'Pudu puda sylvaticus',
    primaryElement: 'tierra',
    secondaryElement: 'planta',
    rarity: 'raro',
    lore: 'El tímido ciervo más pequeño del mundo, bendecido con la protección milagrosa de los helechos gigantes.',
    naturalHistory: 'El cérvido más diminuto del planeta, habitante de los bosques densos de Chile desde el Maule hasta Aysén, conocido por su pelaje rojizo y timidez.',
    evolutionLine: [
      {
        stage: 1,
        name: 'Puducito',
        title: 'Cervatillo del Sotobosque',
        description: 'Dulce espíritu que se camufla entre las quilas y los musgos húmedos.',
        spriteKey: 'puducito_1',
        icon: '🦌',
        baseHp: 68,
        baseMp: 38,
        baseAttack: 48,
        baseDefense: 55,
        baseSpAttack: 42,
        baseSpDefense: 54,
        baseSpeed: 50,
        requiredLevel: 1,
        signatureSkill: SKILLS_DB.placaje_cordillerano,
      },
      {
        stage: 2,
        name: 'Pudú Astado Silvestre',
        title: 'Guardián de la Quila',
        description: 'Le crecen pequeñas cornamentas de madera pura que canalizan defensas terrestres.',
        spriteKey: 'puducito_2',
        icon: '🌿',
        baseHp: 118,
        baseMp: 65,
        baseAttack: 78,
        baseDefense: 92,
        baseSpAttack: 65,
        baseSpDefense: 90,
        baseSpeed: 65,
        requiredLevel: 10,
        requiredItem: 'Brote de Quila Dorada',
        signatureSkill: SKILLS_DB.terremoto_andino,
      },
      {
        stage: 3,
        name: 'Gran Ciervo Ancestral',
        title: 'Señor del Bosque Valdiviano',
        description: 'Majestuoso rey de la espesura cuya presencia devuelve la vida a la tierra marchita.',
        spriteKey: 'puducito_3',
        icon: '👑',
        baseHp: 185,
        baseMp: 105,
        baseAttack: 115,
        baseDefense: 135,
        baseSpAttack: 95,
        baseSpDefense: 130,
        baseSpeed: 80,
        requiredLevel: 22,
        requiredItem: 'Astas del Bosque Primigenio',
        signatureSkill: SKILLS_DB.terremoto_andino,
      }
    ]
  },

  // 6. Ventisquero -> Gólem Glaciar -> Coloso de Hornopirén (Hielo / Austral)
  ventisquero: {
    baseId: 'ventisquero',
    defaultName: 'Ventisquero',
    scientificName: 'Cryofragmenta patagoniensis',
    primaryElement: 'hielo',
    rarity: 'místico',
    lore: 'Formado a partir del hielo azul de los glaciares colgantes de la Carretera Austral.',
    naturalHistory: 'Criatura elemental nacida de los hielos milenarios de la Patagonia chilena y los campos de hielo sur, reflejo de la pureza de los fiordos de Comau.',
    evolutionLine: [
      {
        stage: 1,
        name: 'Ventisquero',
        title: 'Escarcha Austral',
        description: 'Frágil fragmento de hielo flotante con ojos de cristal que reflejan las estrellas del sur.',
        spriteKey: 'ventisquero_1',
        icon: '❄️',
        baseHp: 64,
        baseMp: 52,
        baseAttack: 46,
        baseDefense: 58,
        baseSpAttack: 62,
        baseSpDefense: 64,
        baseSpeed: 42,
        requiredLevel: 1,
        signatureSkill: SKILLS_DB.escarcha_austral,
      },
      {
        stage: 2,
        name: 'Gólem Patagónico',
        title: 'Guardián de los Fiordos',
        description: 'Cuerpo compacto de hielo milenario prácticamente impenetrable a ataques físicos.',
        spriteKey: 'ventisquero_2',
        icon: '🧊',
        baseHp: 115,
        baseMp: 82,
        baseAttack: 72,
        baseDefense: 105,
        baseSpAttack: 95,
        baseSpDefense: 102,
        baseSpeed: 55,
        requiredLevel: 10,
        requiredItem: 'Cristal de Hielo Azul',
        signatureSkill: SKILLS_DB.alud_patagonico,
      },
      {
        stage: 3,
        name: 'Coloso de Hornopirén',
        title: 'Monolito del Fin del Mundo',
        description: 'Gigante ancestral de hielo puro y niebla marina. Su aliento congela el mar.',
        spriteKey: 'ventisquero_3',
        icon: '🏔️',
        baseHp: 175,
        baseMp: 125,
        baseAttack: 102,
        baseDefense: 145,
        baseSpAttack: 132,
        baseSpDefense: 140,
        baseSpeed: 68,
        requiredLevel: 22,
        requiredItem: 'Corazón del Ventisquero Eterno',
        signatureSkill: SKILLS_DB.cero_absoluto,
      }
    ]
  }
};

// Factory helper to create a creature instance
export function createSpiritInstance(
  baseId: string, 
  level: number = 5, 
  stage: number = 1
): SpiritCreature {
  const template = SPIRITS_REGISTRY[baseId] || SPIRITS_REGISTRY.brotin;
  const currentStage = Math.max(1, Math.min(3, stage));
  const stageData = template.evolutionLine[currentStage - 1];

  // Calculate scaled stats based on level
  const hpMultiplier = 1 + (level - 1) * 0.12;
  const statMultiplier = 1 + (level - 1) * 0.09;

  const maxHp = Math.round(stageData.baseHp * hpMultiplier);
  const maxMp = Math.round(stageData.baseMp * hpMultiplier * 0.8);

  // Determine starting skills
  const skills: ElementalSkill[] = [stageData.signatureSkill];

  if (currentStage >= 2 && template.evolutionLine[0].signatureSkill) {
    skills.push(template.evolutionLine[0].signatureSkill);
  }
  if (currentStage >= 3 && template.evolutionLine[1].signatureSkill) {
    skills.push(template.evolutionLine[1].signatureSkill);
  }

  // Add default support or secondary skill
  if (template.primaryElement === 'planta') skills.push(SKILLS_DB.bendicion_forestal);
  if (template.primaryElement === 'fuego') skills.push(SKILLS_DB.escudo_de_ceniza);
  if (template.primaryElement === 'agua') skills.push(SKILLS_DB.neblina_sanadora);
  if (template.primaryElement === 'viento') skills.push(SKILLS_DB.rafaga_andina);
  if (template.primaryElement === 'tierra') skills.push(SKILLS_DB.placaje_cordillerano);
  if (template.primaryElement === 'hielo') skills.push(SKILLS_DB.alud_patagonico);

  return {
    uid: `spirit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    baseId: template.baseId,
    name: stageData.name,
    primaryElement: template.primaryElement,
    secondaryElement: template.secondaryElement,
    level,
    exp: 0,
    maxExp: level * 65,
    currentHp: maxHp,
    maxHp,
    currentMp: maxMp,
    maxMp,
    attack: Math.round(stageData.baseAttack * statMultiplier),
    defense: Math.round(stageData.baseDefense * statMultiplier),
    spAttack: Math.round(stageData.baseSpAttack * statMultiplier),
    spDefense: Math.round(stageData.baseSpDefense * statMultiplier),
    speed: Math.round(stageData.baseSpeed * statMultiplier),
    currentStage,
    evolutionLine: template.evolutionLine,
    skills,
    lore: stageData.description,
    rarity: template.rarity,
  };
}

// Elemental Advantage Matrix (FireRed + JRPG style)
export function getElementalMultiplier(attacker: ElementType, defender: ElementType): { multiplier: number; message: string } {
  // Matrix rules
  const advantages: Record<ElementType, ElementType[]> = {
    fuego: ['planta', 'hielo'],
    agua: ['fuego', 'tierra'],
    planta: ['agua', 'tierra'],
    viento: ['planta'],
    tierra: ['fuego', 'viento'],
    hielo: ['planta', 'viento'],
    sagrado: ['fuego', 'tierra', 'agua', 'planta', 'viento', 'hielo'],
    normal: []
  };

  const resistances: Record<ElementType, ElementType[]> = {
    fuego: ['fuego', 'planta', 'hielo'],
    agua: ['agua', 'fuego', 'hielo'],
    planta: ['planta', 'agua', 'tierra'],
    viento: ['viento', 'tierra'],
    tierra: ['tierra'],
    hielo: ['hielo', 'agua'],
    sagrado: [],
    normal: []
  };

  if (advantages[attacker]?.includes(defender)) {
    return { multiplier: 2.0, message: '¡Es súper eficaz!' };
  }
  if (resistances[defender]?.includes(attacker)) {
    return { multiplier: 0.5, message: 'No es muy eficaz...' };
  }
  return { multiplier: 1.0, message: '' };
}

// Move Learning Progression by Level (Pokémon Style Learnset)
export const SPIRIT_LEARNSETS: Record<string, { level: number; skill: ElementalSkill }[]> = {
  brotin: [
    { level: 2, skill: SKILLS_DB.hoja_pewen },
    { level: 3, skill: SKILLS_DB.bendicion_forestal },
    { level: 4, skill: SKILLS_DB.raiz_ancestral },
    { level: 5, skill: SKILLS_DB.furia_de_araucaria },
  ],
  pillancito: [
    { level: 2, skill: SKILLS_DB.chispa_magma },
    { level: 3, skill: SKILLS_DB.escudo_de_ceniza },
    { level: 4, skill: SKILLS_DB.aliento_volcanico },
    { level: 5, skill: SKILLS_DB.furia_del_pillan },
  ],
  hualita: [
    { level: 2, skill: SKILLS_DB.chorro_lago },
    { level: 3, skill: SKILLS_DB.neblina_sanadora },
    { level: 4, skill: SKILLS_DB.cascada_caburgua },
    { level: 5, skill: SKILLS_DB.torrente_sagrado },
  ],
  chucao: [
    { level: 2, skill: SKILLS_DB.picotazo_maule },
    { level: 3, skill: SKILLS_DB.rafaga_andina },
    { level: 4, skill: SKILLS_DB.viento_cordillerano },
    { level: 5, skill: SKILLS_DB.vendaval_del_sur },
  ],
  puducito: [
    { level: 2, skill: SKILLS_DB.placaje_cordillerano },
    { level: 3, skill: SKILLS_DB.remolino_de_hojas },
    { level: 4, skill: SKILLS_DB.terremoto_valdiviano },
    { level: 5, skill: SKILLS_DB.danza_de_los_alerces },
  ],
  ventisquero: [
    { level: 2, skill: SKILLS_DB.escarcha_austral },
    { level: 3, skill: SKILLS_DB.alud_patagonico },
    { level: 4, skill: SKILLS_DB.muro_de_hielo },
    { level: 5, skill: SKILLS_DB.cero_absoluto },
  ],
};

/**
 * Checks if a spirit learns any new skill upon reaching a new level
 */
export function checkNewMovesToLearn(spirit: SpiritCreature, newLevel: number): ElementalSkill[] {
  const learnset = SPIRIT_LEARNSETS[spirit.baseId] || [];
  const existingSkillIds = new Set(spirit.skills.map(s => s.id));
  
  return learnset
    .filter(entry => entry.level === newLevel && !existingSkillIds.has(entry.skill.id))
    .map(entry => entry.skill);
}

