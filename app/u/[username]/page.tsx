'use client';

import { use, useState, useEffect } from 'react';
import { images } from '@/lib/data';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function UserProfile({ params }: { params: Promise<{ username: string }> }) {
    const resolvedParams = use(params);
    const username = decodeURIComponent(resolvedParams.username);
    const [activeTab, setActiveTab] = useState<'remixes' | 'saved' | 'moodboards'>('remixes');
    const [savedImages, setSavedImages] = useState<any[]>([]);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);

    const supabase = createClient();

    // Fetch saved images when tab is active
    useEffect(() => {
        if (activeTab === 'saved') {
            const fetchSavedImages = async () => {
                setIsLoadingSaved(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data, error } = await supabase
                        .from('generated_images')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (data) {
                        setSavedImages(data);
                    }
                }
                setIsLoadingSaved(false);
            };

            fetchSavedImages();
        }
    }, [activeTab]);

    // Mock data
    const user = {
        name: 'Alex Designer',
        handle: '@alexdesign',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
        bio: 'Digital artist & prompt engineer. Love remixing portraits.',
        stats: {
            remixes: 124,
            followers: '12.5k',
            following: 420
        }
    };

    const moodboards = [
        { id: 1, title: 'Wedding Inspo', count: 12, cover: images[0]?.url },
        { id: 2, title: 'Cyberpunk Portraits', count: 45, cover: images[2]?.url },
        { id: 3, title: 'Headshot Ideas', count: 8, cover: images[4]?.url },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-12">
            <div className="max-w-[1600px] mx-auto px-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#7c3aed] mb-6 shadow-2xl shadow-[#7c3aed]/20">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <p className="text-[#a0a0b8] mb-6">{user.handle}</p>
                    <p className="max-w-md text-gray-300 mb-8">{user.bio}</p>

                    <div className="flex gap-8 mb-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{user.stats.remixes}</div>
                            <div className="text-sm text-[#a0a0b8]">Remixes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{user.stats.followers}</div>
                            <div className="text-sm text-[#a0a0b8]">Followers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{user.stats.following}</div>
                            <div className="text-sm text-[#a0a0b8]">Following</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="px-6 py-2.5 bg-[#7c3aed] rounded-xl font-medium hover:bg-[#6d28d9] transition-colors">
                            Follow
                        </button>
                        <button className="px-6 py-2.5 bg-[#20202e] border border-white/10 rounded-xl font-medium hover:bg-white/5 transition-colors">
                            Share
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center gap-2 mb-12 border-b border-white/10 pb-1">
                    {(['remixes', 'saved', 'moodboards'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium capitalize relative ${activeTab === tab ? 'text-white' : 'text-[#a0a0b8] hover:text-white'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'moodboards' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {moodboards.map((board) => (
                                <Link href={`/board/${board.id}`} key={board.id} className="group block">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#13131a] mb-4 relative">
                                        <img
                                            src={board.cover}
                                            alt={board.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 group-hover:text-[#7c3aed] transition-colors">{board.title}</h3>
                                    <p className="text-sm text-[#a0a0b8]">{board.count} items</p>
                                </Link>
                            ))}
                        </div>
                    ) : activeTab === 'saved' ? (
                        isLoadingSaved ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7c3aed]"></div>
                            </div>
                        ) : savedImages.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <p>No saved images yet. Go to Studio to create some!</p>
                                <Link href="/studio" className="inline-block mt-4 px-6 py-2 bg-[#7c3aed] text-white rounded-full hover:bg-[#6d28d9]">
                                    Go to Studio
                                </Link>
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
                                {savedImages.map((image) => (
                                    <div key={image.id} className="mb-4 break-inside-avoid group relative rounded-xl overflow-hidden bg-[#13131a]">
                                        <img
                                            src={image.image_url}
                                            alt={image.prompt || 'Generated Image'}
                                            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <p className="text-sm text-white line-clamp-2">{image.prompt}</p>
                                                <a
                                                    href={image.image_url}
                                                    download
                                                    target="_blank"
                                                    className="mt-2 inline-block text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
                            {images.map((image) => (
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
                    )}
                </div>
            </div>
        </div>
    );
}
