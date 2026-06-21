'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faDownload, faShare } from '@fortawesome/free-solid-svg-icons';
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
    <main className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">AI Wallpaper Hub</h1>
      <CategoryBar
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading wallpapers...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No wallpapers yet. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {filtered.map(wp => (
            <WallpaperCard key={wp.id} wallpaper={wp} />
          ))}
        </div>
      )}
    </main>
  );
}
