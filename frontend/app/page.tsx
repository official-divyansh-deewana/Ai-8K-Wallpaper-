'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import CategoryBar from '@/components/CategoryBar';
import WallpaperCard from '@/components/WallpaperCard';

interface Wallpaper {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  timestamp: string;
  resolution: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-black border border-white/5" style={{ aspectRatio: '9/16' }}>
      <div className="w-full h-full animate-shimmer" />
    </div>
  );
}

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallpapers?action=list')
      .then(res => res.json())
      .then(data => {
        setWallpapers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = selectedCategory === 'All'
    ? wallpapers
    : wallpapers.filter(w => w.category === selectedCategory);

  return (
    <main className="max-w-md mx-auto px-4 pt-8 pb-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Wallpaper Hub
        </h1>
        <p className="text-gray-400 text-sm mt-1">Stunning wallpapers, generated every hour</p>
      </div>

      <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />

      {loading ? (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-4xl mb-3 opacity-50" />
          <p className="text-sm">No wallpapers yet.</p>
          <p className="text-xs text-gray-600 mt-1">They auto-update hourly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {filtered.map(wp => (
            <WallpaperCard key={wp.id} wallpaper={wp} />
          ))}
        </div>
      )}
    </main>
  );
}
