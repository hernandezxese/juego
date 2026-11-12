/**
 * Map Regions for Bárbara: Crónicas Elementales del Sur
 * Expanded 26x20 Labyrinth Maps with visible roaming wild spirits,
 * simple puzzle navigation paths, and mission-gated bosses.
 */

import { MapRegion, RegionId } from '../types/game';

// Tile Legend:
// 0: Hierba / Césped (Walkable)
// 1: Camino de Piedra / Tierra (Walkable)
// 2: Agua / Río / Lago (Blocked)
// 3: Montaña / Roca Alta / Pared (Blocked)
// 4: Bosque Denso / Árboles Nativos (Blocked)
// 5: Lava / Roca Volcánica Ardiente (Blocked)
// 6: Hielo / Glaciar / Nieve (Walkable)
// 7: Flores / Helechos Silvestres (Walkable)

export const REGIONS_DATA: Record<RegionId, MapRegion> = {
  // -------------------------------------------------------------
  // REGION 1: SANTIAGO (Expanded 26x20 with Labyrinth Paths)
  // -------------------------------------------------------------
  santiago: {
    id: 'santiago',
    name: 'Valle de Santiago & San Cristóbal',
    subtitle: 'El Inicio del Viaje y el Llamado de la Tierra',
    lore: 'Entre las avenidas urbanas y las laderas del Cerro San Cristóbal, las raíces ancestrales de la cuenca del Mapocho comienzan a despertar. Bárbara inicia aquí su expedición.',
    width: 26,
    height: 20,
    themeColor: '#10b981',
    ambientColor: 'rgba(16, 185, 129, 0.08)',
    weather: 'soleado',
    bgmId: 'santiago',
    isUnlocked: true,
    tiles: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 0, 7, 0, 4, 4, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 4, 0, 7, 7, 0, 0, 0, 0, 3],
      [3, 7, 0, 0, 4, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 4, 0, 7, 0, 1, 1, 1, 0, 3],
      [3, 0, 0, 1, 1, 1, 1, 1, 0, 0, 4, 4, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 7, 1, 0, 3],
      [3, 4, 0, 1, 0, 0, 0, 1, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 3],
      [3, 4, 0, 1, 0, 7, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 7, 0, 1, 1, 1, 1, 0, 1, 0, 3],
      [3, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 3],
      [3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 3],
      [3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3], // Río Mapocho y puentes
      [3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
      [3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 7, 1, 0, 0, 4, 4, 0, 1, 0, 0, 1, 0, 4, 4, 0, 1, 1, 1, 1, 1, 7, 0, 0, 3],
      [3, 0, 0, 1, 0, 0, 4, 4, 0, 1, 1, 1, 1, 0, 4, 4, 0, 0, 0, 0, 0, 1, 0, 4, 0, 3],
      [3, 4, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 4, 0, 3],
      [3, 4, 4, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 4, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 7, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 3], // Altar del Jefe
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
    entities: [
      {
        id: 'npc_profesor',
        x: 12,
        y: 2,
        type: 'npc',
        name: 'Don Ignacio (Naturalista)',
        sprite: 'npc_old_man',
        dialog: [
          '¡Hola Bárbara! Tu vínculo con la naturaleza es fuerte y noble.',
          'La "Ceniza Umbría" está perturbando la armonía elemental a lo largo de Chile.',
          'He sellado el altar del sur por seguridad. Abre los cofres y despeja los obstáculos del valle para despertar al Guardián del Mapocho.',
          'Toma estos ungüentos medicinales de matico y orbes de resonancia.'
        ],
        rewardItem: { id: 'matico', count: 4 },
        rewardGold: 150,
      },
      {
        id: 'chest_santiago_1',
        x: 3,
        y: 3,
        type: 'chest',
        name: 'Cofre del Parque Forestal',
        sprite: 'chest',
        rewardItem: { id: 'orbe_resonancia', count: 8 },
        dialog: ['¡Encontraste 8 Orbes de Resonancia Pewén! Con ellos podrás sintonizar criaturas silvestres.'],
      },
      {
        id: 'chest_santiago_2',
        x: 22,
        y: 3,
        type: 'chest',
        name: 'Alijo del Cerro San Cristóbal',
        sprite: 'chest',
        rewardItem: { id: 'esencia_pewen', count: 3 },
        dialog: ['¡Obtuviste 3 Resinas de Pewén! Te permitirán evolucionar a tus espíritus en el Santuario.'],
      },
      {
        id: 'obstacle_santiago',
        x: 18,
        y: 13,
        type: 'obstacle',
        name: 'Zarzales Espinosos de la Ribera',
        sprite: 'obstacle_bush',
        elementRequired: 'fuego',
        obstacleClearMessage: '¡El fuego de tu espíritu quemó los zarzales despejando un atajo secreto!',
        dialog: ['Una maraña de espinas bloquea el atajo. Necesitas un espíritu de FUEGO para despejarlo.'],
        rewardItem: { id: 'empanada', count: 2 },
      },

      // Visible Roaming Wild Spirits (Touch to initiate combat; defeated/captured spirits disappear)
      {
        id: 'wild_santiago_1',
        x: 7,
        y: 5,
        type: 'wild_encounter',
        encounterSpiritId: 'brotin',
        name: 'Brotín Silvestre',
        sprite: 'wild_brotin',
      },
      {
        id: 'wild_santiago_2',
        x: 18,
        y: 5,
        type: 'wild_encounter',
        encounterSpiritId: 'chucao',
        name: 'Chucao Andino',
        sprite: 'wild_chucao',
      },
      {
        id: 'wild_santiago_3',
        x: 5,
        y: 14,
        type: 'wild_encounter',
        encounterSpiritId: 'puducito',
        name: 'Puducito del Valle',
        sprite: 'wild_pudu',
      },
      {
        id: 'wild_santiago_4',
        x: 15,
        y: 14,
        type: 'wild_encounter',
        encounterSpiritId: 'chucao',
        name: 'Chucao Veloz',
        sprite: 'wild_chucao',
      },

      // Physical Shopkeeper in Stage 1: Botica de Don Manuel
      {
        id: 'npc_boticario_santiago',
        x: 10,
        y: 2,
        type: 'npc',
        name: 'Don Manuel (Boticario)',
        sprite: 'npc_shopkeeper',
        isShop: true,
        dialog: [
          '¡Hola Bárbara! Te doy la bienvenida a la Botica Tradicional de Santiago.',
          'Aquí preparo ungüentos de matico, gotas termales, infusiones de maná y orbes de resonancia.',
          '¡También compro todo tipo de recursos y minerales que recojas en tu viaje!'
        ],
      },

      // Fauna & Flora Monsters (Encounterable & Capturable)
      {
        id: 'deco_quiltro_santiago',
        x: 8,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'brotin',
        name: 'Quiltro Fiel de Santiago',
        sprite: 'deco_quiltro',
        dialog: ['¡Guau! El leal quiltro callejero despierta su espíritu de lucha silvestre.'],
      },
      {
        id: 'deco_palomas_santiago',
        x: 14,
        y: 3,
        type: 'wild_encounter',
        encounterSpiritId: 'chucao',
        name: 'Torcaza Andina del Parque',
        sprite: 'deco_palomas',
        dialog: ['¡Las palomas torcazas despliegan sus alas listas para el combate!'],
      },
      {
        id: 'deco_picaflor_santiago',
        x: 4,
        y: 11,
        type: 'wild_encounter',
        encounterSpiritId: 'chucao',
        name: 'Picaflor Chico Silvestre',
        sprite: 'deco_picaflor',
        dialog: ['¡Un veloz picaflor con plumaje tornasolado zumba retándote a combatir!'],
      },
      {
        id: 'deco_loica_santiago',
        x: 17,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'pillancito',
        name: 'Loica de Pecho Colorado',
        sprite: 'deco_loica',
        dialog: ['¡La orgullosa loica emite un trino de fuego con su pecho carmesí!'],
      },

      // Stage Boss (Appears once stage missions are completed!)
      {
        id: 'boss_santiago',
        x: 12,
        y: 16,
        type: 'boss',
        name: 'Guardián del Mapocho (Chucao Furia)',
        sprite: 'boss_spirit',
        bossSpiritId: 'chucao',
        requiresMissionsCleared: true,
        dialog: [
          '¡Un espíritu de Viento corrompido por la polución urbana ruge en el santuario desbloqueado!',
          'Bárbara: "¡Te liberaré de esa sombra con la armonía elemental de la naturaleza!"'
        ],
      },

      // Portal to Pucón
      {
        id: 'portal_to_pucon',
        x: 12,
        y: 19,
        type: 'portal',
        name: 'Ruta Sur hacia Pucón',
        sprite: 'portal_sign',
        destinationRegion: 'pucon',
        destinationX: 12,
        destinationY: 1,
        dialog: ['¿Deseas emprender camino hacia los lagos y bosques templados de Pucón?'],
      }
    ],
    wildEncounterTable: [
      { spiritId: 'brotin', minLevel: 1, maxLevel: 2, weight: 45 },
      { spiritId: 'chucao', minLevel: 1, maxLevel: 2, weight: 35 },
      { spiritId: 'puducito', minLevel: 1, maxLevel: 2, weight: 20 },
    ]
  },

  // -------------------------------------------------------------
  // REGION 2: PUCÓN (Expanded 26x20 with Water & Forest Labyrinth)
  // -------------------------------------------------------------
  pucon: {
    id: 'pucon',
    name: 'Pucón & Selva Valdiviana',
    subtitle: 'Aguas Termales, Saltos y Bosques Nativos',
    lore: 'A orillas del imponente lago y rodeado de milenarios bosques de coigües y helechos. Las aguas termales emanan vapores curativos mientras el eco del volcán resuena a la distancia.',
    width: 26,
    height: 20,
    themeColor: '#0ea5e9',
    ambientColor: 'rgba(14, 165, 233, 0.08)',
    weather: 'lluvia_suave',
    bgmId: 'pucon',
    isUnlocked: false,
    tiles: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 4, 4, 0, 7, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 7, 0, 4, 4, 4, 0, 0, 0, 3],
      [3, 4, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 4, 0, 1, 1, 0, 3],
      [3, 0, 7, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 7, 0, 0, 4, 0, 1, 7, 0, 3],
      [3, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 3], // Lago Villarrica
      [3, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0, 3],
      [3, 0, 1, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 3], // Puente
      [3, 4, 1, 1, 1, 1, 1, 4, 4, 1, 1, 4, 4, 1, 1, 1, 1, 1, 4, 4, 0, 0, 0, 1, 0, 3],
      [3, 4, 4, 0, 7, 0, 1, 4, 4, 1, 1, 4, 4, 1, 0, 7, 0, 4, 4, 0, 0, 0, 0, 1, 0, 3],
      [3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3],
      [3, 0, 7, 4, 4, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 4, 4, 7, 0, 1, 1, 1, 0, 3],
      [3, 0, 0, 4, 4, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 4, 4, 0, 0, 1, 0, 0, 0, 3],
      [3, 1, 1, 1, 0, 0, 0, 0, 1, 0, 4, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3],
      [3, 1, 7, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 3, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 7, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 3], // Altar
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
    entities: [
      {
        id: 'portal_back_santiago',
        x: 12,
        y: 0,
        type: 'portal',
        name: 'Regreso al Valle Central (Santiago)',
        sprite: 'portal_sign',
        destinationRegion: 'santiago',
        destinationX: 12,
        destinationY: 18,
        dialog: ['¿Quieres regresar al Valle de Santiago?'],
      },
      {
        id: 'npc_guia_pucon',
        x: 8,
        y: 3,
        type: 'npc',
        name: 'Rayén (Guardaparques)',
        sprite: 'npc_ranger',
        dialog: [
          '¡Bienvenida a Pucón, Bárbara! La Dama del Lago está inquieta por las cenizas del volcán.',
          'Aquí abundan los espíritus de Agua y Planta. Si combinas lluvia con viento, podrás crear ráfagas torrenciales.',
          'He cerrado el santuario del lago. Calma el torrente de la cascada y explora los claros para despertar a la Soberana del Caburgua.',
          'Toma estas Gotas Termales de Pucón: restauran la salud y purifican el cansancio.'
        ],
        rewardItem: { id: 'gota_termal', count: 3 },
      },
      {
        id: 'chest_pucon_1',
        x: 22,
        y: 3,
        type: 'chest',
        name: 'Cofre de los Ojos del Caburgua',
        sprite: 'chest',
        rewardItem: { id: 'gota_termal', count: 3 },
        dialog: ['¡Obtuviste Gotas Termales de Pucón! Ideales para curar y evolucionar a espíritus acuáticos.'],
      },
      {
        id: 'chest_pucon_secret',
        x: 2,
        y: 13,
        type: 'chest',
        name: 'Alijo Secreto de la Selva Valdiviana',
        sprite: 'chest',
        rewardItem: { id: 'orbe_resonancia', count: 5 },
        dialog: ['¡Encontraste 5 Orbes de Resonancia ocultos entre la densa vegetación!'],
      },
      {
        id: 'obstacle_pucon',
        x: 12,
        y: 8,
        type: 'obstacle',
        name: 'Torrente Imparable de la Cascada',
        sprite: 'obstacle_water',
        elementRequired: 'agua',
        obstacleClearMessage: '¡Tu espíritu de Agua calmó la corriente y abrió el puente sagrado!',
        dialog: ['Un torrente furioso inunda el puente. Necesitas un espíritu de AGUA para sintonizar con la corriente.'],
      },

      // Visible Roaming Wild Spirits
      {
        id: 'wild_pucon_1',
        x: 6,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'hualita',
        name: 'Hualita del Lago',
        sprite: 'wild_hualita',
      },
      {
        id: 'wild_pucon_2',
        x: 20,
        y: 6,
        type: 'wild_encounter',
        encounterSpiritId: 'puducito',
        name: 'Puducito Austral',
        sprite: 'wild_pudu',
      },
      {
        id: 'wild_pucon_3',
        x: 18,
        y: 12,
        type: 'wild_encounter',
        encounterSpiritId: 'hualita',
        name: 'Hualita Saltarina',
        sprite: 'wild_hualita',
      },
      {
        id: 'wild_pucon_4',
        x: 7,
        y: 14,
        type: 'wild_encounter',
        encounterSpiritId: 'chucao',
        name: 'Chucao del Bosque',
        sprite: 'wild_chucao',
      },

      // Decorative Characters
      {
        id: 'deco_pescador_pucon',
        x: 4,
        y: 6,
        type: 'decorative',
        name: 'Pescador del Lago',
        sprite: 'deco_pescador',
        dialog: ['"Las truchas y salmones saltan felices hoy. Que las aguas calmas guíen tu travesía, exploradora."'],
      },
      {
        id: 'deco_patos_pucon',
        x: 16,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'hualita',
        name: 'Pato Silvestre del Lago',
        sprite: 'deco_patos',
        dialog: ['¡Cuac cuac! Los patos silvestres del lago te desafían con ráfagas de agua.'],
      },
      {
        id: 'deco_ranita_pucon',
        x: 18,
        y: 10,
        type: 'wild_encounter',
        encounterSpiritId: 'puducito',
        name: 'Ranita de Darwin Mística',
        sprite: 'deco_ranita',
        dialog: ['¡Croac! La pequeña ranita de Darwin salta decidida a combatir.'],
      },
      {
        id: 'deco_copihue_pucon',
        x: 5,
        y: 12,
        type: 'wild_encounter',
        encounterSpiritId: 'brotin',
        name: 'Copihue Espiritual Nativo',
        sprite: 'deco_copihue',
        dialog: ['¡La flor sagrada del copihue despierta sus raíces florales para el combate!'],
      },

      // Stage Boss (Appears once stage missions are completed!)
      {
        id: 'boss_pucon',
        x: 12,
        y: 16,
        type: 'boss',
        name: 'Soberana del Caburgua (Hualita Mística)',
        sprite: 'boss_spirit',
        bossSpiritId: 'hualita',
        requiresMissionsCleared: true,
        dialog: [
          '¡Una majestuosa garza de agua turquesa despierta en el santuario lacustre purificado!',
          'Dama del Lago: "¿Eres tú la exploradora que traerá el equilibrio entre el agua y la brasa?"'
        ],
      },
      {
        id: 'portal_to_villarrica',
        x: 12,
        y: 19,
        type: 'portal',
        name: 'Ascenso a las laderas del Volcán Villarrica',
        sprite: 'portal_sign',
        destinationRegion: 'villarrica',
        destinationX: 12,
        destinationY: 1,
        dialog: ['¿Estás lista para adentrarte en el rugiente Volcán Villarrica?'],
      }
    ],
    wildEncounterTable: [
      { spiritId: 'hualita', minLevel: 2, maxLevel: 3, weight: 40 },
      { spiritId: 'puducito', minLevel: 2, maxLevel: 3, weight: 35 },
      { spiritId: 'chucao', minLevel: 2, maxLevel: 3, weight: 25 },
    ]
  },

  // -------------------------------------------------------------
  // REGION 3: VILLARRICA / RUKA PILLÁN (Expanded 26x20 with Magma Labyrinth)
  // -------------------------------------------------------------
  villarrica: {
    id: 'villarrica',
    name: 'Volcán Villarrica (Ruka Pillán)',
    subtitle: 'El Cráter de Fuego y las Cavernas Basálticas',
    lore: 'El volcán más activo de Sudamérica. Ríos de magma incandescente y columnas de humo tiñen el cielo. En lo profundo del cráter mora el antiguo espíritu Pillán.',
    width: 26,
    height: 20,
    themeColor: '#ef4444',
    ambientColor: 'rgba(239, 68, 68, 0.08)',
    weather: 'ceniza_volcanica',
    bgmId: 'villarrica',
    isUnlocked: false,
    tiles: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3],
      [3, 3, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 3, 3, 3, 3, 3],
      [3, 0, 0, 1, 1, 5, 5, 5, 1, 0, 0, 1, 1, 0, 0, 5, 5, 5, 1, 1, 0, 0, 0, 0, 0, 3], // Magma Labyrinth
      [3, 0, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 0, 0, 0, 3],
      [3, 0, 1, 0, 5, 5, 5, 5, 1, 0, 0, 1, 1, 0, 1, 5, 5, 5, 5, 0, 0, 1, 0, 0, 0, 3],
      [3, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 3],
      [3, 5, 5, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 5, 5, 0, 0, 1, 0, 3],
      [3, 5, 5, 1, 0, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 0, 1, 5, 5, 0, 0, 1, 0, 3],
      [3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 3],
      [3, 0, 0, 5, 5, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 5, 5, 0, 0, 1, 1, 1, 0, 3],
      [3, 3, 0, 5, 5, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 5, 5, 0, 0, 1, 0, 0, 3, 3],
      [3, 3, 3, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3],
      [3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 3, 3, 1, 1, 1, 3, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3], // Altar del Pillán
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
    entities: [
      {
        id: 'portal_back_pucon',
        x: 12,
        y: 0,
        type: 'portal',
        name: 'Descenso hacia los bosques de Pucón',
        sprite: 'portal_sign',
        destinationRegion: 'pucon',
        destinationX: 12,
        destinationY: 18,
        dialog: ['¿Quieres descender nuevamente hacia el verdor y las aguas calmas de Pucón?'],
      },
      {
        id: 'npc_minero_villarrica',
        x: 6,
        y: 3,
        type: 'npc',
        name: 'Nahuel (Herrero Volcánico)',
        sprite: 'npc_miner',
        dialog: [
          '¡El calor aquí dentro puede derretir hasta el hierro más templado!',
          'El Pillán está furioso porque la sombra intenta consumir su núcleo de fuego eterno.',
          'He cerrado el altar del cráter. Enfría la gran roca incandescente y recorre las cavernas de basalto para que el Titán despierte en su cámara.',
          'Toma estos Corazones de Basalto para potenciar a tus espíritus.'
        ],
        rewardItem: { id: 'corazon_basalto', count: 3 },
      },
      {
        id: 'chest_villarrica_1',
        x: 22,
        y: 4,
        type: 'chest',
        name: 'Cofre de Basalto Fundido',
        sprite: 'chest',
        rewardItem: { id: 'corazon_basalto', count: 3 },
        dialog: ['¡Obtuviste Corazones de Basalto! Esenciales para la evolución de fuego.'],
      },
      {
        id: 'obstacle_villarrica',
        x: 12,
        y: 10,
        type: 'obstacle',
        name: 'Roca Magmática Incandescente',
        sprite: 'obstacle_magma',
        elementRequired: 'agua',
        obstacleClearMessage: '¡El agua gélida enfrió la roca magmática, pulverizándola!',
        dialog: ['Una roca al rojo vivo bloquea el camino central. Necesitas un espíritu de AGUA o HIELO para enfriarla.'],
      },

      // Visible Roaming Wild Spirits
      {
        id: 'wild_villarrica_1',
        x: 6,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'pillancito',
        name: 'Pillancito Ígneo',
        sprite: 'wild_pillancito',
      },
      {
        id: 'wild_villarrica_2',
        x: 19,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'puducito',
        name: 'Puducito de Montaña',
        sprite: 'wild_pudu',
      },
      {
        id: 'wild_villarrica_3',
        x: 7,
        y: 13,
        type: 'wild_encounter',
        encounterSpiritId: 'pillancito',
        name: 'Chispa Magmática',
        sprite: 'wild_pillancito',
      },
      {
        id: 'wild_villarrica_4',
        x: 19,
        y: 13,
        type: 'wild_encounter',
        encounterSpiritId: 'brotin',
        name: 'Brotín Resistente',
        sprite: 'wild_brotin',
      },

      // Decorative Characters
      {
        id: 'deco_salamandra_villarrica',
        x: 8,
        y: 8,
        type: 'wild_encounter',
        encounterSpiritId: 'pillancito',
        name: 'Salamandra de Basalto Ígnea',
        sprite: 'deco_salamandra',
        dialog: ['¡Fsssh! La salamandra de magma lanza chispas ardientes y te desafía.'],
      },
      {
        id: 'deco_fumarola_villarrica',
        x: 17,
        y: 8,
        type: 'decorative',
        name: 'Fumarola Volcánica Activa',
        sprite: 'deco_fumarola',
        dialog: ['Una chimenea natural del cráter exhala vapores sulfurosos y ceniza cálida con un suave rumor sordo.'],
      },

      // Stage Boss (Appears once stage missions are completed!)
      {
        id: 'boss_villarrica',
        x: 12,
        y: 16,
        type: 'boss',
        name: 'Pillán del Fuego Eterno (Señor del Magma)',
        sprite: 'boss_spirit',
        bossSpiritId: 'pillancito',
        requiresMissionsCleared: true,
        dialog: [
          '¡El Titán del cráter surge rugiendo en el santuario de magma liberado!',
          'Pillán: "¡Nadie perturba el sueño del Ruka Pillán sin probar el fuego sagrado de la tierra!"'
        ],
      },
      {
        id: 'portal_to_hornopiren',
        x: 12,
        y: 19,
        type: 'portal',
        name: 'Expedición Austral hacia Hornopirén',
        sprite: 'portal_sign',
        destinationRegion: 'hornopiren',
        destinationX: 12,
        destinationY: 1,
        dialog: ['¿Deseas zarpar hacia los fiordos y bosques milenarios de la Carretera Austral en Hornopirén?'],
      }
    ],
    wildEncounterTable: [
      { spiritId: 'pillancito', minLevel: 3, maxLevel: 4, weight: 50 },
      { spiritId: 'puducito', minLevel: 3, maxLevel: 4, weight: 30 },
      { spiritId: 'brotin', minLevel: 3, maxLevel: 4, weight: 20 },
    ]
  },

  // -------------------------------------------------------------
  // REGION 4: CARRETERA AUSTRAL / HORNOPIRÉN (Expanded 26x20 with Glacial Labyrinth)
  // -------------------------------------------------------------
  hornopiren: {
    id: 'hornopiren',
    name: 'Carretera Austral & Fiordos de Hornopirén',
    subtitle: 'Alerces Milenarios, Glaciares y la Sagrada Naturaleza Primigenia',
    lore: 'Donde la tierra se fragmenta en fiordos y los ventisqueros cuelgan sobre las selvas de Alerces de más de 3.000 años. Aquí yace el Santuario del Corazón Austral donde se decidirá el destino del mundo.',
    width: 26,
    height: 20,
    themeColor: '#06b6d4',
    ambientColor: 'rgba(6, 182, 212, 0.08)',
    weather: 'ventisca_austral',
    bgmId: 'hornopiren',
    isUnlocked: false,
    tiles: [
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 6, 6, 0, 4, 4, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 4, 4, 0, 6, 6, 6, 0, 0, 0, 3],
      [3, 6, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 6, 0, 1, 1, 0, 3],
      [3, 0, 7, 1, 1, 2, 2, 2, 1, 0, 0, 1, 1, 0, 0, 2, 2, 2, 1, 1, 7, 0, 1, 7, 0, 3], // Fiordos & glaciares
      [3, 0, 1, 1, 6, 6, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 6, 6, 1, 1, 1, 1, 0, 0, 3],
      [3, 4, 1, 0, 6, 6, 2, 2, 1, 0, 0, 1, 1, 0, 1, 2, 2, 6, 6, 0, 0, 1, 4, 0, 0, 3],
      [3, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 0, 3],
      [3, 6, 6, 4, 4, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 7, 0, 0, 4, 4, 6, 6, 0, 0, 0, 3],
      [3, 6, 6, 4, 4, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 7, 0, 0, 4, 4, 6, 6, 0, 0, 0, 3],
      [3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 6, 6, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 6, 6, 0, 0, 1, 1, 1, 0, 3],
      [3, 4, 0, 6, 6, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 6, 6, 0, 4, 1, 0, 0, 0, 3],
      [3, 4, 4, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 4, 4, 1, 0, 0, 3, 3],
      [3, 4, 4, 4, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 4, 4, 4, 1, 1, 1, 3, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3], // Gran Altar Glacial
      [3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    ],
    entities: [
      {
        id: 'portal_back_villarrica',
        x: 12,
        y: 0,
        type: 'portal',
        name: 'Regreso a las faldas del Volcán Villarrica',
        sprite: 'portal_sign',
        destinationRegion: 'villarrica',
        destinationX: 12,
        destinationY: 18,
        dialog: ['¿Quieres regresar a las cavernas de magma del Volcán Villarrica?'],
      },
      {
        id: 'npc_alercero',
        x: 7,
        y: 3,
        type: 'npc',
        name: 'Don Checho (Guardián del Alerce)',
        sprite: 'npc_explorer',
        dialog: [
          '¡Llegaste a Hornopirén, la puerta de entrada a la Patagonia más pura!',
          'Estos árboles que ves tienen más de tres mil años. Han presenciado eras enteras.',
          'El Santuario del Corazón Austral está sellado por el hielo eterno. Funde el muro glaciar con el fuego del Pillán para que el Coloso despierte.',
          'Toma esta infusión de calafate: te dará fuerza para la batalla final.'
        ],
        rewardItem: { id: 'infusion_calafate', count: 4 },
        rewardGold: 500,
      },
      {
        id: 'chest_hornopiren_1',
        x: 22,
        y: 3,
        type: 'chest',
        name: 'Relicario del Alerce Milenario',
        sprite: 'chest',
        rewardItem: { id: 'cristal_hielo', count: 4 },
        dialog: ['¡Obtuviste Cristales de Hielo Azul de Hornopirén! Para evolucionar a tus espíritus australes.'],
      },
      {
        id: 'obstacle_hornopiren',
        x: 12,
        y: 9,
        type: 'obstacle',
        name: 'Muro Glaciar Milenario',
        sprite: 'obstacle_ice',
        elementRequired: 'fuego',
        obstacleClearMessage: '¡El calor de tu fuego fundió el muro glacial abriendo el Santuario!',
        dialog: ['Un muro de hielo azul milenario bloquea el santuario. Necesitas un espíritu de FUEGO de alto poder para fundirlo.'],
      },

      // Visible Roaming Wild Spirits
      {
        id: 'wild_hornopiren_1',
        x: 5,
        y: 6,
        type: 'wild_encounter',
        encounterSpiritId: 'ventisquero',
        name: 'Ventisquero Glacial',
        sprite: 'wild_ventisquero',
      },
      {
        id: 'wild_hornopiren_2',
        x: 20,
        y: 7,
        type: 'wild_encounter',
        encounterSpiritId: 'brotin',
        name: 'Brotín Patagónico',
        sprite: 'wild_brotin',
      },
      {
        id: 'wild_hornopiren_3',
        x: 6,
        y: 13,
        type: 'wild_encounter',
        encounterSpiritId: 'ventisquero',
        name: 'Ventisquero de Fiordo',
        sprite: 'wild_ventisquero',
      },
      {
        id: 'wild_hornopiren_4',
        x: 19,
        y: 13,
        type: 'wild_encounter',
        encounterSpiritId: 'chucao',
        name: 'Chucao Austral',
        sprite: 'wild_chucao',
      },

      // Decorative Wildlife & Ancient Flora
      {
        id: 'deco_huillin_hornopiren',
        x: 8,
        y: 6,
        type: 'wild_encounter',
        encounterSpiritId: 'hualita',
        name: 'Huillín del Fiordo Austral',
        sprite: 'deco_huillin',
        dialog: ['¡Chii! El ágil huillín emerge del agua prístina listo para combatir.'],
      },
      {
        id: 'deco_pinguino_hornopiren',
        x: 3,
        y: 9,
        type: 'wild_encounter',
        encounterSpiritId: 'ventisquero',
        name: 'Pingüino Patagónico Austral',
        sprite: 'deco_pinguino',
        dialog: ['¡Honk! El pingüino patagónico sacude sus alas heladas y te reta en duelo.'],
      },
      {
        id: 'deco_alerce_hornopiren',
        x: 18,
        y: 8,
        type: 'decorative',
        name: 'Alerce Tricentenario Sagrado',
        sprite: 'deco_alerce',
        dialog: ['Un monumental alerce de corteza rojiza susurra con el viento patagónico, irradiando una paz milenaria.'],
      },

      // Final Boss (Appears once stage missions are completed!)
      {
        id: 'boss_hornopiren',
        x: 12,
        y: 16,
        type: 'boss',
        name: 'Coloso de Hornopirén & Ceniza Umbría (Jefe Final)',
        sprite: 'boss_spirit',
        bossSpiritId: 'ventisquero',
        requiresMissionsCleared: true,
        dialog: [
          '¡El gran espíritu de los glaciares yace liberado en el corazón del santuario!',
          'Bárbara: "¡Por la tierra, el agua, el viento y el fuego de Chile, voy a purificarte y restaurar el corazón de la naturaleza!"'
        ],
      }
    ],
    wildEncounterTable: [
      { spiritId: 'ventisquero', minLevel: 4, maxLevel: 5, weight: 45 },
      { spiritId: 'brotin', minLevel: 4, maxLevel: 5, weight: 30 },
      { spiritId: 'chucao', minLevel: 4, maxLevel: 5, weight: 25 },
    ]
  }
};
