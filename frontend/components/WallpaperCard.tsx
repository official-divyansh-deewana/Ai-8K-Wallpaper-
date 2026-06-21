'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

interface Wallpaper {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  resolution: string;
}

export default function WallpaperCard({ wallpaper }: { wallpaper: Wallpaper }) {
  const [isFav, setIsFav] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('ai_wallpaper_favs') || '[]');
    setIsFav(favs.includes(wallpaper.id));
  }, [wallpaper.id]);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('ai_wallpaper_favs') || '[]');
    const updated = isFav ? favs.filter((id: string) => id !== wallpaper.id) : [...favs, wallpaper.id];
    localStorage.setItem('ai_wallpaper_favs', JSON.stringify(updated));
    setIsFav(!isFav);
  };

  // Format ID as a readable title (e.g., "neon-tiger-cyber-night" -> "Neon Tiger Cyber Night")
  const wallpaperTitle = wallpaper.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-black shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-shadow duration-500">
      <Link href={`/w/${wallpaper.id}`}>
        <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
          {/* Skeleton loader */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-900 animate-shimmer rounded-3xl" />
          )}
          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.prompt}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />

          {/* Top-left category pill */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 text-[11px] font-semibold text-white bg-black/40 backdrop-blur-md rounded-full shadow-lg">
              {wallpaper.category}
            </span>
          </div>

          {/* Top-right heart button */}
          <button
            onClick={toggleFav}
            className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white shadow-lg hover:bg-black/60 transition-colors"
          >
            <FontAwesomeIcon
              icon={isFav ? faHeartSolid : faHeartRegular}
              className={`text-sm ${isFav ? 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' : ''}`}
            />
          </button>

          {/* Bottom gradient overlay with title & subtitle */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-12 pb-4 px-4 z-10">
            <h3 className="text-white font-bold text-sm truncate">{wallpaperTitle}</h3>
            <p className="text-gray-400 text-[10px] mt-0.5">AI Generated</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
