// 音频管理系统 - 背景音乐 + 交互音效 + 音乐可视化
// 使用 p5.sound.js 实现

class AudioManager {
  constructor() {
    this.bgMusic = null;          // 背景音乐
    this.clickOsc = null;          // 点击音效振荡器
    this.hoverOsc = null;          // 悬停音效振荡器
    this.fft = null;               // FFT 分析器
    this.amplitude = null;         // 振幅分析器
    this.isPlaying = false;
    this.volume = 0.7;             // 默认音量 70%
    this.isInitialized = false;

    // 免费音频资源链接（示例 - 需要替换为实际文件）
    this.musicSources = [
      // 使用免费的海洋氛围音频（Freesound.org）
      // 由于浏览器限制，这里使用振荡器生成环境音
      null // 将使用程序生成音频
    ];
  }

  // 初始化音频系统
  async init() {
    if (this.isInitialized) return;

    try {
      // 等待用户交互后初始化
      await this.setupAudioContext();

      // 创建 FFT 分析器
      this.fft = new p5.FFT(0.8, 512);

      // 创建振幅分析器
      this.amplitude = new p5.Amplitude();

      // 创建程序生成的背景音乐（深海氛围）
      this.createGenerativeMusic();

      // 创建交互音效振荡器
      this.setupInteractiveSounds();

      this.isInitialized = true;
      console.log('✓ 音频系统初始化完成');

      // 通知 sketch 音频已就绪
      this.connectToSketch();

    } catch (error) {
      console.error('音频初始化失败:', error);
    }
  }

  // 设置音频上下文（需要用户交互）
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

  // 创建生成式环境音乐
  createGenerativeMusic() {
    // 创建多层振荡器模拟深海氛围
    this.layer1 = new p5.Oscillator('sine');
    this.layer2 = new p5.Oscillator('sine');
    this.layer3 = new p5.Oscillator('sine');
    this.layer4 = new p5.Oscillator('triangle');

    // 低频层（深海低音）
    this.layer1.freq(55);    // A1
    this.layer1.amp(0.15);

    // 中低频层
    this.layer2.freq(82.41); // E2
    this.layer2.amp(0.1);

    // 中频层（和声）
    this.layer3.freq(110);   // A2
    this.layer3.amp(0.08);

    // 高频层（泛音）
    this.layer4.freq(220);   // A3
    this.layer4.amp(0.05);

    // 添加混响效果
    this.reverb = new p5.Reverb();
    this.reverb.process(this.layer1, 6, 3);
    this.reverb.process(this.layer2, 6, 3);
    this.reverb.process(this.layer3, 5, 2);
    this.reverb.process(this.layer4, 4, 2);

    // 启动所有层
    this.layer1.start();
    this.layer2.start();
    this.layer3.start();
    this.layer4.start();

    // 动态调制频率（模拟海浪）
    this.modulateFrequencies();

    console.log('✓ 生成式音乐已创建');
  }

  // 动态调制频率（创造流动感）
  modulateFrequencies() {
    setInterval(() => {
      if (!this.isPlaying) return;

      // 随机微调频率，创造自然变化
      let time = millis() / 1000;

      this.layer1.freq(55 + sin(time * 0.1) * 2);
      this.layer2.freq(82.41 + sin(time * 0.15) * 3);
      this.layer3.freq(110 + sin(time * 0.2) * 5);
      this.layer4.freq(220 + sin(time * 0.25) * 8);

      // 振幅调制
      this.layer1.amp(0.15 + sin(time * 0.3) * 0.05);
      this.layer2.amp(0.1 + cos(time * 0.4) * 0.03);

    }, 100);
  }

  // 设置交互音效
  setupInteractiveSounds() {
    // 点击音效（水滴声）
    this.clickOsc = new p5.Oscillator('sine');
    this.clickOsc.amp(0);
    this.clickOsc.freq(800);
    this.clickOsc.start();

    // 悬停音效（柔和高音）
    this.hoverOsc = new p5.Oscillator('sine');
    this.hoverOsc.amp(0);
    this.hoverOsc.freq(1200);
    this.hoverOsc.start();

    console.log('✓ 交互音效已设置');
  }

  // 连接到当前 sketch
  connectToSketch() {
    if (typeof window.jellyfishSketch !== 'undefined') {
      window.jellyfishSketch.initAudio(this);
    } else if (typeof initAudio === 'function') {
      initAudio(this);
    }
  }

