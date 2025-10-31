// Audio manager - background score, interactive cues, and visualisation
// Powered by p5.sound.js

class AudioManager {
  constructor() {
    this.bgMusic = null;          // Background music source
    this.clickOsc = null;          // Click sound oscillator
    this.hoverOsc = null;          // Hover sound oscillator
    this.fft = null;               // FFT analyser
    this.amplitude = null;         // Amplitude analyser
    this.isPlaying = false;
    this.volume = 0.7;             // Default volume level
    this.isInitialized = false;

    // Placeholder for external audio sources
    this.musicSources = [
      // Example ocean ambience from Freesound
      // Browser limits require oscillator-based ambience here
      null // Replace with a hosted audio file to bypass synthesis
    ];
  }

  // Initialise the audio system
  async init() {
    if (this.isInitialized) return;

    try {
      // Wait for user interaction before initialising
      await this.setupAudioContext();

      // Build the FFT analyser
      this.fft = new p5.FFT(0.8, 512);

      // Build the amplitude analyser
      this.amplitude = new p5.Amplitude();

      // Build the procedural deep sea ambience
      this.createGenerativeMusic();

      // Prepare interactive oscillators
      this.setupInteractiveSounds();

      this.isInitialized = true;
      console.log('Audio system ready');

      // Notify sketches that audio is ready
      this.connectToSketch();

    } catch (error) {
      console.error('Audio initialisation failed:', error);
    }
  }

  // Establish the audio context (requires user gesture)
  async setupAudioContext() {
    return new Promise((resolve) => {
      if (getAudioContext().state === 'running') {
        resolve();
      } else {
        userStartAudio().then(() => {
          resolve();
        });
      }
    });
  }

  // Create generative ambience
  createGenerativeMusic() {
    // Layer oscillators to emulate the deep sea
    this.layer1 = new p5.Oscillator('sine');
    this.layer2 = new p5.Oscillator('sine');
    this.layer3 = new p5.Oscillator('sine');
    this.layer4 = new p5.Oscillator('triangle');

    // Low frequency layer
    this.layer1.freq(55);    // A1
    this.layer1.amp(0.15);

    // Lower mid layer
    this.layer2.freq(82.41); // E2
    this.layer2.amp(0.1);

    // Mid layer for harmony
    this.layer3.freq(110);   // A2
    this.layer3.amp(0.08);

    // High harmonic layer
    this.layer4.freq(220);   // A3
    this.layer4.amp(0.05);

    // Add reverberation
    this.reverb = new p5.Reverb();
    this.reverb.process(this.layer1, 6, 3);
    this.reverb.process(this.layer2, 6, 3);
    this.reverb.process(this.layer3, 5, 2);
    this.reverb.process(this.layer4, 4, 2);

    // Start every layer
    this.layer1.start();
    this.layer2.start();
    this.layer3.start();
    this.layer4.start();

    // Modulate frequencies to mimic tides
    this.modulateFrequencies();

    console.log('Generative score initialised');
  }

  // Modulate frequencies to create flow
  modulateFrequencies() {
    setInterval(() => {
      if (!this.isPlaying) return;

      // Slight randomised detuning for natural motion
      let time = millis() / 1000;

      this.layer1.freq(55 + sin(time * 0.1) * 2);
      this.layer2.freq(82.41 + sin(time * 0.15) * 3);
      this.layer3.freq(110 + sin(time * 0.2) * 5);
      this.layer4.freq(220 + sin(time * 0.25) * 8);

      // Amplitude modulation
      this.layer1.amp(0.15 + sin(time * 0.3) * 0.05);
      this.layer2.amp(0.1 + cos(time * 0.4) * 0.03);

    }, 100);
  }

  // Configure interactive audio cues
  setupInteractiveSounds() {
    // Click effect (water droplet)
    this.clickOsc = new p5.Oscillator('sine');
    this.clickOsc.amp(0);
    this.clickOsc.freq(800);
    this.clickOsc.start();

    // Hover effect (soft high tone)
    this.hoverOsc = new p5.Oscillator('sine');
    this.hoverOsc.amp(0);
    this.hoverOsc.freq(1200);
    this.hoverOsc.start();

    console.log('Interactive cues armed');
  }

  // Connect to the active sketch
  connectToSketch() {
    if (typeof window.jellyfishSketch !== 'undefined') {
      window.jellyfishSketch.initAudio(this);
    } else if (typeof initAudio === 'function') {
      initAudio(this);
    }
  }

