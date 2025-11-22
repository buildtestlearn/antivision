'use client';

import { use } from 'react';
import { images } from '@/lib/data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MoodboardDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();

    // Mock data
    const board = {
        id: resolvedParams.id,
        title: 'Wedding Inspo',
        description: 'Collection of elegant wedding styles and floral arrangements.',
        author: {
            name: 'Alex Designer',
            handle: '@alexdesign',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
        },
        items: images.slice(0, 12) // Just grab some images for demo
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-12">
            <div className="max-w-[1600px] mx-auto px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-[#a0a0b8] hover:text-white transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Profile
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{board.title}</h1>
                        <p className="text-[#a0a0b8] text-lg mb-6 max-w-2xl">{board.description}</p>

                        <div className="flex items-center gap-3">
                            <img src={board.author.avatar} alt={board.author.name} className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-medium">by {board.author.name}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-[#20202e] border border-white/10 rounded-xl font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                        </button>
                        <button className="px-5 py-2.5 bg-[#7c3aed] rounded-xl font-medium hover:bg-[#6d28d9] transition-colors flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                            </svg>
                            Share
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
                    {board.items.map((image) => (
                        <Link href={`/image/${image.id}`} key={image.id} className="block mb-4 break-inside-avoid group">
                            <div className="relative rounded-xl overflow-hidden bg-[#13131a]">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="font-semibold text-sm">{image.title}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
