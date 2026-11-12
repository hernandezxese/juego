/**
 * Quest & Objective Guide System for Bárbara: Crónicas Elementales del Sur
 */

import { RegionId, MapRegion } from '../types/game';

export interface QuestStep {
  id: string;
  regionId: RegionId;
  title: string;
  description: string;
  hint: string;
  targetCoords?: { x: number; y: number };
}

export function getCurrentQuest(region: MapRegion, unlockedRegions: RegionId[]): {
  stepNumber: number;
  totalSteps: number;
  title: string;
  instruction: string;
  hint: string;
  targetCoords?: { x: number; y: number };
} {
  const entities = region.entities;

  if (region.id === 'santiago') {
    const npcIgnacio = entities.find(e => e.id === 'npc_profesor');
    const chest1 = entities.find(e => e.id === 'chest_santiago_1');
    const chest2 = entities.find(e => e.id === 'chest_santiago_2');
    const obstacle = entities.find(e => e.id === 'obstacle_santiago');
    const boss = entities.find(e => e.id === 'boss_santiago');

    if (!npcIgnacio?.cleared) {
      return {
        stepNumber: 1,
        totalSteps: 4,
        title: 'El Despertar de la Expedición',
        instruction: 'Habla con Don Ignacio (icono verde, en el centro norte) para recibir tus primeros Orbes y Ungüentos de Matico.',
        hint: 'Usa las flechas o WASD para caminar hasta él y presiona [Espacio] o [ACCIÓN].',
        targetCoords: { x: npcIgnacio?.x ?? 12, y: npcIgnacio?.y ?? 2 }
      };
    }

    if (!chest1?.cleared || !chest2?.cleared) {
      return {
        stepNumber: 2,
        totalSteps: 4,
        title: 'Equipa tu Mochila',
        instruction: 'Abre los cofres del Parque Forestal y del Cerro San Cristóbal para conseguir orbes y la Resina de Pewén.',
        hint: 'Cofres en (x:3, y:3) y (x:22, y:3). ¡Camina junto a ellos y presiona Acción!',
        targetCoords: { x: !chest1?.cleared ? (chest1?.x ?? 3) : (chest2?.x ?? 22), y: !chest1?.cleared ? (chest1?.y ?? 3) : (chest2?.y ?? 3) }
      };
    }

    if (!boss?.cleared) {
      return {
        stepNumber: 3,
        totalSteps: 4,
        title: 'Purifica el Río Mapocho',
        instruction: 'El Guardián del Mapocho (Chucao Furia) ha despertado en el altar del sur. ¡Derrótalo para abrir el camino a Pucón!',
        hint: 'Usa ataques de Planta o Roca para contrarrestar su velocidad.',
        targetCoords: { x: boss?.x ?? 12, y: boss?.y ?? 16 }
      };
    }

    const portalPucon = entities.find(e => e.id === 'portal_to_pucon');
    return {
      stepNumber: 4,
      totalSteps: 4,
      title: 'Hacia los Lagos del Sur',
      instruction: '¡El camino a Pucón está despejado! Cruza el portal sur o abre el Mapa [M] para viajar a Pucón.',
      hint: 'Dirígete al letrero de madera en la parte inferior del mapa.',
      targetCoords: { x: portalPucon?.x ?? 12, y: portalPucon?.y ?? 19 }
    };
  }

  if (region.id === 'pucon') {
    const npcRayen = entities.find(e => e.id === 'npc_guia_pucon');
    const obstacle = entities.find(e => e.id === 'obstacle_pucon');
    const boss = entities.find(e => e.id === 'boss_pucon');

    if (!npcRayen?.cleared) {
      return {
        stepNumber: 1,
        totalSteps: 3,
        title: 'La Guardaparques de los Lagos',
        instruction: 'Habla con Rayén junto al sendero para informarte del estado de las aguas y recibir una Gota Termal.',
        hint: 'Se encuentra en la zona norte entre los helechos.',
        targetCoords: { x: npcRayen?.x ?? 8, y: npcRayen?.y ?? 3 }
      };
    }

    if (!obstacle?.cleared) {
      return {
        stepNumber: 2,
        totalSteps: 3,
        title: 'Calma el Torrente del Caburgua',
        instruction: 'Despeja el torrente de agua que bloquea el puente central. Necesitas tener un espíritu con poder de AGUA (como Hualita) en tu equipo.',
        hint: 'Sintoniza a una Hualita en la orilla del lago para calmar la corriente.',
        targetCoords: { x: obstacle?.x ?? 12, y: obstacle?.y ?? 8 }
      };
    }

    if (!boss?.cleared) {
      return {
        stepNumber: 3,
        totalSteps: 3,
        title: 'La Soberana de las Aguas',
        instruction: 'La Soberana del Caburgua ha despertado en el santuario lacustre. ¡Purifícala para abrir el paso al Volcán Villarrica!',
        hint: 'Usa técnicas de Planta o Viento para causar daño súper eficaz contra espíritus de Agua.',
        targetCoords: { x: boss?.x ?? 12, y: boss?.y ?? 16 }
      };
    }

    const portalVillarrica = entities.find(e => e.id === 'portal_to_villarrica');
    return {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Ascenso al Ruka Pillán',
      instruction: '¡El santuario lacustre está purificado! Avanza por el portal sur hacia el rugiente Volcán Villarrica.',
      hint: 'Cruza el portal sur para ascender a las cavernas de magma.',
      targetCoords: { x: portalVillarrica?.x ?? 12, y: portalVillarrica?.y ?? 19 }
    };
  }

  if (region.id === 'villarrica') {
    const npcNahuel = entities.find(e => e.id === 'npc_minero_villarrica');
    const obstacle = entities.find(e => e.id === 'obstacle_villarrica');
    const boss = entities.find(e => e.id === 'boss_villarrica');

    if (!npcNahuel?.cleared) {
      return {
        stepNumber: 1,
        totalSteps: 3,
        title: 'El Herrero del Magma',
        instruction: 'Habla con Nahuel en las faldas del volcán para recibir un Corazón de Basalto de evolución.',
        hint: 'Nahuel está ubicado en la entrada noroeste de las cavernas.',
        targetCoords: { x: npcNahuel?.x ?? 6, y: npcNahuel?.y ?? 3 }
      };
    }

    if (!obstacle?.cleared) {
      return {
        stepNumber: 2,
        totalSteps: 3,
        title: 'Enfría la Roca Magmática',
        instruction: 'Enfría la gran roca incandescente en el camino central. Necesitas un espíritu con técnica de AGUA o HIELO.',
        hint: 'Usa a tu espíritu acuático para pulverizar la roca con agua gélida.',
        targetCoords: { x: obstacle?.x ?? 12, y: obstacle?.y ?? 10 }
      };
    }

    if (!boss?.cleared) {
      return {
        stepNumber: 3,
        totalSteps: 3,
        title: 'El Señor del Fuego Eterno',
        instruction: 'El colosal Pillán ha despertado en el cráter liberado. ¡Desafíalo para calmar la furia volcánica!',
        hint: 'Los ataques de Agua causan un 200% de daño al fuego del Pillán.',
        targetCoords: { x: boss?.x ?? 12, y: boss?.y ?? 16 }
      };
    }

    const portalHornopiren = entities.find(e => e.id === 'portal_to_hornopiren');
    return {
      stepNumber: 3,
      totalSteps: 3,
      title: 'Rumbo a la Patagonia',
      instruction: '¡El fuego del Pillán arde en paz! Zarpa por el portal sur hacia los fiordos de Hornopirén en la Carretera Austral.',
      hint: 'El portal sur te conducirá al último santuario de Chile.',
      targetCoords: { x: portalHornopiren?.x ?? 12, y: portalHornopiren?.y ?? 19 }
    };
  }

  // Hornopirén
  const npcChecho = entities.find(e => e.id === 'npc_alercero');
  const obstacle = entities.find(e => e.id === 'obstacle_hornopiren');
  const boss = entities.find(e => e.id === 'boss_hornopiren');

  if (!npcChecho?.cleared) {
    return {
      stepNumber: 1,
      totalSteps: 3,
      title: 'El Guardián del Alerce Milenario',
      instruction: 'Habla con Don Checho junto a los alerces milenarios para recibir la infusión sagrada de calafate.',
      hint: 'Se encuentra en el claro occidental de los alerces.',
      targetCoords: { x: npcChecho?.x ?? 7, y: npcChecho?.y ?? 3 }
    };
  }

  if (!obstacle?.cleared) {
    return {
      stepNumber: 2,
      totalSteps: 3,
      title: 'Funde el Muro Glaciar',
      instruction: 'Derrite el milenario muro de hielo azul. Necesitas un espíritu con el poder ígneo del Fuego del Pillán.',
      hint: 'Asegúrate de llevar a Pillancito o Salamandra Ígnea en tu equipo.',
      targetCoords: { x: obstacle?.x ?? 12, y: obstacle?.y ?? 9 }
    };
  }

  return {
    stepNumber: 3,
    totalSteps: 3,
    title: 'La Batalla por el Alma de Chile',
    instruction: '¡Entra al Santuario Primigenio y purifica al Coloso de Hornopirén y la Ceniza Umbría para restaurar la naturaleza!',
    hint: 'Abre el Santuario de Evolución [botón "Evolución"] para alcanzar las formas titánicas de tus espíritus antes del combate.',
    targetCoords: { x: boss?.x ?? 12, y: boss?.y ?? 16 }
  };
}

