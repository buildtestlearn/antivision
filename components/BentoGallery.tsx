import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, RefreshCw, Download, X } from 'lucide-react';

interface MediaItem {
    id: string;
    originalIndex: number;
    type: 'image';
    title: string;
    desc: string;
    url: string | null;
    status: 'pending' | 'success' | 'failed';
    liked: boolean;
    span: string;
}

interface BentoGalleryProps {
    mediaItems: MediaItem[];
    onRegenerate: (index: number) => void;
    onDownload: (url: string, title: string, ratio: string) => void;
    onDownloadOriginal: (url: string, title: string) => void;
    onLike: (index: number) => void;
    onShare: (url: string, title: string) => void;
    onSave: (item: MediaItem) => void;
}

const MediaItemComponent = ({ item, className, onClick, onRegenerate }: { item: MediaItem, className: string, onClick: () => void, onRegenerate: (index: number) => void }) => {
    if (item.status === 'pending') {
        return (
            <div className={`${className} relative bg-gray-800 flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="relative text-white text-xs sm:text-sm md:text-base font-medium line-clamp-1">{item.title}</h3>
                </div>
            </div>
        );
    }

    if (item.status === 'failed') {
        return (
            <div className={`${className} relative bg-red-900/50 flex flex-col items-center justify-center p-4 text-center`}>
                <p className="text-red-300 text-sm font-semibold">Failed</p>
                <p className="text-red-400 text-xs mt-1">Could not generate "{item.title}"</p>
                <button
                    onClick={(e) => { e.stopPropagation(); onRegenerate(item.originalIndex); }}
                    className="mt-3 px-3 py-1 text-xs bg-gray-200 text-black rounded-md hover:bg-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <img
            src={item.url!}
            alt={item.title}
            className={`${className} object-cover cursor-pointer`}
            onClick={onClick}
            loading="lazy"
            decoding="async"
        />
    );
};

const GalleryModal = ({ selectedItem, isOpen, onClose, onRegenerate, onDownload, onDownloadOriginal, onLike, onShare, onSave }: { selectedItem: MediaItem, isOpen: boolean, onClose: () => void, onRegenerate: (index: number) => void, onDownload: (url: string, title: string, ratio: string) => void, onDownloadOriginal: (url: string, title: string) => void, onLike: (index: number) => void, onShare: (url: string, title: string) => void, onSave: (item: MediaItem) => void }) => {
    if (!isOpen) return null;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative w-full max-w-3xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedItem.id}
                            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-900"
                            initial={{ y: 20, scale: 0.97, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 } }}
                            exit={{ y: 20, scale: 0.97, opacity: 0, transition: { duration: 0.15 } }}
                        >
                            <img src={selectedItem.url!} alt={selectedItem.title} className="w-full h-full object-contain" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-white text-xl font-bold">{selectedItem.title}</h3>
                                <p className="text-white/80 text-sm mt-1">{selectedItem.desc}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        <button onClick={() => onSave(selectedItem)} className="px-4 py-2 rounded-md font-semibold tracking-wider uppercase transition-all duration-300 bg-yellow-400 text-black hover:bg-yellow-300 flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-current" /> Save to Profile
                        </button>
                        <button onClick={() => onShare(selectedItem.url!, selectedItem.title)} className="px-4 py-2 rounded-md font-semibold tracking-wider uppercase transition-all duration-300 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                            <Share2 className="w-5 h-5" /> Share
                        </button>
                        <button onClick={() => onRegenerate(selectedItem.originalIndex)} className="px-4 py-2 rounded-md font-semibold tracking-wider uppercase transition-all duration-300 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                            <RefreshCw className="w-5 h-5" /> Regenerate
                        </button>
                        <button onClick={() => onDownloadOriginal(selectedItem.url!, selectedItem.title)} className="px-4 py-2 rounded-md font-semibold tracking-wider uppercase transition-all duration-300 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2">
                            <Download className="w-5 h-5" /> Original
                        </button>
                    </div>

                    <motion.button
                        className="absolute -top-2 -right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </>
    );
};

const BentoGallery: React.FC<BentoGalleryProps> = ({ mediaItems, onRegenerate, onDownload, onDownloadOriginal, onLike, onShare, onSave }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8 max-w-full">
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-[100px]"
                initial="hidden" animate="visible" exit="hidden"
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
            >
                {mediaItems.map((item) => (
                    <motion.div
                        key={item.id}
                        layoutId={`media-${item.id}`}
                        className={`relative overflow-hidden rounded-xl bg-gray-800 ${item.span}`}
                        onClick={() => !isDragging && item.status === 'success' && setSelectedItem(item)}
                        variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: { y: 0, opacity: 1 }
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        whileHover={item.status === 'success' ? { scale: 1.03 } : {}}
                    >
                        <MediaItemComponent
                            item={item}
                            className="absolute inset-0 w-full h-full"
                            onClick={() => !isDragging && item.status === 'success' && setSelectedItem(item)}
                            onRegenerate={onRegenerate}
                        />
                        {item.status === 'success' && (
                            <motion.div
                                className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/70 to-transparent"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSave(item);
                                        }}
                                        className={`p-1.5 bg-black/50 rounded-full transition-colors text-white hover:text-yellow-400`}
                                        aria-label="Save"
                                    >
                                        <Heart className={`w-4 h-4`} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDownloadOriginal(item.url!, item.title);
                                        }}
                                        className="p-1.5 bg-black/50 rounded-full text-white hover:bg-black/80"
                                        aria-label="Download Original"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="relative text-white font-bold text-sm line-clamp-1">{item.title}</h3>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedItem && (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        onRegenerate={onRegenerate}
                        onDownload={onDownload}
                        onDownloadOriginal={onDownloadOriginal}
                        onLike={onLike}
                        onShare={onShare}
                        onSave={onSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BentoGallery;
