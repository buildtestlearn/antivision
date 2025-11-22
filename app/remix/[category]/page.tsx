'use client';

import { use } from 'react';
import { images } from '@/lib/data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data for categories
const categoryData: Record<string, { title: string; description: string; promptTemplate: string; cover: string }> = {
    headshots: {
        title: 'Professional Headshots',
        description: 'Transform your selfies into studio-quality professional headshots. Perfect for LinkedIn, resumes, and company profiles.',
        promptTemplate: 'Professional studio headshot, 4k, sharp focus, neutral background...',
        cover: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop'
    },
    wedding: {
        title: 'Wedding Styles',
        description: 'Reimagine your wedding photos with different artistic styles, from vintage film to modern cinematic looks.',
        promptTemplate: 'Cinematic wedding photography, golden hour, soft lighting, romantic atmosphere...',
        cover: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'
    },
    portraits: {
        title: 'Artistic Portraits',
        description: 'Turn everyday photos into stunning artistic portraits. Experiment with lighting, composition, and art styles.',
        promptTemplate: 'Artistic portrait, dramatic lighting, rembrandt style, oil painting texture...',
        cover: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop'
    },
    engagement: {
        title: 'Engagement Shoots',
        description: 'Create dreamy engagement photos in any location without leaving your home.',
        promptTemplate: 'Engagement couple photo, paris eiffel tower background, romantic vibe...',
        cover: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop'
    },
    dating: {
        title: 'Dating Profiles',
        description: 'Stand out on dating apps with optimized, high-quality photos that show your best self.',
        promptTemplate: 'Candid lifestyle photo, smiling, golden hour, park background, high quality...',
        cover: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=800&h=600&fit=crop'
    }
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = use(params);
    const categoryKey = resolvedParams.category.toLowerCase();
    const category = categoryData[categoryKey] || {
        title: resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1),
        description: 'Explore remixes in this category.',
        promptTemplate: 'A creative remix...',
        cover: images[0]?.url
    };
    const router = useRouter();

    // Filter images that might match this category (mock filter)
    const categoryImages = images.slice(0, 8);

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
                    Back
                </button>

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden mb-16 bg-[#13131a] border border-white/10">
                    <div className="absolute inset-0">
                        <img src={category.cover} alt={category.title} className="w-full h-full object-cover opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
                    </div>

                    <div className="relative p-12 md:p-20 max-w-3xl">
                        <span className="inline-block px-4 py-2 rounded-full bg-[#7c3aed]/20 text-[#7c3aed] font-medium text-sm mb-6 border border-[#7c3aed]/20">
                            Remix Category
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">{category.title}</h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">{category.description}</p>

                        <button className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <polyline points="23 20 23 14 17 14"></polyline>
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                            </svg>
                            Create {category.title}
                        </button>
                    </div>
                </div>

                {/* Examples Grid */}
                <h2 className="text-2xl font-bold mb-8">Community Examples</h2>
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
                    {categoryImages.map((image) => (
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
