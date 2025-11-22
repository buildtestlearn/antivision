'use client';

import { useState } from 'react';
import Link from 'next/link';
import { images } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, signOut } = useAuth();
  const [filter, setFilter] = useState<'all' | 'nanobanana' | 'veo'>('all');

  const filteredImages = filter === 'all'
    ? images
    : images.filter(img => img.type === filter);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between gap-8 flex-wrap">
            <h1 className="text-3xl font-extrabold font-caveat tracking-tight">
              <span className="text-yellow-400">AI</span>
              {' '}Remix
            </h1>

            <nav className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-5 py-2.5 rounded-xl font-medium text-[15px] transition-all ${filter === 'all'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('nanobanana')}
                  className={`px-5 py-2.5 rounded-xl font-medium text-[15px] transition-all ${filter === 'nanobanana'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  Nanobanana
                </button>
                <button
                  onClick={() => setFilter('veo')}
                  className={`px-5 py-2.5 rounded-xl font-medium text-[15px] transition-all ${filter === 'veo'
                    ? 'bg-yellow-400 text-black'
                    : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  Veo
                </button>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/studio" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Studio
                </Link>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/u/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
                      {user.email}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-[1600px] mx-auto px-8">

          {/* Studio Banner */}
          <div className="mb-12 relative rounded-3xl overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-1">
            <div className="bg-black rounded-[22px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-caveat font-bold mb-4 text-white">
                  Try the new <span className="text-yellow-400">Studio Mode</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-xl">
                  Transform your photos with Seasons, Holidays, Costumes, and more using our advanced AI themes.
                </p>
                <Link href="/studio" className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-transform hover:scale-105">
                  Enter Studio
                </Link>
              </div>
              <div className="relative z-10 flex gap-4">
                <div className="w-32 h-40 bg-gray-800 rounded-lg rotate-[-6deg] border-4 border-white/10 overflow-hidden">
                  <img src="https://placehold.co/400x500/333/FFF?text=Winter" alt="Winter" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="w-32 h-40 bg-gray-800 rounded-lg rotate-[6deg] border-4 border-white/10 overflow-hidden translate-y-4">
                  <img src="https://placehold.co/400x500/444/FFF?text=Cyber" alt="Cyber" className="w-full h-full object-cover opacity-80" />
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-yellow-400/10 to-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <Link
                key={image.id}
                href={`/image/${image.id}`}
                className="block break-inside-avoid group"
                style={{
                  animation: `fadeInUp 0.6s ${index * 0.05}s both`
                }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 transition-transform duration-300 hover:-translate-y-1 cursor-pointer border border-white/5">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider mb-2 ${image.type === 'nanobanana'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-purple-500 text-white'
                        }`}>
                        {image.type}
                      </span>
                      <h3 className="font-semibold text-[15px] mb-1 text-white">{image.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{image.prompt}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
