'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload, faShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetch(`/api/wallpapers?action=get&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setWallpaper(data);
          const favs = JSON.parse(localStorage.getItem('ai_wallpaper_favs') || '[]');
          setIsFav(favs.includes(data.id));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const toggleFav = () => {
    if (!wallpaper) return;
    const favs = JSON.parse(localStorage.getItem('ai_wallpaper_favs') || '[]');
    const updated = isFav ? favs.filter((fid: string) => fid !== wallpaper.id) : [...favs, wallpaper.id];
    localStorage.setItem('ai_wallpaper_favs', JSON.stringify(updated));
    setIsFav(!isFav);
  };

  const handleDownload = () => {
    if (wallpaper) {
      const link = document.createElement('a');
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.id}.jpg`;
      link.click();
    }
  };

  const handleShare = () => {
    if (!wallpaper) return;
    if (navigator.share) {
      navigator.share({
        title: 'AI Wallpaper Hub',
        text: `Check out this wallpaper: ${wallpaper.id}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-4 pt-8 pb-6 text-center text-gray-400">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-20 bg-gray-800 rounded" />
          <div className="h-80 bg-gray-800 rounded-3xl" />
          <div className="h-8 w-1/2 bg-gray-800 rounded" />
        </div>
      </main>
    );
  }

  if (!wallpaper) {
    return (
      <main className="max-w-md mx-auto px-4 pt-20 pb-6 text-center text-gray-400">
        <FontAwesomeIcon icon={faArrowLeft} className="text-3xl mb-4 opacity-50" />
        <p>Wallpaper not found.</p>
        <Link href="/" className="text-indigo-400 mt-4 inline-block">Go Home</Link>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </Link>
        <span className="text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white">
          {wallpaper.category} &middot; {wallpaper.resolution}
        </span>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/5">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gray-900 animate-shimmer rounded-3xl" />
        )}
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.prompt}
          className={`w-full transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ aspectRatio: '9/16', objectFit: 'cover' }}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      <div className="flex items-center justify-around mt-5 mb-6">
        <button onClick={toggleFav} className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
          <FontAwesomeIcon
            icon={faHeart}
            className={`text-2xl ${isFav ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]' : ''}`}
          />
          <span className="text-xs mt-1">{isFav ? 'Saved' : 'Save'}</span>
        </button>
        <button onClick={handleDownload} className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
          <FontAwesomeIcon icon={faDownload} className="text-2xl" />
          <span className="text-xs mt-1">Download</span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
          <FontAwesomeIcon icon={faShare} className="text-2xl" />
          <span className="text-xs mt-1">Share</span>
        </button>
      </div>

      <div className="glass rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-400 font-medium mb-1">AI Prompt</p>
        <p className="text-sm text-gray-200 leading-relaxed">{wallpaper.prompt}</p>
      </div>

      <p className="text-center text-xs text-gray-600">
        ID: {wallpaper.id} &middot; Generated {new Date(wallpaper.timestamp).toLocaleDateString()}
      </p>
    </main>
  );
}
