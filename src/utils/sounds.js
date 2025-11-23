// Sound effects manager for the game

class SoundManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.volume = 0.5;
    this.musicVolume = 0.3;
    this.currentMusicIntensity = 'calm';
    this.backgroundMusic = null;
    this.currentTrack = null;
    this.comboChainCount = 0;
    this.lastScoreDifference = 0;
    this.intensityCheckInterval = null;
    
    // Available background music tracks
    this.musicTracks = [
      'At_the_End_of_All_Things.mp3',
      'Battle_of_the_Pixelated_Cyborgs.mp3',
      'Boss_Battle_Loop_1.mp3',
      'Burnt_Out_Space_Hulk.mp3',
      'Cooler_Heads_Prevail.mp3',
      'Figuring_it_All_Out.mp3',
      'Further_Investigation.mp3',
      'Strange_Dealings_Afoot.mp3',
      'Sunrise_in_Megalopolis.mp3',
      'The_Fallout.mp3',
      'Treat_or_Trick.mp3',
      'Under_Cover_of_the_Myst.mp3',
      'When_You_Risk_it_All.mp3'
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
  }

  // Create element-specific sounds using Web Audio API
  createFireSound(audioContext) {
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createIceSound(audioContext) {
    const duration = 0.4;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createWaterSound(audioContext) {
    const duration = 0.5;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(350, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(380, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createElectricitySound(audioContext) {
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
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + duration);
  }

  createEarthSound(audioContext) {
    const duration = 0.4;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createPowerSound(audioContext) {
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.35, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createLightSound(audioContext) {
    const duration = 0.35;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createDarkSound(audioContext) {
    const duration = 0.5;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createNeutralSound(audioContext) {
    const duration = 0.3;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createCardFlipSound(audioContext) {
    const duration = 0.15;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createVictorySound(audioContext) {
    const notes = [262, 330, 392, 523]; // C, E, G, C (major chord)
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      const startTime = audioContext.currentTime + (i * 0.15);
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }

  createDefeatSound(audioContext) {
    const notes = [392, 349, 330, 294]; // Descending sad notes
    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      const startTime = audioContext.currentTime + (i * 0.2);
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.6);
    });
  }

  createYourTurnSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  createOpponentTurnSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  createPowerPlaySound(audioContext) {
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
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
  }

  createTechnologySound(audioContext) {
    const duration = 0.35;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  createMeteorSound(audioContext) {
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
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
  }

  createComboSound(audioContext, comboCount = 1) {
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
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    }
  }

  createCrowdCheerSound(audioContext) {
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
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + 1.0);
    gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + duration);
  }

  createCrowdGaspSound(audioContext) {
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
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noise.start();
    noise.stop(audioContext.currentTime + duration);
  }

  // Play a sound effect
  playSound(soundName, volumeMultiplier = 1) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.sounds[soundName](audioContext);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // Play element-specific sound
  playElementSound(element) {
    const elementMap = {
      'FIRE': 'fire',
      'ICE': 'ice',
      'WATER': 'water',
      'ELECTRICITY': 'electricity',
      'EARTH': 'earth',
      'POWER': 'power',
      'LIGHT': 'light',
      'DARK': 'dark',
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
  playComboChain(comboCount) {
    if (!this.enabled || comboCount < 2) return;
    
    this.comboChainCount = comboCount;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.createComboSound(audioContext, comboCount);
      
      // Play crowd cheer for combos of 3+
      if (comboCount >= 3) {
        setTimeout(() => {
          const cheerContext = new (window.AudioContext || window.webkitAudioContext)();
          this.createCrowdCheerSound(cheerContext);
        }, 200);
      }
    } catch (error) {
      console.error('Error playing combo sound:', error);
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
  playCrowdReaction(reactionType = 'cheer') {
    if (!this.enabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (reactionType === 'cheer') {
        this.createCrowdCheerSound(audioContext);
      } else if (reactionType === 'gasp') {
        this.createCrowdGaspSound(audioContext);
      }
    } catch (error) {
      console.error('Error playing crowd reaction:', error);
    }
  }

  // Background music with intensity levels
  playMusic(intensity = 'calm') {
    if (!this.musicEnabled) return;
    
    // If music is already playing, don't restart it
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      console.log('🎵 Music already playing:', this.currentTrack);
      return;
    }
    
    // Stop any existing music first
    this.stopMusic();
    
    this.currentMusicIntensity = intensity;
    
    try {
      // Select a track based on intensity
      let trackIndex;
      if (intensity === 'intense') {
        // Battle tracks for intense moments
        const intenseTracks = ['Battle_of_the_Pixelated_Cyborgs.mp3', 'Boss_Battle_Loop_1.mp3', 'When_You_Risk_it_All.mp3'];
        const availableIntense = intenseTracks.filter(t => this.musicTracks.includes(t));
        trackIndex = this.musicTracks.indexOf(availableIntense[Math.floor(Math.random() * availableIntense.length)]);
      } else {
        // Random track for calm/moderate
        trackIndex = Math.floor(Math.random() * this.musicTracks.length);
      }
      
      this.currentTrack = this.musicTracks[trackIndex];
      
      // Create audio element
      this.backgroundMusic = new Audio(`${process.env.PUBLIC_URL}/${this.currentTrack}`);
      this.backgroundMusic.volume = this.getMusicVolumeForIntensity(intensity);
      this.backgroundMusic.loop = true;
      
      // Play the track
      const playPromise = this.backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('🎵 Music playing successfully:', this.currentTrack);
        }).catch(error => {
          console.warn('⚠️ Music autoplay prevented - user interaction required:', error.message);
          console.log('💡 Music will start after any button click or card play');
        });
      }
      
      console.log(`🎵 Now playing [${intensity}]:`, this.currentTrack);
    } catch (error) {
      console.error('Error playing music:', error);
    }
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
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
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
      this.backgroundMusic.play().catch(error => {
        console.log('Error resuming music:', error);
      });
      console.log('🎵 Music resumed');
    }
  }

  toggleMusic() {
    this.enabled = !this.enabled;
    return this.enabled;
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
  tryStartMusic() {
    if (this.musicEnabled && this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(error => {
        console.log('Could not start music yet:', error.message);
      });
    } else if (this.musicEnabled && !this.backgroundMusic) {
      // No music loaded yet, start it
      this.playMusic('calm');
    }
  }
}

// Create singleton instance
const soundManager = new SoundManager();
soundManager.init();

export default soundManager;