  // Start background score
  play() {
    if (!this.isInitialized) {
      console.warn('Audio manager not initialised yet');
      return;
    }

    if (this.isPlaying) return;

    // Raise each oscillator
    this.layer1.amp(0.15 * this.volume, 1.0);
    this.layer2.amp(0.1 * this.volume, 1.0);
    this.layer3.amp(0.08 * this.volume, 1.0);
    this.layer4.amp(0.05 * this.volume, 1.0);

    this.isPlaying = true;
    console.log('Audio playback started');
  }

  // Pause background score
  pause() {
    if (!this.isPlaying) return;

    // Fade every oscillator
    this.layer1.amp(0, 1.0);
    this.layer2.amp(0, 1.0);
    this.layer3.amp(0, 1.0);
    this.layer4.amp(0, 1.0);

    this.isPlaying = false;
    console.log('Audio playback paused');
  }

  // Toggle playback state
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Set master volume
  setVolume(vol) {
    this.volume = constrain(vol, 0, 1);

    if (this.isPlaying) {
      this.layer1.amp(0.15 * this.volume, 0.5);
      this.layer2.amp(0.1 * this.volume, 0.5);
      this.layer3.amp(0.08 * this.volume, 0.5);
      this.layer4.amp(0.05 * this.volume, 0.5);
    }
  }

  // Trigger click droplet
  playClickSound() {
    if (!this.isInitialized) return;

    // Fast pitch drop to emulate a droplet
    this.clickOsc.freq(1200, 0);
    this.clickOsc.freq(400, 0.1);
    this.clickOsc.amp(0.3 * this.volume, 0.01);
    this.clickOsc.amp(0, 0.15);
  }

  // Trigger hover tone
  playHoverSound() {
    if (!this.isInitialized) return;

    this.hoverOsc.freq(1500 + random(-100, 100));
    this.hoverOsc.amp(0.1 * this.volume, 0.05);
    this.hoverOsc.amp(0, 0.2);
  }

  // Return FFT spectrum
  getSpectrum() {
    if (this.fft) {
      return this.fft.analyze();
    }
    return [];
  }

  // Return requested band energy
  getEnergy(band) {
    if (this.fft) {
      return this.fft.getEnergy(band);
    }
    return 0;
  }
}

// Global audio manager instance
let audioManager = null;

// Log readiness once the page loads
window.addEventListener('DOMContentLoaded', () => {
  console.log('Audio manager standing by...');
});

// Kick off initialisation once sketches are ready
window.onSketchReady = async function() {
  console.log('Sketch ready, initialising audio...');

  if (!audioManager) {
    audioManager = new AudioManager();
  }

  // Hide loading overlay and reveal welcome screen
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
  }, 500);
};

// Start button handler
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const controlPanel = document.getElementById('control-panel');
  const bottomNav = document.getElementById('bottom-nav');

  startBtn.addEventListener('click', async () => {
    // Initialise the audio system
    if (!audioManager) {
      audioManager = new AudioManager();
    }

    await audioManager.init();
    audioManager.play();

    // Hide welcome overlay
    welcomeScreen.classList.add('hidden');

    // Reveal control panel and navigation
    setTimeout(() => {
      controlPanel.classList.remove('hidden');
      bottomNav.classList.remove('hidden');
    }, 300);
  });

  // Audio toggle button
  const audioToggle = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioStatus = document.getElementById('audio-status');

  audioToggle.addEventListener('click', () => {
    if (!audioManager) return;

    audioManager.toggle();

    if (audioManager.isPlaying) {
      audioIcon.textContent = 'ON';
      audioStatus.textContent = 'Playing';
    } else {
      audioIcon.textContent = 'OFF';
      audioStatus.textContent = 'Paused';
    }
  });

  // Volume slider
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');

  volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value / 100;
    if (audioManager) {
      audioManager.setVolume(vol);
    }
    volumeValue.textContent = e.target.value + '%';
  });

  // Side panel toggle
  const togglePanelBtn = document.getElementById('toggle-panel');
  togglePanelBtn.addEventListener('click', () => {
    controlPanel.classList.toggle('open');
  });
});

// Global helpers for sketches
window.triggerClickSound = function() {
  if (audioManager) {
    audioManager.playClickSound();
  }
};

window.triggerHoverSound = function() {
  if (audioManager) {
    audioManager.playHoverSound();
  }
};
