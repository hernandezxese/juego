/**
 * Procedural Pixel & Sprite Renderer
 * Generates high-fidelity retro JRPG sprites for Barbara, Chilean nature spirits, and tiles
 */

// Draw Barbara sprite in 4 directions with fluid walk animation
export function drawBarbaraSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: 'down' | 'up' | 'left' | 'right' = 'down',
  walkProgress: number = 0, // continuous float for fluid animation
  isMoving: boolean = false
) {
  const pixel = size / 16;
  
  // Fluid vertical bobbing
  const bob = isMoving 
    ? Math.abs(Math.sin(walkProgress * Math.PI)) * (pixel * 1.2)
    : Math.sin(walkProgress * 2) * (pixel * 0.4); // Gentle idle breathing

  ctx.save();
  ctx.translate(x, y - bob);

  // Soft shadow under character
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.beginPath();
  ctx.ellipse(size / 2, size - pixel * 0.5, pixel * 5, pixel * 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking cycle calculations: smooth sinusoidal swing
  const legSwing = isMoving ? Math.sin(walkProgress * Math.PI * 2) * (pixel * 2.5) : 0;
  const armSwing = isMoving ? Math.sin(walkProgress * Math.PI * 2) * (pixel * 2) : 0;

  // 1. LEGS & BOOTS (Dark leather boots)
  ctx.fillStyle = '#451a03';
  if (direction === 'down' || direction === 'up') {
    // Left boot
    ctx.fillRect(size / 2 - pixel * 4, size - pixel * 3 + legSwing, pixel * 3, pixel * 3);
    // Right boot
    ctx.fillRect(size / 2 + pixel * 1, size - pixel * 3 - legSwing, pixel * 3, pixel * 3);
  } else {
    // Side profile walking legs
    ctx.fillRect(size / 2 - pixel * 2 - legSwing, size - pixel * 3, pixel * 3.5, pixel * 3);
    ctx.fillRect(size / 2 - pixel * 2 + legSwing, size - pixel * 3, pixel * 3.5, pixel * 3);
  }

  // 2. PANTS (Explorer Khaki)
  ctx.fillStyle = '#78350f';
  ctx.fillRect(size / 2 - pixel * 3.5, size - pixel * 5.5, pixel * 7, pixel * 3);

  // 3. BACKPACK (Visible from back, side, and angle)
  if (direction === 'up' || direction === 'left' || direction === 'right') {
    ctx.fillStyle = '#92400e'; // Leather backpack
    const backpackX = direction === 'left' ? size / 2 + pixel * 1.5 : direction === 'right' ? size / 2 - pixel * 5.5 : size / 2 - pixel * 4;
    ctx.fillRect(backpackX, size - pixel * 11, pixel * 5, pixel * 6);
    ctx.fillStyle = '#f59e0b'; // Gold buckles
    ctx.fillRect(backpackX + pixel, size - pixel * 9, pixel * 3, pixel);
  }

  // 4. CHILEAN PONCHO / MANTO DE EXPLORADORA (Emerald with Andean geometric stripe)
  ctx.fillStyle = '#059669'; // Emerald poncho
  ctx.fillRect(size / 2 - pixel * 5, size - pixel * 10.5, pixel * 10, pixel * 5.5);

  // Andean patterned stripe across poncho (sways gently when moving)
  const ponchoSway = isMoving ? Math.sin(walkProgress * Math.PI * 2) * (pixel * 0.8) : 0;
  ctx.fillStyle = '#f59e0b'; // Amber yellow
  ctx.fillRect(size / 2 - pixel * 5 + ponchoSway, size - pixel * 8, pixel * 10, pixel * 1.5);
  ctx.fillStyle = '#dc2626'; // Red Andean motifs
  for (let i = -4; i <= 3; i += 2) {
    ctx.fillRect(size / 2 + pixel * i + ponchoSway, size - pixel * 8, pixel, pixel * 1.5);
  }

  // 5. HEAD & FACE
  ctx.fillStyle = '#fed7aa'; // Skin tone
  ctx.fillRect(size / 2 - pixel * 3.5, size - pixel * 14.5, pixel * 7, pixel * 4.5);

  // 6. HAIR (Dark wavy brown)
  ctx.fillStyle = '#291e13';
  ctx.fillRect(size / 2 - pixel * 4.5, size - pixel * 16, pixel * 9, pixel * 3.5);
  ctx.fillRect(size / 2 - pixel * 4.5, size - pixel * 14, pixel * 2, pixel * 5.5);
  ctx.fillRect(size / 2 + pixel * 2.5, size - pixel * 14, pixel * 2, pixel * 5.5);

  // Face details depending on direction
  if (direction === 'down') {
    // Eyes with lively shine
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(size / 2 - pixel * 2.5, size - pixel * 12.5, pixel * 1.5, pixel * 1.8);
    ctx.fillRect(size / 2 + pixel * 1, size - pixel * 12.5, pixel * 1.5, pixel * 1.8);
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size / 2 - pixel * 2.5, size - pixel * 12.5, pixel * 0.8, pixel * 0.8);
    ctx.fillRect(size / 2 + pixel * 1, size - pixel * 12.5, pixel * 0.8, pixel * 0.8);
    // Rosy cheeks
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(size / 2 - pixel * 3, size - pixel * 10.8, pixel * 1.2, pixel * 0.8);
    ctx.fillRect(size / 2 + pixel * 1.8, size - pixel * 10.8, pixel * 1.2, pixel * 0.8);
  } else if (direction === 'left') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(size / 2 - pixel * 3, size - pixel * 12.5, pixel * 1.5, pixel * 1.8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size / 2 - pixel * 3, size - pixel * 12.5, pixel * 0.8, pixel * 0.8);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(size / 2 - pixel * 3, size - pixel * 10.8, pixel * 1.2, pixel * 0.8);
  } else if (direction === 'right') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(size / 2 + pixel * 1.5, size - pixel * 12.5, pixel * 1.5, pixel * 1.8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size / 2 + pixel * 1.5, size - pixel * 12.5, pixel * 0.8, pixel * 0.8);
    ctx.fillStyle = '#fda4af';
    ctx.fillRect(size / 2 + pixel * 1.5, size - pixel * 10.8, pixel * 1.2, pixel * 0.8);
  }

  // 7. EXPLORER HAT (Boina Patagónica with sacred Pewén feather)
  ctx.fillStyle = '#1e293b'; // Navy/dark slate hat
  ctx.fillRect(size / 2 - pixel * 5, size - pixel * 16.5, pixel * 10, pixel * 2);
  ctx.fillRect(size / 2 - pixel * 3.5, size - pixel * 18, pixel * 7, pixel * 2);

  // Pewén Sacred Feather in hat (gently flutters)
  const featherFlutter = isMoving ? Math.sin(walkProgress * Math.PI * 4) * (pixel * 0.5) : 0;
  ctx.fillStyle = '#10b981';
  ctx.fillRect(size / 2 + pixel * 2 + featherFlutter, size - pixel * 20, pixel * 1.2, pixel * 2.8);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(size / 2 + pixel * 2.2 + featherFlutter, size - pixel * 20.8, pixel * 0.8, pixel * 1.2);

  ctx.restore();
}

