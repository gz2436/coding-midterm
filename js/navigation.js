// 导航和作品切换系统

class NavigationManager {
  constructor() {
    this.currentIndex = 0;
    this.sketches = window.SKETCHES_CONFIG || [];
    this.isTransitioning = false;
    this.currentSketchInstance = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // 缩略图点击
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.switchToSketch(index);
      });

      // 悬停音效
      thumb.addEventListener('mouseenter', () => {
        if (typeof window.triggerHoverSound === 'function') {
          window.triggerHoverSound();
        }
      });
    });

    // 左右按钮
    const prevBtn = document.getElementById('nav-prev');
    const nextBtn = document.getElementById('nav-next');

    prevBtn.addEventListener('click', () => {
      this.previousSketch();
    });

    nextBtn.addEventListener('click', () => {
      this.nextSketch();
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSketch();
      } else if (e.key === 'ArrowRight') {
        this.nextSketch();
      }
    });

    // 触摸滑动支持（移动端）
    this.setupTouchNavigation();
  }

  setupTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;

    const canvas = document.getElementById('canvas-container');

    canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // 向左滑动 - 下一个
          this.nextSketch();
        } else {
          // 向右滑动 - 上一个
          this.previousSketch();
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }

  switchToSketch(index) {
    if (this.isTransitioning) return;
    if (index === this.currentIndex) return;
    if (index < 0 || index >= this.sketches.length) return;

    this.isTransitioning = true;

    // 淡出效果
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.transition = 'opacity 0.5s';
    canvasContainer.style.opacity = '0';

    setTimeout(() => {
      // 移除旧的 sketch 脚本
      this.removeCurrentSketch();

      // 更新索引
      this.currentIndex = index;
      window.currentSketchIndex = index;

      // 加载新的 sketch
      this.loadSketch(index);

      // 更新 UI
      this.updateUI();

      // 淡入
      setTimeout(() => {
        canvasContainer.style.opacity = '1';
        this.isTransitioning = false;
      }, 100);

    }, 500);
  }

  removeCurrentSketch() {
    // 移除所有 p5 实例
    if (window.remove && typeof window.remove === 'function') {
      window.remove();
    }

    // 清空画布容器
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.innerHTML = '';

    // 移除旧的 sketch 脚本
    const oldScript = document.querySelector('script[data-sketch-script]');
    if (oldScript) {
      oldScript.remove();
    }
  }

  loadSketch(index) {
    const sketch = this.sketches[index];
    if (!sketch) return;

    // 动态加载 sketch 脚本
    const script = document.createElement('script');
    script.src = sketch.script;
    script.setAttribute('data-sketch-script', 'true');
    script.onload = () => {
      console.log(`✓ 已加载作品: ${sketch.title}`);

      // 重新连接音频
      setTimeout(() => {
        if (audioManager && audioManager.isInitialized) {
          audioManager.connectToSketch();
        }
      }, 500);
    };
    document.body.appendChild(script);
  }

  nextSketch() {
    const nextIndex = (this.currentIndex + 1) % this.sketches.length;
    this.switchToSketch(nextIndex);
  }

  previousSketch() {
    const prevIndex = (this.currentIndex - 1 + this.sketches.length) % this.sketches.length;
    this.switchToSketch(prevIndex);
  }

  updateUI() {
    const sketch = this.sketches[this.currentIndex];

    // 更新缩略图激活状态
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      if (index === this.currentIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });

    // 更新侧边栏信息
    const sketchTitle = document.getElementById('sketch-title');
    const sketchDescription = document.getElementById('sketch-description');

    if (sketch) {
      sketchTitle.textContent = sketch.title;
      sketchDescription.textContent = sketch.description;
    }
  }
}

// 页面加载完成后初始化导航
let navigationManager = null;

document.addEventListener('DOMContentLoaded', () => {
  // 延迟初始化导航，等待用户点击开始
  const startBtn = document.getElementById('start-btn');
  const originalClickHandler = startBtn.onclick;

  startBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (!navigationManager) {
        navigationManager = new NavigationManager();
        console.log('✓ 导航系统已初始化');
      }
    }, 500);
  });
});

// 导出供外部使用
if (typeof window !== 'undefined') {
  window.NavigationManager = NavigationManager;
}