  // 播放背景音乐
  play() {
    if (!this.isInitialized) {
      console.warn('音频系统尚未初始化');
      return;
    }

    if (this.isPlaying) return;

    // 启动所有音频层
    this.layer1.amp(0.15 * this.volume, 1.0);
    this.layer2.amp(0.1 * this.volume, 1.0);
    this.layer3.amp(0.08 * this.volume, 1.0);
    this.layer4.amp(0.05 * this.volume, 1.0);

    this.isPlaying = true;
    console.log('▶ 音乐播放中');
  }

  // 暂停背景音乐
  pause() {
    if (!this.isPlaying) return;

    // 淡出所有层
    this.layer1.amp(0, 1.0);
    this.layer2.amp(0, 1.0);
    this.layer3.amp(0, 1.0);
    this.layer4.amp(0, 1.0);

    this.isPlaying = false;
    console.log('⏸ 音乐已暂停');
  }

  // 切换播放/暂停
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 设置音量
  setVolume(vol) {
    this.volume = constrain(vol, 0, 1);

    if (this.isPlaying) {
      this.layer1.amp(0.15 * this.volume, 0.5);
      this.layer2.amp(0.1 * this.volume, 0.5);
      this.layer3.amp(0.08 * this.volume, 0.5);
      this.layer4.amp(0.05 * this.volume, 0.5);
    }
  }

  // 触发点击音效（水滴）
  playClickSound() {
    if (!this.isInitialized) return;

    // 快速音高下降模拟水滴
    this.clickOsc.freq(1200, 0);
    this.clickOsc.freq(400, 0.1);
    this.clickOsc.amp(0.3 * this.volume, 0.01);
    this.clickOsc.amp(0, 0.15);
  }

  // 触发悬停音效
  playHoverSound() {
    if (!this.isInitialized) return;

    this.hoverOsc.freq(1500 + random(-100, 100));
    this.hoverOsc.amp(0.1 * this.volume, 0.05);
    this.hoverOsc.amp(0, 0.2);
  }

  // 获取频谱数据
  getSpectrum() {
    if (this.fft) {
      return this.fft.analyze();
    }
    return [];
  }

  // 获取特定频段能量
  getEnergy(band) {
    if (this.fft) {
      return this.fft.getEnergy(band);
    }
    return 0;
  }
}

// 全局音频管理器实例
let audioManager = null;

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
  console.log('音频管理器准备中...');
});

// 在 sketch 准备好之后初始化音频
window.onSketchReady = async function() {
  console.log('Sketch 已准备，初始化音频...');

  if (!audioManager) {
    audioManager = new AudioManager();
  }

  // 隐藏加载屏幕，显示欢迎屏幕
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('welcome-screen').classList.remove('hidden');
  }, 500);
};

// 开始按钮点击事件
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const controlPanel = document.getElementById('control-panel');
  const bottomNav = document.getElementById('bottom-nav');

  startBtn.addEventListener('click', async () => {
    // 初始化音频系统
    if (!audioManager) {
      audioManager = new AudioManager();
    }

    await audioManager.init();
    audioManager.play();

    // 隐藏欢迎屏幕
    welcomeScreen.classList.add('hidden');

    // 显示控制面板和导航
    setTimeout(() => {
      controlPanel.classList.remove('hidden');
      bottomNav.classList.remove('hidden');
    }, 300);
  });

  // 音频控制按钮
  const audioToggle = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const audioStatus = document.getElementById('audio-status');

  audioToggle.addEventListener('click', () => {
    if (!audioManager) return;

    audioManager.toggle();

    if (audioManager.isPlaying) {
      audioIcon.textContent = '🔊';
      audioStatus.textContent = '播放中';
    } else {
      audioIcon.textContent = '🔇';
      audioStatus.textContent = '已暂停';
    }
  });

  // 音量滑块
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');

  volumeSlider.addEventListener('input', (e) => {
    const vol = e.target.value / 100;
    if (audioManager) {
      audioManager.setVolume(vol);
    }
    volumeValue.textContent = e.target.value + '%';
  });

  // 侧边面板切换
  const togglePanelBtn = document.getElementById('toggle-panel');
  togglePanelBtn.addEventListener('click', () => {
    controlPanel.classList.toggle('open');
  });
});

// 全局函数供 sketch 调用
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