// Draw Spirit Creature in Canvas / Battle / Overworld
export function drawCreatureSprite(
  ctx: CanvasRenderingContext2D,
  baseId: string,
  stage: number,
  x: number,
  y: number,
  size: number,
  animatedTime: number = 0,
  isFlipped: boolean = false
) {
  const pixel = size / 18;
  const floatY = Math.sin(animatedTime * 3) * (pixel * 1.2);

  ctx.save();
  ctx.translate(x + size / 2, y + size / 2 + floatY);
  if (isFlipped) ctx.scale(-1, 1);
  ctx.translate(-size / 2, -size / 2);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.ellipse(size / 2, size - pixel * 1.5, pixel * 6, pixel * 2.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rendering distinct creatures
  if (baseId === 'brotin') {
    if (stage === 1) {
      // Small sprouting seed creature
      ctx.fillStyle = '#78350f'; // Acorn / Piñón body
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 + pixel * 2, pixel * 5, 0, Math.PI * 2);
      ctx.fill();

      // Golden belly
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 + pixel * 3, pixel * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Green Pewén sprout on top
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(size / 2 - pixel * 1.2, size / 2 - pixel * 5, pixel * 2.4, pixel * 4);
      ctx.beginPath();
      ctx.ellipse(size / 2 - pixel * 3, size / 2 - pixel * 4, pixel * 3, pixel * 1.5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(size / 2 + pixel * 3, size / 2 - pixel * 4, pixel * 3, pixel * 1.5, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Big cute eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(size / 2 - pixel * 3, size / 2 + pixel, pixel * 1.8, pixel * 2.5);
      ctx.fillRect(size / 2 + pixel * 1.2, size / 2 + pixel, pixel * 1.8, pixel * 2.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size / 2 - pixel * 2.8, size / 2 + pixel * 1.2, pixel * 0.9, pixel * 0.9);
      ctx.fillRect(size / 2 + pixel * 1.4, size / 2 + pixel * 1.2, pixel * 0.9, pixel * 0.9);
    } else if (stage === 2) {
      // Pehuén Guardián
      ctx.fillStyle = '#451a03'; // Heavy wood trunk
      ctx.fillRect(size / 2 - pixel * 5, size / 2 - pixel * 2, pixel * 10, pixel * 9);

      // Wooden arms
      ctx.fillStyle = '#78350f';
      ctx.fillRect(size / 2 - pixel * 7, size / 2, pixel * 3, pixel * 6);
      ctx.fillRect(size / 2 + pixel * 4, size / 2, pixel * 3, pixel * 6);

      // Geometric Araucaria branch foliage
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2 - pixel * 8);
      ctx.lineTo(size / 2 + pixel * 8, size / 2 - pixel * 2);
      ctx.lineTo(size / 2 - pixel * 8, size / 2 - pixel * 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2 - pixel * 6);
      ctx.lineTo(size / 2 + pixel * 6, size / 2);
      ctx.lineTo(size / 2 - pixel * 6, size / 2);
      ctx.closePath();
      ctx.fill();

      // Glowing green eyes
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(size / 2 - pixel * 3, size / 2 + pixel * 2, pixel * 2, pixel * 2);
      ctx.fillRect(size / 2 + pixel * 1, size / 2 + pixel * 2, pixel * 2, pixel * 2);
    } else {
      // Araucaria Ancestral Titán
      // Massive ancient sacred tree titan with glowing runes
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(size / 2 - pixel * 6, size / 2 - pixel * 3, pixel * 12, pixel * 11);

      // Multi-tier canopy
      const levels = [
        { y: -8, w: 9, c: '#14532d' },
        { y: -5, w: 8, c: '#16a34a' },
        { y: -2, w: 7, c: '#22c55e' }
      ];
      levels.forEach(lvl => {
        ctx.fillStyle = lvl.c;
        ctx.beginPath();
        ctx.moveTo(size / 2, size / 2 + pixel * (lvl.y - 4));
        ctx.lineTo(size / 2 + pixel * lvl.w, size / 2 + pixel * lvl.y);
        ctx.lineTo(size / 2 - pixel * lvl.w, size / 2 + pixel * lvl.y);
        ctx.closePath();
        ctx.fill();
      });

      // Sacred glowing runes
      ctx.fillStyle = '#facc15';
      ctx.fillRect(size / 2 - pixel * 2, size / 2 + pixel * 2, pixel * 4, pixel);
      ctx.fillRect(size / 2 - pixel * 0.5, size / 2 + pixel, pixel, pixel * 4);
    }

  } else if (baseId === 'pillancito') {
    // Fire spirit
    const magmaGlow = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, pixel * 8);
    magmaGlow.addColorStop(0, '#fef08a');
    magmaGlow.addColorStop(0.5, '#f97316');
    magmaGlow.addColorStop(1, '#dc2626');

    if (stage === 1) {
      // Cute magma spark
      ctx.fillStyle = magmaGlow;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 + pixel, pixel * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Flame hair dancing
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(size / 2 - pixel * 3, size / 2 - pixel * 2);
      ctx.lineTo(size / 2, size / 2 - pixel * 6 - floatY);
      ctx.lineTo(size / 2 + pixel * 3, size / 2 - pixel * 2);
      ctx.closePath();
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(size / 2 - pixel * 2.5, size / 2, pixel * 1.5, pixel * 2);
      ctx.fillRect(size / 2 + pixel * 1, size / 2, pixel * 1.5, pixel * 2);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(size / 2 - pixel * 2.2, size / 2 + pixel * 0.2, pixel * 0.8, pixel * 0.8);
      ctx.fillRect(size / 2 + pixel * 1.3, size / 2 + pixel * 0.2, pixel * 0.8, pixel * 0.8);
    } else if (stage === 2) {
      // Salamandra Ígnea
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(size / 2 - pixel * 6, size / 2 - pixel, pixel * 12, pixel * 7);

      // Magma scales
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(size / 2 - pixel * 4, size / 2, pixel * 8, pixel * 4);

      // Tail with flaming tip
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(size / 2 + pixel * 6, size / 2 + pixel * 2, pixel * 3, pixel * 3);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(size / 2 + pixel * 8, size / 2 + pixel, pixel * 2, pixel * 2);

      // Head & Eyes
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(size / 2 - pixel * 7, size / 2 - pixel * 3, pixel * 5, pixel * 5);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(size / 2 - pixel * 6, size / 2 - pixel * 2, pixel * 1.8, pixel * 1.8);
    } else {
      // Pillán del Fuego Eterno (Volcano Titan)
      ctx.fillStyle = '#292524'; // Obsidian rock body
      ctx.fillRect(size / 2 - pixel * 7, size / 2 - pixel * 4, pixel * 14, pixel * 11);

      // Glowing lava fissures
      ctx.fillStyle = '#f97316';
      ctx.fillRect(size / 2 - pixel * 5, size / 2, pixel * 10, pixel * 1.5);
      ctx.fillRect(size / 2 - pixel, size / 2 - pixel * 3, pixel * 2, pixel * 8);

      // Giant crown of volcanic fire
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(size / 2 - pixel * 6, size / 2 - pixel * 4);
      ctx.lineTo(size / 2, size / 2 - pixel * 9);
      ctx.lineTo(size / 2 + pixel * 6, size / 2 - pixel * 4);
      ctx.closePath();
      ctx.fill();

      // Blazing red eyes
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(size / 2 - pixel * 4, size / 2 - pixel * 2, pixel * 2.5, pixel * 2);
      ctx.fillRect(size / 2 + pixel * 1.5, size / 2 - pixel * 2, pixel * 2.5, pixel * 2);
    }

  } else if (baseId === 'hualita') {
    // Water spirit
    const waterGlow = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, pixel * 7);
    waterGlow.addColorStop(0, '#e0f2fe');
    waterGlow.addColorStop(0.6, '#38bdf8');
    waterGlow.addColorStop(1, '#0284c7');

    if (stage === 1) {
      // Floating water drop
      ctx.fillStyle = waterGlow;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 + pixel, pixel * 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(size / 2 - pixel * 3, size / 2);
      ctx.lineTo(size / 2, size / 2 - pixel * 5);
      ctx.lineTo(size / 2 + pixel * 3, size / 2);
      ctx.closePath();
      ctx.fill();

      // Soft blue eyes
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(size / 2 - pixel * 2.5, size / 2, pixel * 1.5, pixel * 2);
      ctx.fillRect(size / 2 + pixel * 1, size / 2, pixel * 1.5, pixel * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(size / 2 - pixel * 2.2, size / 2 + pixel * 0.2, pixel * 0.8, pixel * 0.8);
      ctx.fillRect(size / 2 + pixel * 1.3, size / 2 + pixel * 0.2, pixel * 0.8, pixel * 0.8);
    } else if (stage === 2) {
      // Garza de Caburgua (Water Bird)
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.ellipse(size / 2, size / 2 + pixel, pixel * 5, pixel * 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Elegant neck & head
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(size / 2 - pixel * 2, size / 2 - pixel * 5, pixel * 2.5, pixel * 6);
      ctx.beginPath();
      ctx.arc(size / 2 - pixel, size / 2 - pixel * 5, pixel * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Yellow beak
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(size / 2 - pixel * 5, size / 2 - pixel * 5.5, pixel * 3.5, pixel * 1.5);
    } else {
      // Dama de los Lagos Sagrados (Majestic Water Empress)
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(size / 2 - pixel * 6, size / 2 - pixel * 2, pixel * 12, pixel * 9);

      // Water dress swirl
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2 + pixel * 3, pixel * 6, 0, Math.PI * 2);
      ctx.fill();

      // Crown of water crystals
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(size / 2 - pixel * 4, size / 2 - pixel * 7, pixel * 8, pixel * 3);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(size / 2 - pixel * 1.5, size / 2 - pixel * 9, pixel * 3, pixel * 4);
    }

  } else if (baseId === 'ventisquero') {
    // Ice / Glacial colossus
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(size / 2 - pixel * 6, size / 2 - pixel * 4, pixel * 12, pixel * 10);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(size / 2 - pixel * 4, size / 2 - pixel * 2, pixel * 8, pixel * 6);

    // Glowing cyan runes
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(size / 2 - pixel * 3, size / 2 - pixel * 1, pixel * 2, pixel * 2);
    ctx.fillRect(size / 2 + pixel * 1, size / 2 - pixel * 1, pixel * 2, pixel * 2);

  } else {
    // Default creature / Puducito / Chucao
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2 + pixel, pixel * 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2 + pixel * 2, pixel * 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(size / 2 - pixel * 2.5, size / 2, pixel * 1.5, pixel * 2);
    ctx.fillRect(size / 2 + pixel * 1, size / 2, pixel * 1.5, pixel * 2);
  }

  ctx.restore();
}

// Draw Overworld interactive entities (Chests, NPCs, Obstacles, Portals, Roaming Spirits, Bosses)
export function drawEntitySprite(
  ctx: CanvasRenderingContext2D,
  type: string,
  sprite: string,
  x: number,
  y: number,
  size: number,
  cleared: boolean = false,
  stepFrame: number = 0,
  isBossAwakened: boolean = true
) {
  const pixel = size / 16;

  if (cleared) return;

  // VISIBLE ROAMING WILD SPIRITS
  if (type === 'wild_encounter' || sprite.startsWith('wild_')) {
    // Extract spirit base id from sprite, e.g. 'wild_brotin' -> 'brotin'
    const spiritId = sprite.replace('wild_', '');
    const bob = Math.sin(stepFrame * 0.35) * pixel * 1.5;

    // Soft aura underneath
    const aura = ctx.createRadialGradient(x + size / 2, y + size / 2, 2, x + size / 2, y + size / 2, size / 2);
    aura.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Render creature sprite centered
    ctx.save();
    ctx.translate(x, y + bob);
    drawCreatureSprite(ctx, spiritId, 1, 0, 0, size, stepFrame * 0.1, false);
    ctx.restore();

    // Little pulsing encounter alert "!" above head
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + size / 2 - pixel * 0.75, y - pixel * 2 + bob * 0.5, pixel * 1.5, pixel * 2.5);
    ctx.fillRect(x + size / 2 - pixel * 0.75, y + pixel * 1.5 + bob * 0.5, pixel * 1.5, pixel * 1.5);
    return;
  }

  if (type === 'chest') {
    // Wooden treasure chest with gold banding
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + pixel * 2, y + pixel * 5, pixel * 12, pixel * 9);
    // Lid
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x + pixel * 1, y + pixel * 2, pixel * 14, pixel * 4);
    // Gold clasp & band
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + pixel * 6.5, y + pixel * 5, pixel * 3, pixel * 3.5);
    ctx.fillRect(x + pixel * 2, y + pixel * 4, pixel * 12, pixel * 1.5);
    return;
  }

  if (type === 'npc') {
    // Friendly NPC with hat/cloak
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + pixel * 3, y + pixel * 5, pixel * 10, pixel * 9);
    // Face
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + pixel * 4, y + pixel * 2, pixel * 8, pixel * 4);
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + pixel * 5, y + pixel * 3.5, pixel * 1.5, pixel * 1.5);
    ctx.fillRect(x + pixel * 9, y + pixel * 3.5, pixel * 1.5, pixel * 1.5);
    // Hat
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(x + pixel * 2, y + pixel * 1, pixel * 12, pixel * 2);
    return;
  }

  if (type === 'boss') {
    if (!isBossAwakened) {
      // DORMANT SEALED ALTAR / ANCIENT RUNIC MONOLITH
      // Runestone pillar
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + pixel * 3, y + pixel * 2, pixel * 10, pixel * 12);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + pixel * 2, y + pixel * 12, pixel * 12, pixel * 3);
      
      // Ancient glowing seal lock
      const glow = Math.sin(stepFrame * 0.15) * 0.2 + 0.4;
      ctx.fillStyle = `rgba(147, 51, 234, ${glow})`;
      ctx.fillRect(x + pixel * 5, y + pixel * 4, pixel * 6, pixel * 7);

      // Lock icon
      ctx.fillStyle = '#e9d5ff';
      ctx.fillRect(x + pixel * 6.5, y + pixel * 6, pixel * 3, pixel * 3);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = pixel;
      ctx.strokeRect(x + pixel * 7, y + pixel * 4.5, pixel * 2, pixel * 2);

      // Dormant floating rune
      ctx.fillStyle = '#a855f7';
      ctx.font = `bold ${Math.max(8, pixel * 3.5)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('🔒', x + size / 2, y - pixel);
      return;
    }

    // Highly explicit, imposing elemental Boss Titan (Awakened!)
    // Highly explicit, imposing elemental Boss Titan
    const pulse = Math.sin(stepFrame * 0.25) * pixel * 2.5;
    
    // Pulsing dark-red danger ground aura
    const bossGlow = ctx.createRadialGradient(x + size / 2, y + size / 2, pixel * 2, x + size / 2, y + size / 2, size / 1.4 + pulse);
    bossGlow.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
    bossGlow.addColorStop(0.6, 'rgba(185, 28, 28, 0.3)');
    bossGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bossGlow;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 1.4 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Dark titan armored body
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + pixel * 3, y + pixel * 5, pixel * 10, pixel * 9);

    // Glowing magma / corrupted energy core
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + pixel * 5, y + pixel * 7, pixel * 6, pixel * 5);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x + pixel * 6, y + pixel * 8, pixel * 4, pixel * 3);

    // Menacing horns / crown
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(x + pixel * 2, y + pixel * 1);
    ctx.lineTo(x + pixel * 5, y + pixel * 5);
    ctx.lineTo(x + pixel * 4, y + pixel * 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + pixel * 14, y + pixel * 1);
    ctx.lineTo(x + pixel * 11, y + pixel * 5);
    ctx.lineTo(x + pixel * 12, y + pixel * 5);
    ctx.closePath();
    ctx.fill();

    // Piercing glowing yellow eyes
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + pixel * 5, y + pixel * 4, pixel * 2, pixel * 1.5);
    ctx.fillRect(x + pixel * 9, y + pixel * 4, pixel * 2, pixel * 1.5);

    // Sharp claws
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(x + pixel * 1, y + pixel * 10, pixel * 2, pixel * 4);
    ctx.fillRect(x + pixel * 13, y + pixel * 10, pixel * 2, pixel * 4);
    return;
  }

  if (type === 'portal') {
    // Wooden signpost or stone arch
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + pixel * 6, y + pixel * 7, pixel * 4, pixel * 8);
    // Board
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + pixel * 1, y + pixel * 2, pixel * 14, pixel * 6);
    // Sign writing
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x + pixel * 3, y + pixel * 4, pixel * 10, pixel * 2);
    return;
  }

  if (type === 'obstacle') {
    // Environmental obstacle (Bush, Rock, Ice)
    if (sprite.includes('bush')) {
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626'; // Red thorns
      ctx.fillRect(x + pixel * 4, y + pixel * 6, pixel * 2, pixel * 2);
      ctx.fillRect(x + pixel * 10, y + pixel * 9, pixel * 2, pixel * 2);
    } else if (sprite.includes('magma')) {
      ctx.fillStyle = '#44403c';
      ctx.fillRect(x + pixel * 2, y + pixel * 3, pixel * 12, pixel * 10);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + pixel * 4, y + pixel * 5, pixel * 8, pixel * 4);
    } else if (sprite.includes('ice')) {
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(x + pixel * 2, y + pixel * 2, pixel * 12, pixel * 12);
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(x + pixel * 4, y + pixel * 4, pixel * 8, pixel * 8);
    } else {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(x + pixel * 2, y + pixel * 4, pixel * 12, pixel * 8);
    }
    return;
  }

  // DECORATIVE CHARACTERS & WILDLIFE ANIMATIONS
  if (type === 'decorative' || sprite.startsWith('deco_')) {
    if (sprite.includes('quiltro')) {
      // Chilean Quiltro dog with animated wagging tail
      const tailWag = Math.sin(stepFrame * 1.2) * pixel * 2;
      ctx.fillStyle = '#b45309'; // Golden-brown fur
      // Body
      ctx.fillRect(x + pixel * 3, y + pixel * 6, pixel * 9, pixel * 6);
      // Head
      ctx.fillRect(x + pixel * 9, y + pixel * 3, pixel * 5, pixel * 5);
      // Floppy ear
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + pixel * 10, y + pixel * 3, pixel * 2, pixel * 4);
      // Eyes & Snout
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + pixel * 12, y + pixel * 4, pixel * 1.2, pixel * 1.2);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(x + pixel * 13, y + pixel * 6, pixel * 1.5, pixel * 1.5);
      // Wagging tail
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x + pixel * 1, y + pixel * 5 + tailWag, pixel * 2.5, pixel * 2);
      // Paws
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + pixel * 4, y + pixel * 12, pixel * 2, pixel * 3);
      ctx.fillRect(x + pixel * 9, y + pixel * 12, pixel * 2, pixel * 3);

    } else if (sprite.includes('palomas')) {
      // Urban pigeons pecking seeds
      const peck = Math.abs(Math.sin(stepFrame * 0.8)) * pixel * 1.5;
      ctx.fillStyle = '#64748b'; // Slate feathers
      ctx.beginPath();
      ctx.ellipse(x + pixel * 6, y + pixel * 10, pixel * 3.5, pixel * 2.2, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Head pecking down
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(x + pixel * 9, y + pixel * 8 + peck, pixel * 1.8, 0, Math.PI * 2);
      ctx.fill();
      // Orange beak
      ctx.fillStyle = '#f97316';
      ctx.fillRect(x + pixel * 10.5, y + pixel * 8.5 + peck, pixel * 1.2, pixel);
      // Second pigeon
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.ellipse(x + pixel * 12, y + pixel * 12, pixel * 3, pixel * 2, 0.2, 0, Math.PI * 2);
      ctx.fill();

    } else if (sprite.includes('pescador')) {
      // Fisherman with fishing rod by lakeside
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(x + pixel * 4, y + pixel * 7, pixel * 7, pixel * 7);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(x + pixel * 5, y + pixel * 3, pixel * 5, pixel * 4);
      ctx.fillStyle = '#eab308'; // Straw hat
      ctx.fillRect(x + pixel * 3, y + pixel * 2, pixel * 9, pixel * 2);
      // Fishing rod extending over water
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + pixel * 10, y + pixel * 7);
      ctx.lineTo(x + pixel * 16, y - pixel * 2);
      ctx.stroke();
      // Fishing line with bobber
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.moveTo(x + pixel * 16, y - pixel * 2);
      ctx.lineTo(x + pixel * 16, y + pixel * 10);
      ctx.stroke();
      ctx.fillStyle = '#ef4444'; // Red bobber
      ctx.fillRect(x + pixel * 15.5, y + pixel * 9, pixel * 1.5, pixel * 1.5);

    } else if (sprite.includes('patos')) {
      // Wild ducks swimming on water with ripple
      const ripple = (stepFrame % 20) * pixel * 0.4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeRect(x + pixel * 2 - ripple / 2, y + pixel * 8 - ripple / 2, pixel * 10 + ripple, pixel * 5 + ripple);
      // Duck body
      ctx.fillStyle = '#15803d'; // Green mallard head
      ctx.fillRect(x + pixel * 9, y + pixel * 5, pixel * 3.5, pixel * 3.5);
      ctx.fillStyle = '#b45309'; // Brown body
      ctx.fillRect(x + pixel * 4, y + pixel * 7, pixel * 6, pixel * 4);
      ctx.fillStyle = '#f59e0b'; // Yellow beak
      ctx.fillRect(x + pixel * 12, y + pixel * 6.5, pixel * 2, pixel * 1.5);

    } else if (sprite.includes('ranita')) {
      // Darwin's frog hopping
      const hop = Math.abs(Math.sin(stepFrame * 1.5)) * pixel * 3;
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(x + pixel * 8, y + pixel * 10 - hop, pixel * 4, pixel * 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Yellow eyes
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + pixel * 9, y + pixel * 7.5 - hop, pixel * 1.5, pixel * 1.5);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(x + pixel * 5, y + pixel * 11 - hop, pixel * 2, pixel * 2);

    } else if (sprite.includes('salamandra')) {
      // Magma salamander on volcanic rocks
      const spark = Math.sin(stepFrame * 2) * pixel * 1.5;
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(x + pixel * 3, y + pixel * 8, pixel * 10, pixel * 4);
      // Flaming yellow spots
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + pixel * 5, y + pixel * 9, pixel * 2, pixel * 2);
      ctx.fillRect(x + pixel * 9, y + pixel * 9, pixel * 2, pixel * 2);
      // Tiny spark
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + pixel * 11 + spark, y + pixel * 6 - spark, pixel, pixel);

    } else if (sprite.includes('pinguino')) {
      // Magellanic penguin waving flipper
      const wave = Math.sin(stepFrame * 1.2) * pixel * 1.5;
      ctx.fillStyle = '#0f172a'; // Black back
      ctx.fillRect(x + pixel * 4, y + pixel * 4, pixel * 7, pixel * 10);
      // White belly
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x + pixel * 6, y + pixel * 6, pixel * 4, pixel * 7);
      // Orange feet & beak
      ctx.fillStyle = '#f97316';
      ctx.fillRect(x + pixel * 8, y + pixel * 5, pixel * 2.5, pixel * 1.5);
      ctx.fillRect(x + pixel * 5, y + pixel * 14, pixel * 2, pixel * 1.5);
      ctx.fillRect(x + pixel * 8, y + pixel * 14, pixel * 2, pixel * 1.5);
      // Waving wing
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + pixel * 2, y + pixel * 6 + wave, pixel * 2, pixel * 4);

    } else if (sprite.includes('picaflor')) {
      // Hummingbird hovering with rapid wing flaps
      const flap = Math.sin(stepFrame * 3.5) * pixel * 2.5;
      const hoverY = Math.sin(stepFrame * 0.8) * pixel * 1.5;
      // Body iridescent emerald
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.ellipse(x + pixel * 8, y + pixel * 8 + hoverY, pixel * 3, pixel * 1.8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // Ruby throat gorget
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(x + pixel * 9, y + pixel * 7.5 + hoverY, pixel * 1.5, pixel * 1.5);
      // Head
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x + pixel * 10, y + pixel * 7 + hoverY, pixel * 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Long beak
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + pixel * 11, y + pixel * 7 + hoverY);
      ctx.lineTo(x + pixel * 15, y + pixel * 7.5 + hoverY);
      ctx.stroke();
      // Flapping wings
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x + pixel * 7, y + pixel * 7 + hoverY);
      ctx.lineTo(x + pixel * 5, y + pixel * 3 + hoverY + flap);
      ctx.lineTo(x + pixel * 9, y + pixel * 5 + hoverY);
      ctx.closePath();
      ctx.fill();

    } else if (sprite.includes('loica')) {
      // Chilean Loica with bright red breast bobbing
      const bob = Math.sin(stepFrame * 0.9) * pixel * 1.2;
      ctx.fillStyle = '#78350f'; // Dark brown back
      ctx.fillRect(x + pixel * 4, y + pixel * 6 + bob, pixel * 8, pixel * 5);
      // Vivid scarlet red breast
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + pixel * 8, y + pixel * 5 + bob, pixel * 4.5, pixel * 5);
      // White eye stripe
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x + pixel * 9, y + pixel * 3.5 + bob, pixel * 3, pixel);
      // Eye & beak
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + pixel * 10.5, y + pixel * 4 + bob, pixel, pixel);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x + pixel * 12.5, y + pixel * 5 + bob, pixel * 2, pixel * 1.2);
      // Perched legs
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + pixel * 6, y + pixel * 11 + bob, pixel * 1.2, pixel * 2);
      ctx.fillRect(x + pixel * 9, y + pixel * 11 + bob, pixel * 1.2, pixel * 2);

    } else if (sprite.includes('copihue')) {
      // Copihue bellflower swaying like a pendulum
      const sway = Math.sin(stepFrame * 0.7) * pixel * 1.8;
      // Climbing green vine
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + pixel * 8, y + pixel * 1);
      ctx.quadraticCurveTo(x + pixel * 12, y + pixel * 6, x + pixel * 8 + sway, y + pixel * 8);
      ctx.stroke();
      // Leaves
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + pixel * 9, y + pixel * 3, pixel * 2, pixel * 2);
      ctx.fillRect(x + pixel * 5, y + pixel * 5, pixel * 2, pixel * 2);
      // Red bell blossom
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.moveTo(x + pixel * 8 + sway, y + pixel * 8);
      ctx.lineTo(x + pixel * 11 + sway, y + pixel * 13);
      ctx.lineTo(x + pixel * 5 + sway, y + pixel * 13);
      ctx.closePath();
      ctx.fill();
      // Yellow stamen tip
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + pixel * 7.5 + sway, y + pixel * 13, pixel * 1.5, pixel * 1.5);

    } else if (sprite.includes('fumarola')) {
      // Volcanic steam vent with rising ember particles
      ctx.fillStyle = '#292524';
      ctx.fillRect(x + pixel * 3, y + pixel * 8, pixel * 10, pixel * 5);
      // Hot red core
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(x + pixel * 6, y + pixel * 9, pixel * 4, pixel * 3);
      // Rising smoke puffs
      for (let p = 0; p < 3; p++) {
        const puffY = (stepFrame * 0.6 + p * 8) % 16;
        const puffX = Math.sin(stepFrame * 0.3 + p) * pixel * 2;
        ctx.fillStyle = `rgba(214, 211, 209, ${Math.max(0, 0.7 - puffY / 16)})`;
        ctx.beginPath();
        ctx.arc(x + pixel * 8 + puffX, y + pixel * 8 - puffY, pixel * 2, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (sprite.includes('alerce')) {
      // Ancient Alerce giant trunk with needle canopy
      const sway = Math.sin(stepFrame * 0.5) * pixel * 1.2;
      // Reddish brown millennial bark
      ctx.fillStyle = '#7c2d12';
      ctx.fillRect(x + pixel * 5, y + pixel * 5, pixel * 6, pixel * 11);
      // Hanging lichen
      ctx.fillStyle = '#84cc16';
      ctx.fillRect(x + pixel * 6, y + pixel * 7, pixel * 2, pixel * 4);
      // Dense evergreen canopy swaying
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.moveTo(x + pixel * 8 + sway, y + pixel * 0.5);
      ctx.lineTo(x + pixel * 15 + sway, y + pixel * 6);
      ctx.lineTo(x + pixel * 1 + sway, y + pixel * 6);
      ctx.closePath();
      ctx.fill();

    } else {
      // River otter (Huillín) bobbing in water
      const bob = Math.sin(stepFrame * 0.8) * pixel * 1.5;
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(x + pixel * 8, y + pixel * 9 + bob, pixel * 4, 0, Math.PI * 2);
      ctx.fill();
      // Whiskers & ears
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + pixel * 6, y + pixel * 8 + bob, pixel * 1.5, pixel);
      ctx.fillRect(x + pixel * 9, y + pixel * 8 + bob, pixel * 1.5, pixel);
    }
  }
}
