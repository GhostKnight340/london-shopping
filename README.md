# London Shopping Trip Organizer

A personal web app for organizing your shopping hauls and wishlists during your London trip. Built with React, TypeScript, and Tailwind CSS.

## Features

✨ **Shopping Hauls** - Broad shopping missions (e.g., Japan Centre haul) with category checklists  
✨ **Specific Items** - Track individual products you want to buy  
✨ **Spending Tracker** - Quick-add buttons (+£5, +£10, +£20) + transaction history  
✨ **Shopping Mode** - Simplified fullscreen interface for in-store use  
✨ **Places Directory** - Store locations with Google Maps links  
✨ **Completion History** - Track what you've bought and total spent  
✨ **Data Export/Import** - Backup your trip data as JSON  
✨ **Offline Ready** - Works on mobile as a PWA  

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project" and select this repo
4. Click Deploy (no config needed)
5. Share your live URL!

### Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git" and select this repo
4. Click Deploy (auto-detected)

### Deploy to GitHub Pages

```bash
npm run build
# Then configure GitHub Pages to use /dist folder
```

## How It Works

- **Data Storage**: All data is stored locally in your browser's IndexedDB
- **No Backend**: Fully client-side, no server required
- **No Account**: No login needed, completely private
- **Mobile-First**: Optimized for phone use (390px+)
- **PWA Ready**: Install on home screen like an app

## Initial Data

The app comes seeded with three shopping hauls:
- 🇯🇵 Japan Centre Haul
- 🇬🇧 UK Snack Haul
- 🇰🇷 Korean Supermarket Haul

Feel free to edit, delete, or add your own!

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Dexie** - IndexedDB wrapper
- **Lucide React** - Icons

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run linter
```

## License

Personal use. Built for your London trip! 🇬🇧
