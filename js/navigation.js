// Navigation and sketch switching system

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
    // Thumbnail click handlers
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.switchToSketch(index);
      });

      // Hover sound cue
      thumb.addEventListener('mouseenter', () => {
        if (typeof window.triggerHoverSound === 'function') {
          window.triggerHoverSound();
        }
      });
    });

    // Previous and next buttons
    const prevBtn = document.getElementById('nav-prev');
    const nextBtn = document.getElementById('nav-next');

    prevBtn.addEventListener('click', () => {
      this.previousSketch();
    });

    nextBtn.addEventListener('click', () => {
      this.nextSketch();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSketch();
      } else if (e.key === 'ArrowRight') {
        this.nextSketch();
      }
    });

    // Touch swipe support (mobile)
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
          // Swipe left - next sketch
          this.nextSketch();
        } else {
          // Swipe right - previous sketch
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

    // Fade out the current sketch
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.style.transition = 'opacity 0.5s';
    canvasContainer.style.opacity = '0';

    setTimeout(() => {
      // Remove the previous sketch script
      this.removeCurrentSketch();

      // Update the current index
      this.currentIndex = index;
      window.currentSketchIndex = index;

      // Load the next sketch
      this.loadSketch(index);

      // Refresh UI state
      this.updateUI();

      // Fade back in
      setTimeout(() => {
        canvasContainer.style.opacity = '1';
        this.isTransitioning = false;
      }, 100);

    }, 500);
  }

  removeCurrentSketch() {
    // Remove any existing p5 instance
    if (window.remove && typeof window.remove === 'function') {
      window.remove();
    }

    // Clear the canvas container
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer.innerHTML = '';

    // Remove the previous sketch script
    const oldScript = document.querySelector('script[data-sketch-script]');
    if (oldScript) {
      oldScript.remove();
    }
  }

  loadSketch(index) {
    const sketch = this.sketches[index];
    if (!sketch) return;

    // Dynamically load the sketch script
    const script = document.createElement('script');
    script.src = sketch.script;
    script.setAttribute('data-sketch-script', 'true');
    script.onload = () => {
      console.log(`Loaded sketch: ${sketch.title}`);

      // Reconnect the shared audio manager
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

    // Highlight the active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      if (index === this.currentIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });

    // Update sidebar copy
    const sketchTitle = document.getElementById('sketch-title');
    const sketchDescription = document.getElementById('sketch-description');

    if (sketch) {
      sketchTitle.textContent = sketch.title;
      sketchDescription.textContent = sketch.description;
    }
  }
}

// Instantiate navigation after load
let navigationManager = null;

document.addEventListener('DOMContentLoaded', () => {
  // Delay navigation setup until the start button is pressed
  const startBtn = document.getElementById('start-btn');
  const originalClickHandler = startBtn.onclick;

  startBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (!navigationManager) {
        navigationManager = new NavigationManager();
        console.log('Navigation system initialised');
      }
    }, 500);
  });
});

// Expose the class globally
if (typeof window !== 'undefined') {
  window.NavigationManager = NavigationManager;
}
