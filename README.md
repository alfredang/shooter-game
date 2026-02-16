# Space Paw Shooter

A top-down space shooter built with HTML5 Canvas. Pilot a cat ship through a starfield, blast aliens, and survive as long as you can.

**Play now:** [alfredang.github.io/space-paw-shooter](https://alfredang.github.io/space-paw-shooter/)

## How to Play

1. Press **Space** to start
2. Use **Arrow Keys** to move your ship
3. Press **Space** to shoot
4. Destroy aliens to earn points (+100 each)
5. Avoid collisions — you have 3 lives

## Controls

| Action | Input |
|--------|-------|
| Move | Arrow Keys |
| Shoot | Space |
| Start / Restart | Space |

## Features

- Cat-shaped player ship with ears and eyes
- Green alien enemies with antennas
- Scrolling starfield background
- Increasing difficulty as enemies spawn randomly
- 3-life system with game over and restart

## Tech Stack

- HTML5 Canvas
- Vanilla JavaScript
- CSS3

## Project Structure

```
├── index.html   # Entry point
├── game.js      # Game loop, rendering, collision, and input
├── style.css    # Layout and styling
└── .github/workflows/deploy-pages.yml  # GitHub Pages CI/CD
```

## Running Locally

No build step required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
```

## License

MIT