/**
 * Checks whether the regional boss of the current stage has completed all prerequisite missions
 */
export function isStageBossAwakened(region: MapRegion): boolean {
  const entities = region.entities;
  if (region.id === 'santiago') {
    const npcIgnacio = entities.find(e => e.id === 'npc_profesor');
    const chest1 = entities.find(e => e.id === 'chest_santiago_1');
    const chest2 = entities.find(e => e.id === 'chest_santiago_2');
    return Boolean(npcIgnacio?.cleared && (chest1?.cleared || chest2?.cleared));
  }
  if (region.id === 'pucon') {
    const npcRayen = entities.find(e => e.id === 'npc_guia_pucon');
    const obstacle = entities.find(e => e.id === 'obstacle_pucon');
    return Boolean(npcRayen?.cleared && obstacle?.cleared);
  }
  if (region.id === 'villarrica') {
    const npcNahuel = entities.find(e => e.id === 'npc_minero_villarrica');
    const obstacle = entities.find(e => e.id === 'obstacle_villarrica');
    return Boolean(npcNahuel?.cleared && obstacle?.cleared);
  }
  if (region.id === 'hornopiren') {
    const npcChecho = entities.find(e => e.id === 'npc_alercero');
    const obstacle = entities.find(e => e.id === 'obstacle_hornopiren');
    return Boolean(npcChecho?.cleared && obstacle?.cleared);
  }
  return true;
}

