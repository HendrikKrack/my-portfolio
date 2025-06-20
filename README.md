# My Interactive 3D Portfolio

A modern, interactive portfolio website built with Three.js, inspired by Bruno Simon's design but customized for your personal brand.

## Features

- **Interactive 3D Environment**: Navigate through a 3D space using WASD keys and mouse
- **Portfolio Showcase**: Interactive 3D objects representing your projects and skills
- **Blue Camper Van**: A custom 3D vehicle with surfboard, inspired by your Ford Transit vision
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, gradient-based interface with smooth animations
- **Loading Screen**: Professional loading experience with progress bar

## Controls

- **WASD / Arrow Keys**: Move around the 3D space
- **Mouse**: Look around (hold and drag)
- **Space**: Jump/fly up
- **Click**: Interact with portfolio items

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Customization

### Adding Your Content

1. **Update Personal Information**: 
   - Edit `src/index.html` to change your name and navigation links
   - Modify the info panel content

2. **Add Your Projects**:
   - In `src/script.js`, update the `portfolioItems` section
   - Change project names, descriptions, and colors
   - Add more interactive objects as needed

3. **Customize Colors**:
   - Update the gradient colors in `src/style.css`
   - Modify material colors in `src/script.js`

4. **Add Your Assets**:
   - Place 3D models in the `static/` directory
   - Load them using Three.js loaders

### Project Structure

```
src/
├── index.html          # Main HTML file
├── style.css           # Styles and UI
└── script.js           # Three.js application logic

static/                 # Static assets (models, textures, etc.)
```

## Technologies Used

- **Three.js**: 3D graphics and rendering
- **GSAP**: Smooth animations
- **Vite**: Fast development and building
- **Modern CSS**: Gradients, backdrop-filter, flexbox

## Inspiration

This portfolio is inspired by Bruno Simon's award-winning portfolio but built from scratch with your own creative vision and the blue Ford Transit camper van aesthetic you wanted.

## License

MIT License - Feel free to use this as a starting point for your own portfolio!
