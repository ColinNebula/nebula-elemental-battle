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
      powerPlay: this.createPowerPlaySound
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
      'NEUTRAL': 'neutral'
    };
    
    const soundName = elementMap[element];
    if (soundName) {
      this.playSound(soundName);
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
      // Select a random track
      const randomIndex = Math.floor(Math.random() * this.musicTracks.length);
      this.currentTrack = this.musicTracks[randomIndex];
      
      // Create audio element
      this.backgroundMusic = new Audio(`${process.env.PUBLIC_URL}/${this.currentTrack}`);
      this.backgroundMusic.volume = this.musicVolume;
      this.backgroundMusic.loop = true;
      
      // Play the track
      this.backgroundMusic.play().catch(error => {
        console.log('Music autoplay prevented:', error);
      });
      
      console.log('🎵 Now playing:', this.currentTrack);
    } catch (error) {
      console.error('Error playing music:', error);
    }
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
}

// Create singleton instance
const soundManager = new SoundManager();
soundManager.init();

export default soundManager;
