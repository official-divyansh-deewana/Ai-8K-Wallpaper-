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
      navigator.share({
        title: 'AI Wallpaper Hub',
        text: `Check out this wallpaper: ${wallpaper.id}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied!');
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-900 shadow-md">
      <Link href={`/w/${wallpaper.id}`}>
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.prompt}
          className="w-full"
          style={{ aspectRatio: '9/16' }}
          loading="lazy"
        />
      </Link>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center text-white text-sm">
        <span className="text-xs truncate">{wallpaper.category}</span>
        <div className="flex gap-2">
          <button onClick={toggleFav} className="hover:scale-110">
            <FontAwesomeIcon icon={faHeart} className={isFav ? 'text-red-500' : 'text-white'} />
          </button>
          <button onClick={handleDownload} className="hover:scale-110">
            <FontAwesomeIcon icon={faDownload} />
          </button>
          <button onClick={handleShare} className="hover:scale-110">
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>
    </div>
  );
}
