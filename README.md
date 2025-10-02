# 🎬 OMDb Movie Search

A comprehensive web application for searching movies, series, and episodes using the OMDb API. Built with React Remix and TypeScript for maximum performance and SEO optimization.

## ⚡ Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/doc2288/omdb-movie-search.git
cd omdb-movie-search
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Open `.env` and add your API key:

```env
OMDB_API_KEY=your_api_key_here
NODE_ENV=development
PORT=3000
```

### 4. Run in Development Mode

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🚀 New Features

### 🎥 Video Player
- **Built-in video player** for watching trailers
- **Modal window** for fullscreen viewing
- **Custom controls** with progress bar and volume control
- **YouTube support** and other video sources
- **Responsive design** for mobile devices

### ⭐ Core Features
- 🔍 **Title search** with debounce (300ms)
- 🎥 **Filter by type**: movies, series, episodes
- 📅 **Filter by year** of release
- 🎭 **Filter by genre** with smart loading
- 📊 **Results pagination**
- ⚡ **Server-side rendering** for SEO
- 💾 **LRU caching** (10 minutes)
- 📱 **Responsive design**
- 🔒 **API key security**

## 🎮 Video Player Components

### VideoPlayer
Main component for video playback with support for:
- YouTube, Vimeo, Twitch, SoundCloud
- MP4, WebM and other formats
- Automatic source type detection

### CustomVideoPlayer
HTML5 video player with custom controls:
- Progress bar with seeking capability
- Volume control
- Play/pause buttons
- Time counter

### VideoModal
Modal window for fullscreen viewing:
- Page scroll blocking
- Close on ESC or click outside
- Responsive sizes for different devices

## 📋 Requirements

- **Node.js**: version 18+
- **npm** or **yarn**
- **OMDb API key** (free)

## 🏗️ Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run typecheck
```

## 🔧 Technologies

- 🌐 **Remix** v2 + React 18+
- 🔷 **TypeScript**
- 🎨 **Tailwind CSS**
- ⚡ **Vite**
- 🌍 **OMDb API**
- 💾 **LRU Cache**
- 🎬 **React Player** for video player
- 🛠️ **Remix Utils** for client components

## 📁 Project Structure

```
omdb-movie-search/
├── app/
│   ├── components/
│   │   ├── VideoPlayer.tsx          # Main video player
│   │   ├── VideoModal.tsx           # Modal window
│   │   ├── CustomVideoPlayer.tsx    # Custom HTML5 player
│   │   └── react-player.client.tsx  # Client component
│   ├── routes/
│   └── root.tsx
├── public/
├── package.json
└── README.md
```

## 🎥 Using the Video Player

### Basic Usage

```tsx
import { VideoPlayer } from '~/components/VideoPlayer';

function MoviePage() {
  return (
    <VideoPlayer 
      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
      title="Movie Trailer"
    />
  );
}
```

### Modal Window

```tsx
import { VideoModal } from '~/components/VideoModal';
import { useState } from 'react';

function MovieCard() {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowVideo(true)}>
        Watch Trailer
      </button>
      
      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videoUrl="https://example.com/trailer.mp4"
        title="Movie Title"
      />
    </>
  );
}
```

## 🐛 Troubleshooting

### If you get "Missing Root Route file" error:

1. Make sure you're in the project root directory
2. Check that all files are loaded:
   ```bash
   git pull origin main
   ```
3. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json && npm install
   ```

### Video Player Issues:

1. Make sure all dependencies are installed:
   ```bash
   npm install react-player remix-utils
   ```

2. For YouTube videos, ensure URL is correct

3. For local videos, check CORS settings

## 🔄 Updates

### v1.1.0 - Added Video Player
- ✅ React Player integration
- ✅ Modal windows for videos
- ✅ Custom control elements
- ✅ Multiple format support
- ✅ Responsive design

**Built with ❤️ using Remix + TypeScript + OMDb API**

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please create an issue or pull request.

## 📧 Contact

If you have questions or suggestions, create an issue in the repository.