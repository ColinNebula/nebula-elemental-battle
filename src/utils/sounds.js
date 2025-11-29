// Sound effects manager for the game

class SoundManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.audioUnlocked = false; // Track if mobile audio context is unlocked
    this.audioContext = null; // Persistent AudioContext for iOS compatibility
    this.audioContextCreationAttempts = 0;
    this.maxAudioContextAttempts = 3;
    this.unlockListenersAdded = false; // Track if unlock listeners are set up
    this.silentAudioElement = null; // Silent audio element for iOS unlock
    // Load saved volumes from localStorage or use defaults
    const savedVolume = localStorage.getItem('soundVolume');
    const savedMusicVolume = localStorage.getItem('musicVolume');
    this.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
    this.musicVolume = savedMusicVolume !== null ? parseFloat(savedMusicVolume) : 0.3;
    this.currentMusicIntensity = 'calm';
    this.backgroundMusic = null;
    this.currentTrack = null;
    this.comboChainCount = 0;
    this.lastScoreDifference = 0;
    this.intensityCheckInterval = null;
    
    // Detect iOS
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Available background music tracks (8 tracks, ~30MB optimized for deployment)
    this.musicTracks = [
      'At_the_End_of_All_Things.mp3',
      'Boss_Battle_Loop_1.mp3',
      'Cooler_Heads_Prevail.mp3',
      'Figuring_it_All_Out.mp3',
      'Strange_Dealings_Afoot.mp3',
      'The_Fallout.mp3',
      'Treat_or_Trick.mp3',
      'Under_Cover_of_the_Myst.mp3'
    ];
    
    // Voice lines for different avatar personalities
    this.voiceLines = {
      warrior: {
        cardPlay: ['For honor!', 'Strike true!', 'Witness my strength!', 'Victory awaits!'],
        victory: ['The battle is won!', 'Glory is mine!', 'I stand victorious!'],
        defeat: ['I shall return...', 'Not today...', 'This is not the end...'],
        combo: ['Behold my power!', 'A masterful strike!', 'Unstoppable!'],
        counter: ['You dare challenge me?!', 'Not so fast!', 'I counter your move!']
      },
      mage: {
        cardPlay: ['By arcane force!', 'Magic flows through me!', 'Witness this!', 'The elements obey!'],
        victory: ['My magic prevails!', 'The spell is complete!', 'Knowledge conquers all!'],
        defeat: ['The stars were not aligned...', 'Magic fades...', 'I must study further...'],
        combo: ['Arcane mastery!', 'The perfect incantation!', 'Spellcraft perfected!'],
        counter: ['Your magic is weak!', 'I dispel your power!', 'Not this time!']
      },
      rogue: {
        cardPlay: ['Here we go!', 'Watch this!', 'Quick and deadly!', 'Time to strike!'],
        victory: ['Too easy!', 'Never saw it coming!', 'Victory is mine!'],
        defeat: ['I\'ll get you next time...', 'Just a setback...', 'This isn\'t over...'],
        combo: ['Multi-strike!', 'Chain attack!', 'Like a shadow!'],
        counter: ['Gotcha!', 'Nice try!', 'Intercepted!']
      },
      sage: {
        cardPlay: ['Wisdom guides me.', 'As foretold.', 'Balance in all things.', 'The path is clear.'],
        victory: ['Peace returns.', 'As it should be.', 'Harmony restored.'],
        defeat: ['The cycle continues...', 'Another lesson learned...', 'I accept this outcome...'],
        combo: ['Synergy achieved.', 'Perfect balance.', 'Harmony in motion.'],
        counter: ['I foresaw this.', 'Already anticipated.', 'Expected.']
      }
    };
  }

  // Initialize all sound effects
  init() {
    // Element sounds - using Web Audio API oscillators for retro game sounds
    this.sounds = {
      fire: this.createFireSound,
      ice: this.createIceSound,
      water: this.createWaterSound,
      electricity: this.createElectricitySound,
      earth: this.createEarthSound,
      power: this.createPowerSound,
      light: this.createLightSound,
      dark: this.createDarkSound,
      neutral: this.createNeutralSound,
      cardFlip: this.createCardFlipSound,
      victory: this.createVictorySound,
      defeat: this.createDefeatSound,
      yourTurn: this.createYourTurnSound,
      opponentTurn: this.createOpponentTurnSound,
      powerPlay: this.createPowerPlaySound,
      combo: this.createComboSound,
      crowdCheer: this.createCrowdCheerSound,
      crowdGasp: this.createCrowdGaspSound,
      technology: this.createTechnologySound,
      meteor: this.createMeteorSound
    };
    
    // Initialize AudioContext for iOS compatibility
    this.initAudioContext();
  }
  
  // Get or create persistent AudioContext (iOS compatibility)
  getAudioContext() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      if (this.audioContextCreationAttempts >= this.maxAudioContextAttempts) {
        console.warn('⚠️ Max AudioContext creation attempts reached');
        return null;
      }
      
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioContextCreationAttempts++;
        console.log('🔊 AudioContext created, state:', this.audioContext.state);
      } catch (error) {
        console.error('❌ Failed to create AudioContext:', error);
        return null;
      }
    }
    
    return this.audioContext;
  }
  
  // Initialize and unlock AudioContext for iOS
  async initAudioContext() {
    const context = this.getAudioContext();
    if (!context) return;
    
    // Try to resume if suspended (iOS requirement)
    if (context.state === 'suspended') {
      console.log('⏸️ AudioContext suspended, setting up iOS unlock');
      this.setupMobileAudioUnlock();
    } else if (context.state === 'running') {
      console.log('✅ AudioContext running');
      this.audioUnlocked = true;
    }
    
    // iOS-specific: Create a silent audio element to help unlock audio
    if (this.isIOS && !this.silentAudioElement) {
      this.createSilentAudioElement();
    }
  }
  
  // Create a silent audio element for iOS unlock
  createSilentAudioElement() {
    try {
      // Create a tiny silent audio buffer
      const context = this.getAudioContext();
      if (!context) return;
      
      // Create a 1-sample silent buffer
      const silentBuffer = context.createBuffer(1, 1, 22050);
      this.silentBuffer = silentBuffer;
      
      console.log('🔊 Silent audio buffer created for iOS');
    } catch (e) {
      console.log('Silent buffer creation skipped');
    }
  }
  
  // Play silent sound to unlock iOS audio
  async playSilentSound() {
    try {
      const context = this.getAudioContext();
      if (!context || !this.silentBuffer) return;
      
      const source = context.createBufferSource();
      source.buffer = this.silentBuffer;
      source.connect(context.destination);
      source.start(0);
      
      // Also resume context
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      this.audioUnlocked = true;
      console.log('🔊 iOS audio unlocked via silent sound');
    } catch (e) {
      // Silent fail
    }
  }
  
  // Resume AudioContext if suspended (iOS compatibility)
  async resumeAudioContext() {
    const context = this.getAudioContext();
    if (!context) return false;
    
    if (context.state === 'suspended') {
      try {
        await context.resume();
        console.log('✅ AudioContext resumed');
        this.audioUnlocked = true;
        return true;
      } catch (error) {
        console.error('❌ Failed to resume AudioContext:', error);
        return false;
      }
    }
    
    return context.state === 'running';
  }

  // Create element-specific sounds using Web Audio API
  createFireSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createIceSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.4;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.2 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createWaterSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.5;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(350, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(380, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.25 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createElectricitySound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.2;
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + duration);
  }

  createEarthSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.4;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.4 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createPowerSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.35 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createLightSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.35;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.25 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createDarkSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.5;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createNeutralSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createCardFlipSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.15;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.15 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createVictorySound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const notes = [262, 330, 392, 523]; // C, E, G, C (major chord)
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      const startTime = audioContext.currentTime + (i * 0.15);
      gainNode.gain.setValueAtTime(0.3 * this.volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }

  createDefeatSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const notes = [392, 349, 330, 294]; // Descending sad notes
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      const startTime = audioContext.currentTime + (i * 0.2);
      gainNode.gain.setValueAtTime(0.25 * this.volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.6);
    });
  }

  createYourTurnSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  createOpponentTurnSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.25 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  createPowerPlaySound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.5;
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.type = 'square';
    oscillator1.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration);
    
    oscillator2.type = 'sawtooth';
    oscillator2.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.4 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
  }

  createTechnologySound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.35;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.25 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createMeteorSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    const duration = 0.6;
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(500, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
    
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(250, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(25, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.5 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
  }

  createComboSound(comboCount = 1) {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    // Create ascending notes for combo chain
    const baseFreq = 400;
    const duration = 0.2;
    
    for (let i = 0; i < comboCount && i < 5; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      const freq = baseFreq * Math.pow(1.2, i);
      oscillator.frequency.value = freq;
      
      const startTime = audioContext.currentTime + (i * 0.1);
      gainNode.gain.setValueAtTime(0.25 * this.volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    }
  }

  createCrowdCheerSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    // Simulate crowd cheer with filtered noise
    const duration = 1.5;
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15 * this.volume, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.15 * this.volume, audioContext.currentTime + 1.0);
    gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + duration);
  }

  createCrowdGaspSound() {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;
    
    // Simulate crowd gasp with quick filtered noise burst
    const duration = 0.4;
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.2 * this.volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + duration);
  }

  // Play a sound effect
  async playSound(soundName, volumeMultiplier = 1) {
    if (!this.enabled) {
      console.log('🔇 Sound disabled:', soundName);
      return;
    }
    
    console.log('🔊 Attempting to play sound:', soundName, 'unlocked:', this.audioUnlocked);
    
    // Prevent duplicate sounds playing in quick succession
    const now = Date.now();
    if (!this.lastSoundTimes) this.lastSoundTimes = {};
    if (this.lastSoundTimes[soundName] && now - this.lastSoundTimes[soundName] < 500) {
      console.log('🔇 Skipping duplicate sound:', soundName);
      return;
    }
    this.lastSoundTimes[soundName] = now;
    
    // Map of sound names to audio files
    const audioFiles = {
      'fire': 'mixkit-fire-swoosh-burning-1328.mp3',
      'fireball': 'mixkit-fireball-spell-1347.mp3',
      'meteorStrike': 'mixkit-fireball-spell-1347.mp3',
      'ice': 'mixkit-thin-icicles-spell-882.mp3',
      'magic': 'mixkit-magic-sparkle-whoosh-2350.mp3',
      'light': 'mixkit-shot-light-energy-flowing-2589.mp3',
      'swoosh': 'mixkit-soft-woosh-fire-1346.mp3',
      'fairy': 'mixkit-spellcaster-fairy-swoosh-1463.mp3',
      'victory': 'mixkit-game-success-alert-2039.mp3',
      'defeat': 'mixkit-terror-sweep-of-darkness-2630.mp3',
      'crowdCheer': 'mixkit-huge-crowd-cheering-victory-462.mp3',
      'meteor': 'mixkit-small-meteor-falling-1337.mp3',
      'water': 'mixkit-bass-rumble-hum-2297.mp3'
    };
    
    // If there's an audio file for this sound, use it
    if (audioFiles[soundName]) {
      try {
        const audio = new Audio(`${process.env.PUBLIC_URL}/${audioFiles[soundName]}`);
        audio.volume = this.volume * volumeMultiplier;
        // iOS compatibility
        audio.setAttribute('playsinline', 'true');
        audio.setAttribute('webkit-playsinline', 'true');
        audio.preload = 'auto';
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.audioUnlocked = true;
            })
            .catch(err => {
              console.log('Sound play prevented:', err.message);
              // Try to unlock on next interaction
              if (!this.audioUnlocked) {
                this.setupMobileAudioUnlock();
              }
            });
        }
        return;
      } catch (error) {
        // Only log in development to reduce console noise
        if (process.env.NODE_ENV === 'development') {
          console.log('Audio playback skipped:', error.message);
        }
      }
    }
    
    // Fall back to Web Audio API synthesized sound
    if (this.sounds[soundName]) {
      try {
        // Try to resume AudioContext for iOS
        await this.resumeAudioContext();
        
        const context = this.getAudioContext();
        if (!context) {
          // Silent fallback - audio not available
          return;
        }
        
        if (context.state === 'running') {
          this.sounds[soundName].call(this);
          this.audioUnlocked = true;
        } else {
          // Silent fallback - context not ready
          this.setupMobileAudioUnlock();
        }
      } catch (error) {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Sound synthesis skipped:', error.message);
        }
      }
    }
  }

  // Play element-specific sound
  playElementSound(element) {
    const elementMap = {
      'FIRE': 'fire',
      'ICE': 'ice',
      'WATER': 'water',
      'ELECTRICITY': 'light',
      'EARTH': 'earth',
      'POWER': 'magic',
      'LIGHT': 'light',
      'DARK': 'swoosh',
      'NEUTRAL': 'neutral',
      'TECHNOLOGY': 'technology',
      'METEOR': 'meteor'
    };
    
    const soundName = elementMap[element];
    if (soundName) {
      this.playSound(soundName);
    }
  }

  // Play combo chain sound
  async playComboChain(comboCount) {
    if (!this.enabled || comboCount < 2) return;
    
    this.comboChainCount = comboCount;
    
    try {
      // Resume AudioContext for iOS
      await this.resumeAudioContext();
      
      const audioContext = this.getAudioContext();
      if (!audioContext || audioContext.state !== 'running') {
        // Silent fallback - context not ready
        return;
      }
      
      this.createComboSound(comboCount);
      this.audioUnlocked = true;
      
      // Play crowd cheer for combos of 3+
      if (comboCount >= 3) {
        setTimeout(() => {
          this.createCrowdCheerSound();
        }, 200);
      }
    } catch (error) {
      // Silent fallback for combo sounds
      if (process.env.NODE_ENV === 'development') {
        console.log('Combo sound skipped:', error.message);
      }
    }
  }

  // Play voice line
  playVoiceLine(avatarType = 'warrior', action = 'cardPlay') {
    if (!this.enabled) return;
    
    const personality = this.voiceLines[avatarType] || this.voiceLines.warrior;
    const lines = personality[action];
    
    if (!lines || lines.length === 0) return;
    
    // Select random line
    const line = lines[Math.floor(Math.random() * lines.length)];
    
    // Use speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.rate = 1.1;
      utterance.pitch = this.getVoicePitch(avatarType);
      utterance.volume = this.volume * 0.6;
      
      window.speechSynthesis.speak(utterance);
      console.log(`🗣️ ${avatarType}: "${line}"`);
    }
  }

  // Get voice pitch based on avatar type
  getVoicePitch(avatarType) {
    const pitchMap = {
      warrior: 0.8,
      mage: 1.1,
      rogue: 1.2,
      sage: 0.9
    };
    return pitchMap[avatarType] || 1.0;
  }

  // Play crowd reaction
  async playCrowdReaction(reactionType = 'cheer') {
    if (!this.enabled) return;
    
    if (reactionType === 'cheer') {
      this.playSound('crowdCheer', 0.8);
      return;
    }
    
    try {
      if (reactionType === 'gasp') {
        // Resume AudioContext for iOS
        await this.resumeAudioContext();
        
        const audioContext = this.getAudioContext();
        if (!audioContext || audioContext.state !== 'running') {
          // Silent fallback - context not ready
          return;
        }
        
        this.createCrowdGaspSound();
        this.audioUnlocked = true;
      }
    } catch (error) {
      // Silent fallback for crowd reactions
      if (process.env.NODE_ENV === 'development') {
        console.log('Crowd reaction skipped:', error.message);
      }
    }
  }

  // Background music with intensity levels
  playMusic(intensity = 'calm') {
    if (!this.musicEnabled) {
      console.log('🔇 Music disabled');
      return;
    }
    
    // If music is already playing, don't restart it
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      console.log('🎵 Music already playing:', this.currentTrack);
      return;
    }
    
    console.log('🎵 Starting music with intensity:', intensity, 'iOS:', this.isIOS, 'unlocked:', this.audioUnlocked);
    
    // Stop any existing music first
    this.stopMusic();
    
    this.currentMusicIntensity = intensity;
    
    try {
      // Select a track based on intensity
      let trackIndex;
      if (intensity === 'intense') {
        // Battle tracks for intense moments
        const intenseTracks = ['Boss_Battle_Loop_1.mp3', 'Treat_or_Trick.mp3'];
        const availableIntense = intenseTracks.filter(t => this.musicTracks.includes(t));
        trackIndex = this.musicTracks.indexOf(availableIntense[Math.floor(Math.random() * availableIntense.length)]);
      } else {
        // Random track for calm/moderate
        trackIndex = Math.floor(Math.random() * this.musicTracks.length);
      }
      
      this.currentTrack = this.musicTracks[trackIndex];
      
      // Create audio element with proper path using PUBLIC_URL
      this.backgroundMusic = new Audio(`${process.env.PUBLIC_URL}/${this.currentTrack}`);
      this.backgroundMusic.volume = this.getMusicVolumeForIntensity(intensity);
      this.backgroundMusic.loop = true;
      
      // iOS-specific audio handling
      this.backgroundMusic.setAttribute('playsinline', 'true');
      this.backgroundMusic.setAttribute('webkit-playsinline', 'true');
      this.backgroundMusic.muted = false;
      
      // iOS requires load() before play()
      this.backgroundMusic.load();
      
      // For iOS, we need to wait for canplaythrough event
      if (this.isIOS) {
        this.backgroundMusic.addEventListener('canplaythrough', () => {
          if (this.backgroundMusic && this.audioUnlocked && this.musicEnabled) {
            this.backgroundMusic.play().catch(() => {
              // Will retry on next interaction
            });
          }
        }, { once: true });
      }
      
      // Try to play - will succeed if audio is unlocked
      const playPromise = this.backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.audioUnlocked = true;
          console.log('🎵 Music playing:', this.currentTrack);
        }).catch(() => {
          // Music autoplay prevented - set up unlock and wait
          console.log('🎵 Music waiting for user interaction');
          this.setupMobileAudioUnlock();
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Music playback issue:', error.message);
      }
      this.setupMobileAudioUnlock();
    }
  }
  
  // Setup mobile audio unlock on first user interaction
  setupMobileAudioUnlock() {
    if (this.audioUnlocked || this.unlockListenersAdded) return;
    
    this.unlockListenersAdded = true;
    
    const unlockAudio = async (event) => {
      // Prevent multiple unlocks
      if (this.audioUnlocked) return;
      
      try {
        console.log('🔊 Attempting iOS audio unlock via:', event.type);
        
        // 1. Resume AudioContext for Web Audio API sounds
        const context = this.getAudioContext();
        if (context && context.state === 'suspended') {
          await context.resume();
          console.log('✅ AudioContext resumed, state:', context.state);
        }
        
        // 2. Play silent sound for iOS
        if (this.isIOS) {
          await this.playSilentSound();
        }
        
        // 3. Try to play background music if available
        if (this.backgroundMusic && this.backgroundMusic.paused && this.musicEnabled) {
          try {
            await this.backgroundMusic.play();
            console.log('🎵 Background music started after unlock');
          } catch (musicErr) {
            console.log('Music will start on next interaction');
          }
        }
        
        this.audioUnlocked = true;
        console.log('✅ Mobile/iOS audio unlocked successfully');
        
        // Remove listeners after successful unlock
        this.removeUnlockListeners(unlockAudio);
      } catch (err) {
        console.log('Audio unlock attempt:', err.message);
        // Don't remove listeners - try again on next interaction
      }
    };
    
    // Store reference for removal
    this.unlockHandler = unlockAudio;
    
    // Listen for any user interaction - iOS requires touch events
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('touchend', unlockAudio, { passive: true });
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    
    // iOS Safari sometimes needs interaction on specific elements
    if (this.isIOS) {
      document.body.addEventListener('touchstart', unlockAudio, { passive: true });
    }
    
    console.log('🔊 Mobile audio unlock listeners added');
  }
  
  // Remove unlock listeners
  removeUnlockListeners(handler) {
    document.removeEventListener('touchstart', handler);
    document.removeEventListener('touchend', handler);
    document.removeEventListener('click', handler);
    document.removeEventListener('keydown', handler);
    if (this.isIOS) {
      document.body.removeEventListener('touchstart', handler);
    }
    this.unlockListenersAdded = false;
  }

  // Get music volume based on intensity
  getMusicVolumeForIntensity(intensity) {
    const baseVolume = this.musicVolume;
    switch (intensity) {
      case 'intense':
        return Math.min(baseVolume * 1.3, 1.0);
      case 'moderate':
        return baseVolume * 1.1;
      default:
        return baseVolume;
    }
  }

  // Update music intensity dynamically based on game state
  updateMusicIntensity(playerScore, opponentScore, round, maxRounds) {
    if (!this.musicEnabled || !this.backgroundMusic) return;
    
    const scoreDiff = Math.abs(playerScore - opponentScore);
    const roundProgress = round / maxRounds;
    
    let newIntensity = 'calm';
    
    // Determine intensity based on game state
    if (scoreDiff <= 1 && roundProgress > 0.5) {
      newIntensity = 'intense'; // Close match in later rounds
    } else if (scoreDiff <= 2 || roundProgress > 0.7) {
      newIntensity = 'moderate';
    }
    
    // Only change if intensity actually changed
    if (newIntensity !== this.currentMusicIntensity) {
      this.currentMusicIntensity = newIntensity;
      
      // Smoothly adjust volume
      const targetVolume = this.getMusicVolumeForIntensity(newIntensity);
      this.smoothVolumeTransition(targetVolume, 1000);
      
      console.log(`🎵 Music intensity: ${newIntensity} (Score diff: ${scoreDiff}, Round: ${round}/${maxRounds})`);
      
      // Play crowd reaction for intensity changes
      if (newIntensity === 'intense') {
        this.playCrowdReaction('cheer');
      }
    }
  }

  // Smooth volume transition
  smoothVolumeTransition(targetVolume, duration = 1000) {
    if (!this.backgroundMusic) return;
    
    const startVolume = this.backgroundMusic.volume;
    const startTime = Date.now();
    
    const adjustVolume = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.backgroundMusic.volume = startVolume + (targetVolume - startVolume) * progress;
      
      if (progress < 1) {
        requestAnimationFrame(adjustVolume);
      }
    };
    
    adjustVolume();
  }

  createAmbientMusic(audioContext, intensity) {
    // Legacy method - no longer used
    // Background music now uses MP3 files
  }

  stopMusic() {
    // Stop legacy oscillator music
    if (this.music && this.music.oscillator) {
      try {
        this.music.gainNode.gain.exponentialRampToValueAtTime(0.01, this.music.audioContext.currentTime + 1);
        this.music.oscillator.stop(this.music.audioContext.currentTime + 1);
        this.music = null;
      } catch (error) {
        console.error('Error stopping oscillator music:', error);
      }
    }
    
    // Stop MP3 background music
    if (this.backgroundMusic) {
      try {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        this.backgroundMusic = null;
        this.currentTrack = null;
        console.log('🎵 Music stopped');
      } catch (error) {
        console.error('Error stopping background music:', error);
      }
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('soundVolume', this.volume.toString());
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('musicVolume', this.musicVolume.toString());
    
    // Update legacy oscillator music
    if (this.music && this.music.gainNode) {
      this.music.gainNode.gain.value = this.musicVolume * 0.1;
    }
    
    // Update MP3 background music
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume;
    }
  }

  pauseMusic() {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      console.log('🎵 Music paused');
    }
  }

  resumeMusic() {
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      try {
        this.backgroundMusic.play().catch(error => {
          console.log('Error resuming music:', error);
        });
        console.log('🎵 Music resumed');
      } catch (error) {
        console.log('Error in resumeMusic:', error);
      }
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  stopAllSounds() {
    // Stop all currently playing sound effects
    Object.values(this.sounds).forEach(sound => {
      if (sound && !sound.paused) {
        try {
          sound.pause();
          sound.currentTime = 0;
        } catch (error) {
          // Ignore errors from sounds that can't be stopped
        }
      }
    });
    
    // Clear the sounds object
    this.sounds = {};
    console.log('🔇 All sounds stopped');
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      this.playMusic(this.currentMusicIntensity);
    }
    return this.musicEnabled;
  }
  
  // Change to next random track
  changeTrack() {
    if (!this.musicEnabled) return;
    
    // Get a different random track
    const availableTracks = this.musicTracks.filter(track => track !== this.currentTrack);
    if (availableTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      this.currentTrack = availableTracks[randomIndex];
      
      // Stop current music and play new track
      this.stopMusic();
      this.playMusic(this.currentMusicIntensity);
    }
  }
  
  // Get currently playing track name
  getCurrentTrack() {
    return this.currentTrack ? this.currentTrack.replace('.mp3', '').replace(/_/g, ' ') : 'None';
  }
  
  // Try to start music (call this after any user interaction)
  async tryStartMusic() {
    try {
      // Resume AudioContext for Web Audio API sounds
      await this.resumeAudioContext();
      
      if (this.musicEnabled && this.backgroundMusic && this.backgroundMusic.paused) {
        try {
          const playPromise = this.backgroundMusic.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('🎵 Music resumed successfully');
                this.audioUnlocked = true;
              })
              .catch(error => {
                console.log('Could not start music yet:', error.message);
                // Set up mobile audio unlock if not already done
                this.setupMobileAudioUnlock();
              });
          }
        } catch (playError) {
          console.log('Error playing music:', playError);
        }
      } else if (this.musicEnabled && !this.backgroundMusic) {
        // No music loaded yet, start it
        this.playMusic('calm');
      }
    } catch (error) {
      console.error('Error trying to start music:', error);
    }
  }

  /**
   * Manual audio unlock method - call this on first user tap
   * iOS requires explicit user gesture to enable audio
   */
  async unlockAudio() {
    console.log('🔓 Manual audio unlock requested');
    
    try {
      // Resume AudioContext
      await this.resumeAudioContext();
      
      // For iOS, play a silent audio element to unlock
      if (this.isIOS || !this.audioUnlocked) {
        const silentAudio = new Audio();
        silentAudio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwmHAAAAAAD/+1DEAAAFYANf9AAACJ8Ha/81oAAB4AAAANhIAAAAAxAwAgADA4AMAAAACD4AQfACAAAACB8EIPgAAAAAmGMYxjGH/KAqYQAZABcLggBABABQ4BABgAhxcEwTBME4KAoZQ//////////8HwfB8HwfggGAxQFEQAQAGaGBgYHCgoKCj//////////////////xQUFBQ';
        silentAudio.volume = 0.001;
        silentAudio.muted = false;
        silentAudio.setAttribute('playsinline', 'true');
        silentAudio.setAttribute('webkit-playsinline', 'true');
        
        await silentAudio.play().catch(() => {});
        silentAudio.pause();
        
        this.audioUnlocked = true;
        this.silentAudioUnlocked = true;
        console.log('✅ Audio unlocked via manual trigger');
      }
      
      // Also unlock via AudioContext silent buffer
      if (this.audioContext && this.audioContext.state === 'running') {
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
      }
      
      return true;
    } catch (error) {
      console.warn('Manual audio unlock failed:', error);
      return false;
    }
  }

  /**
   * Check if audio is unlocked and ready to play
   */
  isAudioReady() {
    return this.audioUnlocked || this.silentAudioUnlocked || 
           (this.audioContext && this.audioContext.state === 'running');
  }
}

// Create singleton instance
const soundManager = new SoundManager();
soundManager.init();

export default soundManager;
