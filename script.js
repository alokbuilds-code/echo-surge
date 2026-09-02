/**
 * ECHO SURGE // KINETIC REFLEX ARCADE
 * Complete 60fps Game Engine with Web Audio Procedural Synthesizer
 * Technology: Pure Vanilla HTML5 Canvas & JavaScript
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. PROCEDURAL WEB AUDIO SYNTHESIZER
     Zero external audio files; all sound effects synthesized in real-time.
     ========================================================================== */
  class SoundSynthesizer {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.droneOsc = null;
      this.droneGain = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (!this.enabled && this.droneGain) {
        this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return this.enabled;
    }

    // Shard Pickup Chime with ascending pentatonic scale based on combo
    playShardPickup(comboLevel = 1) {
      if (!this.enabled || !this.ctx) return;
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const noteIdx = Math.min(comboLevel - 1, notes.length - 1);
      const freq = notes[noteIdx] || 440;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    }

    // Chrono Pulse Shockwave Blast: Deep resonant sub-bass sweep & noise
    playChronoBlast() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Sub Bass Drop
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.5);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start();
      subOsc.stop(now + 0.6);

      // Noise Transient Blast
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.2);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
    }

    // Hazard Vaporized laser pop
    playHazardDestroyed() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.16);
    }

    // Shield Damage Impact
    playShieldHit() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(70, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.26);
    }

    // Multiplier Tier Promotion (Chord Chime)
    playMultiplierUp() {
      if (!this.enabled || !this.ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.35);
      });
    }

    // Game Over Sound
    playGameOver() {
      if (!this.enabled || !this.ctx) return;
      const notes = [330, 311, 293, 277, 260];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.45);
      });
    }
  }

  /* ==========================================================================
     2. GAME ENGINE & LOGIC
     ========================================================================== */
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const synth = new SoundSynthesizer();

  // HUD Elements
  const hud = document.getElementById('game-hud');
  const hudScore = document.getElementById('hud-score');
  const hudHighScore = document.getElementById('hud-high-score');
  const hudMultiplier = document.getElementById('hud-multiplier');
  const hudMultBar = document.getElementById('hud-mult-bar');
  const hudChronoFill = document.getElementById('hud-chrono-fill');
  const chronoReadyTag = document.getElementById('chrono-ready-tag');
  const hudShieldPips = document.getElementById('hud-shield-pips');
  const hudFps = document.getElementById('hud-fps');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundStatusText = document.getElementById('sound-status-text');
  const soundStatusIcon = document.getElementById('sound-status-icon');
  const btnPauseToggle = document.getElementById('btn-pause-toggle');

  // Screens
  const screenStart = document.getElementById('screen-start');
  const screenPause = document.getElementById('screen-pause');
  const screenGameOver = document.getElementById('screen-gameover');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnResumeGame = document.getElementById('btn-resume-game');
  const btnRestartPause = document.getElementById('btn-restart-from-pause');
  const btnMenuPause = document.getElementById('btn-menu-from-pause');
  const btnRestartGame = document.getElementById('btn-restart-game');
  const btnMenuGameover = document.getElementById('btn-menu-from-gameover');
  const modeButtons = document.querySelectorAll('.mode-btn');

  // Results elements
  const resRank = document.getElementById('res-rank');
  const resScore = document.getElementById('res-score');
  const resNewHigh = document.getElementById('res-new-high');
  const resMaxCombo = document.getElementById('res-max-combo');
  const resShards = document.getElementById('res-shards');
  const resBlasts = document.getElementById('res-blasts');
  const resTime = document.getElementById('res-time');

  // Game State
  const GameState = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
  };

  let currentState = GameState.MENU;
  let selectedMode = 'classic'; // 'classic', 'hyper', 'zen'
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Stats & Progress
  let score = 0;
  let highScore = parseInt(localStorage.getItem('echo_surge_highscore') || '0', 10);
  let multiplier = 1;
  let multiplierProgress = 0;
  let maxComboReached = 1;
  let shardsHarvested = 0;
  let chronoBlastsUsed = 0;
  let startTime = 0;
  let survivalDuration = 0;

  let shields = 3;
  let maxShields = 3;
  let chronoEnergy = 0; // 0 to 100
  let isChronoSlowMo = false;
  let slowMoTimer = 0;

  let screenShake = 0;
  let chromaticTrauma = 0;

  // Frame timing
  let lastFrameTime = performance.now();
  let frameCount = 0;
  let lastFpsUpdate = performance.now();
  let currentFps = 60;

  // Multiplier thresholds: shards needed to level up multiplier
  const MULT_TIERS = [1, 2, 4, 8, 16, 32];
  const SHARDS_PER_TIER = 5;

  // Player Entity
  const player = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    vx: 0,
    vy: 0,
    radius: 16,
    speed: 0.18,
    trail: [],
    invulnerableTimer: 0,
    ringAngle: 0
  };

  // Keyboard state
  const keys = {
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
  };

  // Entity Collections
  let shards = [];
  let hazards = [];
  let particles = [];
  let floatingTexts = [];
  let shockwaves = [];

  // Spawner Timers
  let shardSpawnTimer = 0;
  let hazardSpawnTimer = 0;
  let laserWarningTimer = 0;

  /* ==========================================================================
     3. RESIZE & CANVAS INITIALIZATION
     ========================================================================== */
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (currentState === GameState.MENU) {
      player.x = width / 2;
      player.y = height / 2;
      player.targetX = width / 2;
      player.targetY = height / 2;
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  hudHighScore.textContent = `HIGH: ${highScore.toLocaleString()}`;

  /* ==========================================================================
     4. INPUT HANDLERS
     ========================================================================== */
  window.addEventListener('mousemove', (e) => {
    if (currentState === GameState.PLAYING) {
      player.targetX = e.clientX;
      player.targetY = e.clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (currentState === GameState.PLAYING && e.touches.length > 0) {
      player.targetX = e.touches[0].clientX;
      player.targetY = e.touches[0].clientY;
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('touchstart', (e) => {
    synth.init();
    if (currentState === GameState.PLAYING && e.touches.length > 0) {
      player.targetX = e.touches[0].clientX;
      player.targetY = e.touches[0].clientY;
    }
  }, { passive: false });

  // Double tap on touch for Chrono Blast
  let lastTouchTime = 0;
  window.addEventListener('touchend', () => {
    const now = performance.now();
    if (now - lastTouchTime < 300) {
      triggerChronoBlast();
    }
    lastTouchTime = now;
  });

  window.addEventListener('keydown', (e) => {
    synth.init();

    if (e.code in keys || e.key in keys) {
      keys[e.key] = true;
      keys[e.code] = true;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      if (currentState === GameState.PLAYING) {
        triggerChronoBlast();
      } else if (currentState === GameState.GAMEOVER) {
        startNewGame();
      }
    }

    if (e.code === 'Escape' || e.key === 'p' || e.key === 'P') {
      if (currentState === GameState.PLAYING) {
        pauseGame();
      } else if (currentState === GameState.PAUSED) {
        resumeGame();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code in keys || e.key in keys) {
      keys[e.key] = false;
      keys[e.code] = false;
    }
  });

  /* ==========================================================================
     5. GAMEPLAY ENTITIES & CREATION
     ========================================================================== */
  function spawnShard() {
    const margin = 60;
    shards.push({
      x: margin + Math.random() * (width - margin * 2),
      y: margin + Math.random() * (height - margin * 2),
      radius: 8,
      pulse: Math.random() * Math.PI * 2,
      type: Math.random() < 0.15 ? 'bonus' : 'normal',
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      life: 600 // 10s
    });
  }

  function spawnHazard() {
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speedMult = selectedMode === 'hyper' ? 1.6 : (1 + (score / 15000) * 0.8);
    const baseSpeed = (2.2 + Math.random() * 1.8) * speedMult;

    if (edge === 0) { // Top
      x = Math.random() * width; y = -20;
      vx = (Math.random() - 0.5) * 2; vy = baseSpeed;
    } else if (edge === 1) { // Right
      x = width + 20; y = Math.random() * height;
      vx = -baseSpeed; vy = (Math.random() - 0.5) * 2;
    } else if (edge === 2) { // Bottom
      x = Math.random() * width; y = height + 20;
      vx = (Math.random() - 0.5) * 2; vy = -baseSpeed;
    } else { // Left
      x = -20; y = Math.random() * height;
      vx = baseSpeed; vy = (Math.random() - 0.5) * 2;
    }

    const type = Math.random() < 0.3 ? 'seeker' : 'vector';

    hazards.push({
      x, y, vx, vy,
      radius: type === 'seeker' ? 12 : 10,
      type,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      targetX: player.x,
      targetY: player.y
    });
  }

  function spawnParticle(x, y, color, count = 1, speed = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (0.5 + Math.random()) * speed;
      particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 2 + Math.random() * 3,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.025
      });
    }
  }

  function spawnFloatingText(text, x, y, color = '#00F0FF') {
    floatingTexts.push({
      text, x, y,
      vy: -1.5,
      alpha: 1,
      color,
      scale: 1.2
    });
  }

  function triggerChronoBlast() {
    if (chronoEnergy < 100 && selectedMode !== 'zen') return;

    if (selectedMode !== 'zen') {
      chronoEnergy = 0;
    }

    chronoBlastsUsed++;
    synth.playChronoBlast();
    screenShake = 16;
    chromaticTrauma = 1;
    isChronoSlowMo = true;
    slowMoTimer = 150; // 2.5 seconds at 60fps

    shockwaves.push({
      x: player.x,
      y: player.y,
      radius: 20,
      maxRadius: Math.max(width, height) * 0.8,
      alpha: 1,
      color: '#00F0FF'
    });

    // Destroy all hazards in blast
    let destroyed = 0;
    hazards = hazards.filter(h => {
      const dx = h.x - player.x;
      const dy = h.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 450) {
        destroyed++;
        spawnParticle(h.x, h.y, '#FF0055', 18, 6);
        return false;
      }
      return true;
    });

    if (destroyed > 0) {
      synth.playHazardDestroyed();
      const points = destroyed * 500 * multiplier;
      score += points;
      spawnFloatingText(`+${points} BLAST!`, player.x, player.y - 30, '#FFD700');
    }
  }

  /* ==========================================================================
     6. GAME LOOP & STATE MANAGEMENT
     ========================================================================== */
  function startNewGame() {
    synth.init();
    currentState = GameState.PLAYING;

    // Reset stats
    score = 0;
    multiplier = 1;
    multiplierProgress = 0;
    maxComboReached = 1;
    shardsHarvested = 0;
    chronoBlastsUsed = 0;
    startTime = performance.now();

    shields = selectedMode === 'hyper' ? 1 : (selectedMode === 'zen' ? 999 : 3);
    maxShields = shields;
    chronoEnergy = 20;
    isChronoSlowMo = false;
    slowMoTimer = 0;
    screenShake = 0;

    // Reset collections
    shards = [];
    hazards = [];
    particles = [];
    floatingTexts = [];
    shockwaves = [];

    // Position player
    player.x = width / 2;
    player.y = height / 2;
    player.targetX = width / 2;
    player.targetY = height / 2;
    player.vx = 0;
    player.vy = 0;
    player.trail = [];
    player.invulnerableTimer = 60; // 1s grace period

    // Initial spawns
    for (let i = 0; i < 4; i++) spawnShard();

    // UI Updates
    screenStart.classList.remove('active');
    screenPause.classList.remove('active');
    screenGameOver.classList.remove('active');
    hud.classList.add('active');
    updateHUD();
  }

  function pauseGame() {
    if (currentState === GameState.PLAYING) {
      currentState = GameState.PAUSED;
      screenPause.classList.add('active');
    }
  }

  function resumeGame() {
    if (currentState === GameState.PAUSED) {
      currentState = GameState.PLAYING;
      screenPause.classList.remove('active');
      lastFrameTime = performance.now();
    }
  }

  function gameOver() {
    currentState = GameState.GAMEOVER;
    synth.playGameOver();
    screenShake = 24;

    survivalDuration = Math.floor((performance.now() - startTime) / 1000);
    const isNewHigh = score > highScore;
    if (isNewHigh) {
      highScore = score;
      localStorage.setItem('echo_surge_highscore', highScore.toString());
    }

    // Rank Calculation
    let rank = 'C';
    if (score >= 45000) rank = 'S+';
    else if (score >= 25000) rank = 'S';
    else if (score >= 12000) rank = 'A';
    else if (score >= 5000) rank = 'B';

    resRank.textContent = rank;
    resScore.textContent = score.toLocaleString();
    resNewHigh.classList.toggle('active', isNewHigh);
    resMaxCombo.textContent = `${maxComboReached}X`;
    resShards.textContent = shardsHarvested.toString();
    resBlasts.textContent = chronoBlastsUsed.toString();

    const mins = Math.floor(survivalDuration / 60);
    const secs = survivalDuration % 60;
    resTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    hud.classList.remove('active');
    screenGameOver.classList.add('active');
  }

  function updateHUD() {
    hudScore.textContent = score.toLocaleString();
    hudHighScore.textContent = `HIGH: ${highScore.toLocaleString()}`;
    hudMultiplier.textContent = `${multiplier}X`;

    const progressPct = (multiplierProgress / SHARDS_PER_TIER) * 100;
    hudMultBar.style.width = `${Math.min(progressPct, 100)}%`;

    hudChronoFill.style.width = `${Math.min(chronoEnergy, 100)}%`;
    if (chronoEnergy >= 100) {
      chronoReadyTag.textContent = 'READY [SPACE]';
      chronoReadyTag.classList.add('ready');
    } else {
      chronoReadyTag.textContent = `CHARGING ${Math.floor(chronoEnergy)}%`;
      chronoReadyTag.classList.remove('ready');
    }

    // Update Shield Pips
    if (selectedMode !== 'zen') {
      hudShieldPips.innerHTML = '';
      for (let i = 0; i < maxShields; i++) {
        const pip = document.createElement('span');
        pip.className = `shield-pip ${i < shields ? 'active' : ''}`;
        hudShieldPips.appendChild(pip);
      }
    }
  }

  /* ==========================================================================
     7. MAIN SIMULATION & PHYSICS (60FPS)
     ========================================================================== */
  function update(dt) {
    if (currentState !== GameState.PLAYING) return;

    const timeScale = isChronoSlowMo ? 0.35 : 1.0;

    if (isChronoSlowMo) {
      slowMoTimer--;
      if (slowMoTimer <= 0) {
        isChronoSlowMo = false;
      }
    }

    // 1. Player Movement & Keyboard Physics
    const moveX = (keys.d || keys.ArrowRight ? 1 : 0) - (keys.a || keys.ArrowLeft ? 1 : 0);
    const moveY = (keys.s || keys.ArrowDown ? 1 : 0) - (keys.w || keys.ArrowUp ? 1 : 0);

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.sqrt(moveX * moveX + moveY * moveY);
      player.vx += (moveX / len) * 1.8;
      player.vy += (moveY / len) * 1.8;
    }

    // Lerp towards target (Mouse/Touch + Velocity)
    player.x += (player.targetX - player.x) * player.speed + player.vx;
    player.y += (player.targetY - player.y) * player.speed + player.vy;
    player.vx *= 0.82;
    player.vy *= 0.82;

    // Constrain to bounds
    player.x = Math.max(player.radius, Math.min(width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(height - player.radius, player.y));

    // Player Trail
    player.trail.unshift({ x: player.x, y: player.y });
    if (player.trail.length > 14) player.trail.pop();
    player.ringAngle += 0.04;

    if (player.invulnerableTimer > 0) player.invulnerableTimer--;

    // 2. Shard Spawning & Harvesting
    shardSpawnTimer += timeScale;
    if (shardSpawnTimer > 75 && shards.length < 9) {
      shardSpawnTimer = 0;
      spawnShard();
    }

    shards.forEach((shard, idx) => {
      shard.x += shard.vx * timeScale;
      shard.y += shard.vy * timeScale;
      shard.pulse += 0.08;
      shard.life -= timeScale;

      // Magnetic pull to player when near
      const dx = player.x - shard.x;
      const dy = player.y - shard.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 140) {
        shard.x += (dx / dist) * 3.5;
        shard.y += (dy / dist) * 3.5;
      }

      // Collect check
      if (dist < player.radius + shard.radius) {
        shardsHarvested++;
        const isBonus = shard.type === 'bonus';
        const points = (isBonus ? 300 : 100) * multiplier;
        score += points;

        synth.playShardPickup(multiplier);
        spawnParticle(shard.x, shard.y, isBonus ? '#FFD700' : '#00F0FF', 14, 4);
        spawnFloatingText(`+${points}`, shard.x, shard.y - 10, isBonus ? '#FFD700' : '#00F0FF');

        // Multiplier progression
        multiplierProgress++;
        chronoEnergy = Math.min(100, chronoEnergy + (isBonus ? 25 : 12));

        if (multiplierProgress >= SHARDS_PER_TIER) {
          multiplierProgress = 0;
          const currentTierIdx = MULT_TIERS.indexOf(multiplier);
          if (currentTierIdx < MULT_TIERS.length - 1) {
            multiplier = MULT_TIERS[currentTierIdx + 1];
            maxComboReached = Math.max(maxComboReached, multiplier);
            synth.playMultiplierUp();
            screenShake = 6;
            spawnFloatingText(`${multiplier}X MULTIPLIER!`, player.x, player.y - 40, '#00F0FF');
          }
        }

        shards.splice(idx, 1);
        updateHUD();
      }
    });
    shards = shards.filter(s => s.life > 0);

    // 3. Hazard Spawning & Collisions
    hazardSpawnTimer += timeScale;
    const spawnRate = selectedMode === 'hyper' ? 45 : Math.max(35, 90 - Math.floor(score / 1000) * 2);
    if (hazardSpawnTimer > spawnRate && hazards.length < 18) {
      hazardSpawnTimer = 0;
      spawnHazard();
    }

    hazards.forEach((hazard, idx) => {
      if (hazard.type === 'seeker') {
        const dx = player.x - hazard.x;
        const dy = player.y - hazard.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        hazard.vx += (dx / dist) * 0.12 * timeScale;
        hazard.vy += (dy / dist) * 0.12 * timeScale;
        hazard.vx = Math.max(-4, Math.min(4, hazard.vx));
        hazard.vy = Math.max(-4, Math.min(4, hazard.vy));
      }

      hazard.x += hazard.vx * timeScale;
      hazard.y += hazard.vy * timeScale;
      hazard.rot += hazard.rotSpeed * timeScale;

      // Check collision with player
      const dx = player.x - hazard.x;
      const dy = player.y - hazard.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < player.radius + hazard.radius && player.invulnerableTimer === 0) {
        if (selectedMode !== 'zen') {
          shields--;
          synth.playShieldHit();
          screenShake = 14;
          chromaticTrauma = 0.8;
          player.invulnerableTimer = 90; // 1.5s grace

          // Multiplier penalty
          multiplier = 1;
          multiplierProgress = 0;

          spawnParticle(hazard.x, hazard.y, '#FF0055', 20, 6);
          hazards.splice(idx, 1);
          updateHUD();

          if (shields <= 0) {
            gameOver();
          }
        }
      }
    });

    // Remove offscreen hazards
    hazards = hazards.filter(h => h.x > -80 && h.x < width + 80 && h.y > -80 && h.y < height + 80);

    // 4. Shockwaves
    shockwaves.forEach((sw, idx) => {
      sw.radius += 24;
      sw.alpha -= 0.035;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(idx, 1);
      }
    });

    // 5. Particles Update
    particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;
      if (p.alpha <= 0) particles.splice(idx, 1);
    });

    // 6. Floating Text Update
    floatingTexts.forEach((ft, idx) => {
      ft.y += ft.vy;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) floatingTexts.splice(idx, 1);
    });

    // Decay trauma & screenshake
    if (screenShake > 0) screenShake *= 0.88;
    if (chromaticTrauma > 0) chromaticTrauma *= 0.92;

    updateHUD();
  }

  /* ==========================================================================
     8. 60FPS VECTOR RENDERING ENGINE
     ========================================================================== */
  function draw() {
    ctx.save();

    // Screen Shake Offset
    if (screenShake > 0.5) {
      const sx = (Math.random() - 0.5) * screenShake;
      const sy = (Math.random() - 0.5) * screenShake;
      ctx.translate(sx, sy);
    }

    // Deep Obsidian Backdrop with Subtle Cyber Grid
    ctx.fillStyle = '#07090E';
    ctx.fillRect(0, 0, width, height);

    // Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Shockwaves
    shockwaves.forEach(sw => {
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${sw.alpha})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    });

    // Draw Shards
    shards.forEach(s => {
      ctx.save();
      ctx.translate(s.x, s.y);
      const isBonus = s.type === 'bonus';
      const color = isBonus ? '#FFD700' : '#00F0FF';
      const scale = 1 + Math.sin(s.pulse) * 0.15;

      ctx.rotate(s.pulse);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;

      // Diamond Polygon
      ctx.beginPath();
      ctx.moveTo(0, -s.radius * scale);
      ctx.lineTo(s.radius * scale, 0);
      ctx.lineTo(0, s.radius * scale);
      ctx.lineTo(-s.radius * scale, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Draw Hazards
    hazards.forEach(h => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);

      ctx.fillStyle = '#FF0055';
      ctx.strokeStyle = '#FF0055';
      ctx.shadowColor = '#FF0055';
      ctx.shadowBlur = 10;

      if (h.type === 'seeker') {
        // Aggressive Triangle
        ctx.beginPath();
        ctx.moveTo(h.radius * 1.3, 0);
        ctx.lineTo(-h.radius, -h.radius * 0.8);
        ctx.lineTo(-h.radius * 0.4, 0);
        ctx.lineTo(-h.radius, h.radius * 0.8);
        ctx.closePath();
        ctx.fill();
      } else {
        // Kinetic Hexagon / Spike
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const r = i % 2 === 0 ? h.radius * 1.2 : h.radius * 0.6;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Player
    if (currentState === GameState.PLAYING || currentState === GameState.PAUSED) {
      // Trail
      for (let i = 0; i < player.trail.length; i++) {
        const pt = player.trail[i];
        const ratio = (player.trail.length - i) / player.trail.length;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, player.radius * ratio * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${ratio * 0.35})`;
        ctx.fill();
      }

      // Player Core
      ctx.save();
      ctx.translate(player.x, player.y);

      // Flashing if invulnerable
      if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 6) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Orbital Shield Ring
      ctx.beginPath();
      ctx.arc(0, 0, player.radius + 6, player.ringAngle, player.ringAngle + Math.PI * 1.5);
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Core Orb
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 18;
      ctx.fill();

      ctx.restore();
    }

    // Draw Floating Text
    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = '700 14px "Fragment Mono", monospace';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();
  }

  /* ==========================================================================
     9. ANIMATION LOOP & EVENT ATTACHMENTS
     ========================================================================== */
  function gameLoop(timestamp) {
    const dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    // FPS Meter
    frameCount++;
    if (timestamp - lastFpsUpdate >= 500) {
      currentFps = Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate));
      hudFps.textContent = `${currentFps} FPS`;
      frameCount = 0;
      lastFpsUpdate = timestamp;
    }

    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
  }

  // Button Listeners
  btnStartGame.addEventListener('click', startNewGame);
  btnResumeGame.addEventListener('click', resumeGame);
  btnRestartPause.addEventListener('click', startNewGame);
  btnRestartGame.addEventListener('click', startNewGame);

  btnMenuPause.addEventListener('click', () => {
    currentState = GameState.MENU;
    screenPause.classList.remove('active');
    screenStart.classList.add('active');
  });

  btnMenuGameover.addEventListener('click', () => {
    currentState = GameState.MENU;
    screenGameOver.classList.remove('active');
    screenStart.classList.add('active');
  });

  btnPauseToggle.addEventListener('click', () => {
    if (currentState === GameState.PLAYING) pauseGame();
    else if (currentState === GameState.PAUSED) resumeGame();
  });

  btnSoundToggle.addEventListener('click', () => {
    synth.init();
    const enabled = synth.toggle();
    soundStatusText.textContent = enabled ? 'AUDIO: ON' : 'AUDIO: OFF';
    soundStatusIcon.textContent = enabled ? '🔊' : '🔇';
  });

  // Mode Selection
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.getAttribute('data-mode');
    });
  });

  // Start animation loop
  requestAnimationFrame(gameLoop);

})();
