'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { images, ideas } from '@/lib/data';
import { useRemix } from '@/context/RemixContext';

export default function ImageDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const imageId = parseInt(resolvedParams.id);
    const image = images.find(img => img.id === imageId);
    const { openRemix } = useRemix();

    const [visibleImages, setVisibleImages] = useState(8);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Get similar images
    const similarImages = image?.similar.map(id => images.find(img => img.id === id)).filter(Boolean).slice(0, 6) || [];

    // Get ideas for this image type
    const imageIdeas = image ? ideas[image.type] : [];

    // Get more images for infinite scroll (excluding current image)
    const moreImages = images.filter(img => img.id !== imageId).slice(0, visibleImages);

    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleImages < images.length) {
                    setVisibleImages(prev => Math.min(prev + 8, images.length));
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [visibleImages]);

    const handleRemixClick = () => {
        if (image) {
            openRemix(image.url);
        }
    };

    if (!image) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Image not found</h1>
                    <Link href="/" className="text-[#7c3aed] hover:underline">
                        Return to gallery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <div className="flex flex-col lg:flex-row h-screen">
                {/* Left Section - Fixed Image and Info */}
                <div className="lg:w-[45%] lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:overflow-y-auto p-6 lg:p-8 border-r border-white/10 custom-scrollbar">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 text-[#a0a0b8] hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    {/* Image Container - Constrained Height */}
                    <div className="rounded-2xl overflow-hidden mb-6 shadow-2xl bg-[#13131a] flex items-center justify-center">
                        <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-auto max-h-[60vh] object-contain"
                        />
                    </div>

                    {/* Image Info */}
                    <div className="mb-6">
                        <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider mb-4 ${image.type === 'nanobanana'
                            ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2]'
                            : 'bg-gradient-to-r from-[#f093fb] to-[#f5576c]'
                            }`}>
                            {image.type}
                        </span>

                        <h1 className="text-3xl font-bold mb-4">{image.title}</h1>
                        <p className="text-[#a0a0b8] leading-relaxed mb-6">{image.prompt}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleRemixClick}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-[#667eea]/30 transition-all flex items-center justify-center gap-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <polyline points="23 20 23 14 17 14"></polyline>
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                                </svg>
                                Remix This
                            </button>
                            <button className="px-6 py-3 bg-[#20202e] border border-white/10 rounded-xl font-semibold hover:bg-white/5 transition-colors flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Section - Infinite Scroll */}
                <div className="lg:w-[55%] lg:ml-[45%] p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6">More to explore</h2>

                    {/* Similar Images */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Similar Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {similarImages.map((simImg: any) => (
                                <Link
                                    key={simImg.id}
                                    href={`/image/${simImg.id}`}
                                    className="group rounded-xl overflow-hidden hover:scale-105 transition-transform"
                                >
                                    <img
                                        src={simImg.url}
                                        alt={simImg.title}
                                        className="w-full h-auto"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Discover More - Blended with Ideas */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Discover more</h3>
                        <div className="columns-1 md:columns-2 gap-4">
                            {/* Intersperse idea pills with images */}
                            {moreImages.map((img, index) => (
                                <div key={`item-${index}`} className="mb-4 break-inside-avoid">
                                    {/* Show an idea pill every 4 images */}
                                    {index > 0 && index % 4 === 0 && imageIdeas[Math.floor(index / 4) - 1] && (
                                        <div
                                            className="relative rounded-xl overflow-hidden cursor-pointer group mb-4 aspect-[4/3]"
                                            style={{ backgroundImage: imageIdeas[Math.floor(index / 4) - 1].gradient }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent transition-all"></div>
                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                <p className="text-white font-semibold text-center text-sm group-hover:-translate-y-1 transition-transform">
                                                    {imageIdeas[Math.floor(index / 4) - 1].name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Regular image */}
                                    <Link
                                        href={`/image/${img.id}`}
                                        className="block group"
                                    >
                                        <div className="relative rounded-xl overflow-hidden bg-[#13131a] hover:scale-[1.02] transition-transform">
                                            <img
                                                src={img.url}
                                                alt={img.title}
                                                className="w-full h-auto block"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <p className="font-semibold text-sm">{img.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Load More Trigger */}
                    <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                        {visibleImages < images.length && (
                            <div className="animate-pulse text-[#a0a0b8]">Loading more...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
