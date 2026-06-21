'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload, faShare } from '@fortawesome/free-solid-svg-icons';

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
    const favs = JSON.parse(localStorage.getItem('ai_wallpaper_favs') || '[]');
    const updated = isFav ? favs.filter((id: string) => id !== wallpaper.id) : [...favs, wallpaper.id];
    localStorage.setItem('ai_wallpaper_favs', JSON.stringify(updated));
    setIsFav(!isFav);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `${wallpaper.id}.jpg`;
    link.click();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/w/${wallpaper.id}`;
    if (navigator.share) {
      navigator.share({ title: 'AI Wallpaper Hub', text: `Check out this wallpaper: ${wallpaper.id}`, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied!');
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-gray-900/60 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <Link href={`/w/${wallpaper.id}`}>
        <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-t-xl" />
          )}
          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.prompt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        </div>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end text-white">
        <span className="text-xs font-medium bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">{wallpaper.category}</span>
        <div className="flex gap-2">
          <button onClick={toggleFav} className="p-1.5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
            <FontAwesomeIcon icon={faHeart} className={`text-sm ${isFav ? 'text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'text-white'}`} />
          </button>
          <button onClick={handleDownload} className="p-1.5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
            <FontAwesomeIcon icon={faDownload} className="text-sm" />
          </button>
          <button onClick={handleShare} className="p-1.5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
            <FontAwesomeIcon icon={faShare} className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
