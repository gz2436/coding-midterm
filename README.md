# Ocean Dreams - Interactive Art Gallery

Ocean Dreams is an interactive p5.js art gallery that explores the rhythm of the ocean through sound, particles, and generative visuals. The project features three immersive sketches that celebrate marine conservation through procedural graphics and responsive audio.

## Overview

The gallery ships with three fully interactive experiences:

1. **Jellyfish Particle System** - 20,000 glowing particles forming drifting jellyfish
2. **Coral Reef Ecosystem** - A living reef with swimming fish and rising bubbles
3. **Ocean Wave Patterns** - Layered sine waves reacting to the soundtrack

Each sketch offers:
- Audio-reactive animation driven by p5.sound
- Real-time interaction for mouse, keyboard, and touch
- Procedural visuals so every session feels unique

## Feature Highlights

### Audio
- Generative deep-sea ambience composed from layered oscillators
- FFT analysis for spectral driven visuals
- Interactive hover and click cues
- Volume control and play/pause toggle

### Visuals
- Full screen immersive presentation
- Audio-influenced colour palettes and motion
- Particle systems and fluid-inspired animation
- Responsive layout for desktop, tablet, and mobile

### Interaction
- Mouse or touch motion to disturb the scene
- Click or tap to launch sound effects
- Keyboard shortcuts for navigation and resets
- Swipe gestures on mobile for sketch switching

## Project Structure

```
coding-mid/
|-- index.html              # Landing page with intro sketch
|-- about.html              # Conservation message and resources
|-- coral.html              # Coral reef sketch shell
|-- jellyfish.html          # Jellyfish sketch shell
|-- waves.html              # Ocean waves sketch shell
|-- css/
|   `-- style.css           # Shared styling and layout
|-- data/
|   `-- sketches.json       # Metadata for dynamic navigation
|-- js/
|   |-- audio.js            # Audio manager and UI bindings
|   `-- navigation.js       # Sketch navigation helpers
|-- sketches/
|   |-- coral/sketch.js     # Coral reef p5 sketch
|   |-- jellyfish/sketch.js # Jellyfish p5 sketch
|   `-- ocean-waves/sketch.js
`-- start.sh                # Local development helper
```

## Getting Started

### Local Preview

Most browsers block file-based audio contexts, so run a local server from the project root:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

Other options:

```bash
# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Deployment

The site is fully static and works on GitHub Pages, Netlify, Vercel, or any static host. For GitHub Pages, deploy the `main` branch and serve the repository root.

## Controls

### Global
- Mouse move or touch drag: influence particles and lighting
- Click or tap: trigger chimes or ripples
- Arrow keys: move between sketches (where navigation is enabled)
- Volume slider: adjust soundtrack gain

### Jellyfish Particle System
- Space: cycle colour palettes
- Click: emit a shimmer burst

### Coral Reef Ecosystem
- Click and hold: attract nearby fish schools

### Ocean Wave Patterns
- Click or drag: create temporary ripples
- R: reset the wave field

## Custom Audio

The default soundtrack is generated with oscillators and reverb. To swap in your own loop:

1. Place an MP3 or WAV file inside `assets/audio/`
2. Replace the generative block in `js/audio.js` with `loadSound`
3. Call `loop()` on the loaded sound and adjust volume to taste

Suggested royalty-free sources: [Freesound](https://freesound.org/), [Pixabay Music](https://pixabay.com/music/), and [ccMixter](https://ccmixter.org/).

## Ocean Conservation

> The ocean covers 71% of our planet. Safeguarding marine ecosystems protects every community on Earth.

Learn more:
- [World Wildlife Fund - Ocean Conservation](https://www.worldwildlife.org/initiatives/oceans)
- [United Nations SDG 14 - Life Below Water](https://sdgs.un.org/goals/goal14)

## Tech Stack

- [p5.js 1.9.0](https://p5js.org/) for creative coding
- [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) for audio synthesis and analysis
- HTML5 and CSS3 for layout and styling
- Vanilla JavaScript for orchestration

## License

Released under the MIT License. See `LICENSE` if you add one, or adapt the text to suit your coursework requirements.
