'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function WallpaperPage() {
  const params = useParams();
  const id = params.id as string;
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wallpapers?action=get&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setWallpaper(null);
        else setWallpaper(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDownload = () => {
    if (wallpaper) {
      const link = document.createElement('a');
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.id}.jpg`;
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share && wallpaper) {
      navigator.share({
        title: 'AI Wallpaper Hub',
        text: `Check out this wallpaper: ${wallpaper.id}`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>;
  }
  if (!wallpaper) {
    return <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">Wallpaper not found</div>;
  }

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="relative">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.prompt}
          className="w-full rounded-lg shadow-lg"
          style={{ aspectRatio: '9/16' }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-xs text-gray-300">{wallpaper.category} &middot; {wallpaper.resolution}</p>
        </div>
      </div>
      <div className="flex justify-around mt-4">
        <button onClick={handleDownload} className="flex flex-col items-center text-gray-300 hover:text-white">
          <FontAwesomeIcon icon={faDownload} className="text-xl" />
          <span className="text-xs">Download</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center text-gray-300 hover:text-white">
          <FontAwesomeIcon icon={faShare} className="text-xl" />
          <span className="text-xs">Share</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-4">{wallpaper.prompt}</p>
    </main>
  );
}
