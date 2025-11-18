# ship-wreck
A simple Battleship project submitted for The Odin Project course.

> [!TIP]
> Need help setting up TailwindCSS with Webpack?
> Check out this [detailed guide](https://gist.github.com/mkgp-dev/66d2f158057c539dad55c24804f66f82) for step-by-step instructions or use my [boilerplate](https://github.com/mkgp-dev/webpack-tailwindcss-v4-boilerplate).

## Features
- Responsive UI built with [TailwindCSS](https://tailwindcss.com) for clean layouts and smooth transitions
- Drag-and-drop ship placement with live previews, boundary checks, and orientation switching
- CPU opponent with basic attack logic, avoiding repeated shots and following up on successful hits
- Random ship placement for both player and CPU with collision and adjacency validation
- Clear visual feedback for hits, misses, and valid/invalid placements
- Test-ready classes designed for easy Jest unit testing
- Used [Heroicons](https://heroicons.com/) for improved visual clarity
- Lightweight and optimized for desktop browsers

## Goals
- Add Player vs Player mode
- Allow ships to be moved or rotated after placement
- Improve UI by adding more helpful icons
- Improve CPU attack logic to feel more strategic while still avoiding repeated shots
- Subtle hit or miss, placement, and alert sounds for better feedback

## Deployment
Install required libraries
```bash
  npm install
```

Build the project using **Webpack**

```bash
  npm run build
```

or safely run the project in development

```bash
  npm run dev
```
