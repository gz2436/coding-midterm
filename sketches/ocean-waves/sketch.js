// Ocean wave rhythms - sine wave animation
// Layered waves driven by audio energy

let waves = [];
let particles = [];
let audioReady = false;
let fft, amplitude;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');

  // Create layered waves
  createWaves();

  // Create splash particles
  for (let i = 0; i < 100; i++) {
    particles.push(new WaterParticle());
  }

  if (typeof window.onSketchReady === 'function') {
    window.onSketchReady();
  }
}

function createWaves() {
  waves = [];

  // Five wave layers from far to near
  let layers = [
    { y: 0.3, amplitude: 30, speed: 0.01, color: [100, 150, 200, 100] },
    { y: 0.45, amplitude: 40, speed: 0.015, color: [80, 130, 180, 120] },
    { y: 0.6, amplitude: 50, speed: 0.02, color: [60, 110, 160, 150] },
    { y: 0.75, amplitude: 60, speed: 0.025, color: [40, 90, 140, 180] },
    { y: 0.9, amplitude: 70, speed: 0.03, color: [20, 70, 120, 200] }
  ];

  layers.forEach(layer => {
    waves.push(new Wave(layer));
  });
}

function initAudio(audioManager) {
  if (audioManager && audioManager.fft && audioManager.amplitude) {
    fft = audioManager.fft;
    amplitude = audioManager.amplitude;
    audioReady = true;
    console.log('Ocean waves sketch connected to audio');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createWaves();
}

function draw() {
  // Sky to ocean gradient
  setGradient(0, 0, width, height,
    color(135, 206, 235),  // Sky blue
    color(0, 105, 148));    // Deep sea blue

  // Sample audio energy
  let bassEnergy = 0;
  let trebleEnergy = 0;
  if (audioReady && fft) {
    bassEnergy = fft.getEnergy("bass") / 255.0;
    trebleEnergy = fft.getEnergy("treble") / 255.0;
  }

  // Render waves from back to front
  waves.forEach(wave => {
    wave.update(bassEnergy);
    wave.display();
  });

  // Render particles
  particles.forEach(particle => {
    particle.update(trebleEnergy);
    particle.display();
  });

  // Mouse interaction: create ripples
  if (mouseIsPressed) {
    createRipple(mouseX, mouseY);
  }

  // Display interaction prompt
  if (frameCount < 180) {
    displayHint();
  }
}

// Wave class
class Wave {
  constructor(config) {
    this.baseY = height * config.y;
    this.amplitude = config.amplitude;
    this.speed = config.speed;
    this.color = config.color;
    this.offset = random(1000);
    this.points = [];
    this.resolution = 10; // Point spacing
  }

  update(audioEnergy) {
    this.offset += this.speed;

    // Boost amplitude with audio
    let enhancedAmplitude = this.amplitude * (1 + audioEnergy * 0.5);

    // Calculate wave vertices
    this.points = [];
    for (let x = -this.resolution; x <= width + this.resolution; x += this.resolution) {
      let angle = this.offset + x * 0.01;
      let y = this.baseY + sin(angle) * enhancedAmplitude;

      // Add secondary harmonic for organic motion
      y += sin(angle * 2 + this.offset * 2) * enhancedAmplitude * 0.3;

      this.points.push({ x, y });
    }
  }

  display() {
    push();

    // Draw wave fill
    fill(this.color[0], this.color[1], this.color[2], this.color[3]);
    noStroke();

    beginShape();
    vertex(-10, height + 10);

    // Trace crest curve
    this.points.forEach(p => {
      vertex(p.x, p.y);
    });

    vertex(width + 10, height + 10);
    endShape(CLOSE);

    // Add crest highlight
    if (this.color[3] > 150) {
      stroke(255, 255, 255, 100);
      strokeWeight(2);
      noFill();

      beginShape();
      this.points.forEach(p => {
        curveVertex(p.x, p.y - 2);
      });
      endShape();
    }

    pop();
  }
}

// Splash particle class
class WaterParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height * 0.5, height);
    this.size = random(2, 6);
    this.vx = random(-1, 1);
    this.vy = random(-2, -0.5);
    this.alpha = random(100, 255);
    this.life = 255;
  }

  update(audioEnergy) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // Gravity
    this.life -= 2;

    // Audio adds extra particles
    if (audioEnergy > 0.5 && random() < 0.1) {
      this.life = 255;
      this.y = random(height * 0.6, height);
    }

    if (this.life <= 0 || this.y > height) {
      this.reset();
    }
  }

  display() {
    push();
    noStroke();
    fill(255, 255, 255, this.alpha * (this.life / 255));
    ellipse(this.x, this.y, this.size);
    pop();
  }
}

// Create ripple effect
let ripples = [];

function createRipple(x, y) {
  if (frameCount % 5 === 0) {
    ripples.push({ x, y, radius: 0, alpha: 255 });
  }

  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.radius += 3;
    r.alpha -= 5;

    push();
    noFill();
    stroke(255, 255, 255, r.alpha);
    strokeWeight(2);
    ellipse(r.x, r.y, r.radius * 2);
    pop();

    if (r.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}

// Display interaction prompt
function displayHint() {
  push();
  textAlign(CENTER, CENTER);
  textSize(16);
  fill(255, 255, 255, map(sin(frameCount * 0.05), -1, 1, 100, 200));
  noStroke();
  text('Click or drag to create ripples', width / 2, height * 0.1);
  pop();
}

// Gradient background
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function mousePressed() {
  if (typeof window.triggerClickSound === 'function') {
    window.triggerClickSound();
  }
  return false;
}

function mouseDragged() {
  createRipple(mouseX, mouseY);
  return false;
}

// Keyboard controls
function keyPressed() {
  if (key === 'r' || key === 'R') {
    // Reset waves
    createWaves();
  }
  return false;
}

// Export
if (typeof window !== 'undefined') {
  window.oceanWavesSketch = { initAudio };
}
