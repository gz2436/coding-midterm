// 珊瑚礁生态系统 - 生成艺术
// 模拟色彩斑斓的珊瑚礁和游动的鱼群

let corals = [];
let fishes = [];
let bubbles = [];
let audioReady = false;
let fft, amplitude;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');

  // 生成珊瑚
  generateCorals();

  // 生成鱼群
  for (let i = 0; i < 15; i++) {
    fishes.push(new Fish());
  }

  // 生成气泡
  for (let i = 0; i < 30; i++) {
    bubbles.push(new Bubble());
  }

  if (typeof window.onSketchReady === 'function') {
    window.onSketchReady();
  }
}

function initAudio(audioManager) {
  if (audioManager && audioManager.fft && audioManager.amplitude) {
    fft = audioManager.fft;
    amplitude = audioManager.amplitude;
    audioReady = true;
    console.log('✓ 珊瑚礁作品：音频已连接');
  }
}

function generateCorals() {
  // 在底部生成多组珊瑚
  let positions = [0.2, 0.35, 0.5, 0.65, 0.8];

  positions.forEach(pos => {
    let x = width * pos;
    let baseY = height * 0.8;

    // 每个位置生成 2-4 个珊瑚
    let count = floor(random(2, 5));
    for (let i = 0; i < count; i++) {
      corals.push(new Coral(x + random(-50, 50), baseY, random(0, 360)));
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  corals = [];
  generateCorals();
}

function draw() {
  // 海洋渐变背景
  setGradient(0, 0, width, height,
    color(15, 76, 129),
    color(3, 34, 76));

  // 获取音频能量
  let bassEnergy = 0;
  let midEnergy = 0;
  if (audioReady && fft) {
    bassEnergy = fft.getEnergy("bass") / 255.0;
    midEnergy = fft.getEnergy("mid") / 255.0;
  }

  // 绘制珊瑚
  corals.forEach(coral => {
    coral.display(bassEnergy);
  });

  // 更新和绘制气泡
  bubbles.forEach(bubble => {
    bubble.update(midEnergy);
    bubble.display();
  });

  // 更新和绘制鱼
  fishes.forEach(fish => {
    fish.update();
    fish.display();
  });

  // 鼠标交互：吸引鱼群
  if (mouseIsPressed) {
    fishes.forEach(fish => {
      fish.attractTo(mouseX, mouseY);
    });
  }
}

// 珊瑚类
class Coral {
  constructor(x, y, hue) {
    this.x = x;
    this.baseY = y;
    this.hue = hue;
    this.branches = [];
    this.generateBranches();
  }

  generateBranches() {
    let branchCount = floor(random(3, 7));
    for (let i = 0; i < branchCount; i++) {
      this.branches.push({
        angle: random(-PI/3, PI/3),
        length: random(30, 80),
        width: random(5, 15),
        segments: floor(random(3, 6))
      });
    }
  }

  display(audioEnergy) {
    push();
    translate(this.x, this.baseY);

    this.branches.forEach((branch, i) => {
      push();

      // 音频驱动摇摆
      let sway = sin(frameCount * 0.02 + i) * 5;
      sway += audioEnergy * 10;
      rotate(branch.angle + radians(sway));

      // 绘制分支（逐渐变细）
      for (let seg = 0; seg < branch.segments; seg++) {
        let t = seg / branch.segments;
        let segLength = branch.length / branch.segments;
        let segWidth = branch.width * (1 - t * 0.7);

        // 颜色渐变
        let c = color((this.hue + seg * 20) % 360, 80, 70);
        fill(c);
        noStroke();

        ellipse(0, -segLength/2, segWidth, segLength * 1.2);
        translate(0, -segLength);

        // 添加小触须
        if (seg === branch.segments - 1) {
          for (let k = 0; k < 3; k++) {
            push();
            rotate(random(-PI/4, PI/4));
            fill((this.hue + 30) % 360, 90, 80);
            ellipse(0, -10, 3, 15);
            pop();
          }
        }
      }
      pop();
    });
    pop();
  }
}

// 鱼类
class Fish {
  constructor() {
    this.reset();
    this.hue = random(0, 360);
  }

  reset() {
    this.x = random(-50, width + 50);
    this.y = random(height * 0.1, height * 0.7);
    this.vx = random(1, 3) * (random() > 0.5 ? 1 : -1);
    this.vy = random(-0.5, 0.5);
    this.size = random(15, 35);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 边界检测
    if (this.x < -100 || this.x > width + 100) {
      this.reset();
    }

    // 轻微的上下波动
    this.vy += random(-0.1, 0.1);
    this.vy = constrain(this.vy, -1, 1);
  }

  attractTo(tx, ty) {
    let dx = tx - this.x;
    let dy = ty - this.y;
    let dist = sqrt(dx * dx + dy * dy);

    if (dist < 200 && dist > 10) {
      this.vx += dx / dist * 0.1;
      this.vy += dy / dist * 0.1;
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    // 鱼朝向运动方向
    let angle = atan2(this.vy, this.vx);
    rotate(angle);

    // 鱼身体
    fill(this.hue, 80, 90);
    noStroke();
    ellipse(0, 0, this.size, this.size * 0.6);

    // 尾巴
    fill(this.hue, 70, 80);
    triangle(
      -this.size * 0.5, 0,
      -this.size * 0.9, -this.size * 0.3,
      -this.size * 0.9, this.size * 0.3
    );

    // 眼睛
    fill(255);
    ellipse(this.size * 0.3, 0, this.size * 0.15);
    fill(0);
    ellipse(this.size * 0.32, 0, this.size * 0.08);

    pop();
  }
}

// 气泡类
class Bubble {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = height + 10;
    this.size = random(3, 12);
    this.speed = random(0.5, 2);
  }

  update(audioEnergy) {
    this.y -= this.speed + audioEnergy * 2;
    this.x += sin(frameCount * 0.02 + this.y * 0.01) * 0.5;

    if (this.y < -20) {
      this.reset();
    }
  }

  display() {
    push();
    noFill();
    stroke(255, 255, 255, 150);
    strokeWeight(1.5);
    ellipse(this.x, this.y, this.size);

    // 高光
    noStroke();
    fill(255, 255, 255, 200);
    ellipse(this.x - this.size * 0.2, this.y - this.size * 0.2, this.size * 0.3);
    pop();
  }
}

// 渐变背景辅助函数
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

// 导出
if (typeof window !== 'undefined') {
  window.coralSketch = { initAudio };
}
