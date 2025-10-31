// Floating Jellyfish - Elegant Ocean Creatures
// Multiple jellyfish drifting gracefully through the ocean

let jellyfish = [];
let jellyfishCount = 5;

// Music variables
let osc1, osc2, osc3, reverb;
let musicPlaying = false;
let musicBtn;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');

  // Create jellyfish
  for (let i = 0; i < jellyfishCount; i++) {
    jellyfish.push(new Jellyfish());
  }

  // Setup music
  setupMusic();
  musicBtn = document.getElementById('music-btn');
  musicBtn.addEventListener('click', toggleMusic);

  // Initialize feather icons
  feather.replace();

  // Auto-play music after a short delay
  setTimeout(() => {
    if (!musicPlaying) {
      toggleMusic();
    }
  }, 500);
}

function setupMusic() {
  osc1 = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('sine');
  osc3 = new p5.Oscillator('triangle');

  osc1.freq(110);  // Deep tone
  osc2.freq(165);  // Mid tone
  osc3.freq(220);  // Higher harmonic

  osc1.amp(0);
  osc2.amp(0);
  osc3.amp(0);

  reverb = new p5.Reverb();
  reverb.process(osc1, 8, 4);
  reverb.process(osc2, 6, 3);
  reverb.process(osc3, 5, 2);

  osc1.start();
  osc2.start();
  osc3.start();

  setInterval(() => {
    if (musicPlaying) {
      let t = millis() / 1000;
      osc1.freq(110 + sin(t * 0.1) * 3);
      osc2.freq(165 + sin(t * 0.15) * 5);
      osc3.freq(220 + sin(t * 0.2) * 8);
    }
  }, 100);
}

function toggleMusic() {
  userStartAudio();

  if (musicPlaying) {
    osc1.amp(0, 1);
    osc2.amp(0, 1);
    osc3.amp(0, 1);
    musicBtn.innerHTML = '<i data-feather="volume-x"></i>';
    musicBtn.classList.remove('playing');
    musicPlaying = false;
    feather.replace();
  } else {
    osc1.amp(0.08, 1);
    osc2.amp(0.05, 1);
    osc3.amp(0.03, 1);
    musicBtn.innerHTML = '<i data-feather="volume-2"></i>';
    musicBtn.classList.add('playing');
    musicPlaying = true;
    feather.replace();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Ocean gradient background
  setGradient(0, 0, width, height,
    color(5, 20, 50),   // Deep blue
    color(10, 35, 80)); // Lighter blue

  // Update and draw jellyfish
  jellyfish.forEach(jelly => {
    jelly.update();
    jelly.display();
  });
}

// Jellyfish class
class Jellyfish {
  constructor() {
    this.reset();
    this.bodySize = random(60, 120);
    this.tentacleCount = floor(random(8, 16));
    this.tentacles = [];

    // Color variations
    this.hue = random([180, 200, 270, 300, 320]); // Cyan, blue, purple, pink
    this.alpha = random(150, 220);

    // Create tentacles
    for (let i = 0; i < this.tentacleCount; i++) {
      this.tentacles.push({
        angle: map(i, 0, this.tentacleCount, -PI/2, PI/2),
        length: random(this.bodySize * 2, this.bodySize * 4),
        segments: floor(random(15, 25)),
        offset: random(TWO_PI)
      });
    }
  }

  reset() {
    this.x = random(width);
    this.y = random(-200, height + 200);
    this.vy = random(0.3, 0.8);  // Upward drift
    this.vx = random(-0.3, 0.3); // Horizontal drift
    this.pulsePhase = random(TWO_PI);
    this.pulseSpeed = random(0.02, 0.04);
  }

  update() {
    // Drift movement
    this.y -= this.vy;
    this.x += this.vx;

    // Gentle horizontal sway
    this.x += sin(frameCount * 0.01 + this.pulsePhase) * 0.5;

    // Reset when out of bounds
    if (this.y < -200) {
      this.y = height + 100;
      this.x = random(width);
    }
    if (this.x < -100) this.x = width + 100;
    if (this.x > width + 100) this.x = -100;
  }

  display() {
    push();
    translate(this.x, this.y);

    // Pulsing animation
    let pulse = sin(frameCount * this.pulseSpeed + this.pulsePhase);
    let bodyScale = map(pulse, -1, 1, 0.9, 1.1);

    // Draw tentacles first (behind body)
    this.tentacles.forEach(tent => {
      this.drawTentacle(tent, pulse);
    });

    // Draw jellyfish body (bell/umbrella shape)
    this.drawBody(bodyScale);

    pop();
  }

  drawBody(scale) {
    // Main body with gradient glow
    for (let i = 0; i < 3; i++) {
      let size = this.bodySize * scale * (1 - i * 0.15);
      let alpha = this.alpha * (1 - i * 0.3);

      colorMode(HSB, 360, 100, 100, 255);
      fill(this.hue, 70 - i * 10, 80, alpha);
      noStroke();

      // Umbrella shape (bezier curve)
      beginShape();
      for (let angle = PI; angle <= TWO_PI; angle += 0.1) {
        let r = size * (1 + sin(angle * 2) * 0.1);
        let x = cos(angle) * r;
        let y = sin(angle) * r * 0.6; // Flatten the bottom
        vertex(x, y);
      }
      endShape(CLOSE);
    }

    // Inner glow
    for (let i = 0; i < 5; i++) {
      let size = this.bodySize * scale * 0.3 * (1 - i * 0.15);
      let alpha = 150 * (1 - i * 0.2);
      fill(this.hue, 90, 100, alpha);
      ellipse(0, -this.bodySize * 0.1, size, size * 0.8);
    }

    colorMode(RGB, 255);
  }

  drawTentacle(tent, pulse) {
    push();

    colorMode(HSB, 360, 100, 100, 255);
    stroke(this.hue, 60, 90, this.alpha * 0.7);
    strokeWeight(2);
    noFill();

    let segmentLength = tent.length / tent.segments;

    beginShape();

    // Start point at body edge
    let startX = cos(tent.angle) * this.bodySize * 0.5;
    let startY = sin(tent.angle) * this.bodySize * 0.3;
    vertex(startX, startY);

    // Draw flowing tentacle
    for (let i = 0; i <= tent.segments; i++) {
      let t = i / tent.segments;

      // Gradually angle downward
      let angle = tent.angle + t * PI * 0.5;

      // Wave motion along tentacle
      let wave = sin(frameCount * 0.05 + tent.offset + i * 0.3) *
                 segmentLength * 0.8 * t;

      // Position
      let x = startX + cos(angle) * segmentLength * i + wave;
      let y = startY + sin(angle) * segmentLength * i;

      curveVertex(x, y);
    }

    endShape();

    colorMode(RGB, 255);
    pop();
  }
}

// Gradient background helper
function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}
