'use client';

import { useState } from 'react';

interface RemixModalProps {
    isOpen: boolean;
    onClose: () => void;
    image: {
        url: string;
        title: string;
        prompt: string;
        type: string;
    };
}

export default function RemixModal({ isOpen, onClose, image }: RemixModalProps) {
    const [prompt, setPrompt] = useState(image.prompt);
    const [generating, setGenerating] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('16:9');

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            onClose();
        }, 1500);
    };

    const handleUpload = () => {
        // Mock upload functionality
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setUploadedImage(e.target?.result as string);
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass Backdrop - transparent enough to see behind */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Close Button - Moved outside to be safe from overlap */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50 text-white"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Glass Modal Content */}
            <div className="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden">

                {/* Left Side - Visuals */}
                <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/20">
                    <h2 className="text-2xl font-bold mb-6">Remix This Image</h2>

                    <div className="space-y-6">
                        {/* Source Image Upload */}
                        <div>
                            <label className="block font-semibold mb-3 text-sm text-[#a0a0b8]">Source Image</label>
                            <div
                                onClick={handleUpload}
                                className="relative aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-[#7c3aed] hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center group overflow-hidden"
                            >
                                {uploadedImage ? (
                                    <>
                                        <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-medium">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a0a0b8] group-hover:text-white">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                        </div>
                                        <p className="text-[#a0a0b8] font-medium group-hover:text-white transition-colors">Upload source image</p>
                                        <p className="text-xs text-[#6b6b88] mt-1">JPG, PNG up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Style Reference */}
                        <div>
                            <label className="block font-semibold mb-3 text-sm text-[#a0a0b8]">Style Reference</label>
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Controls */}
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex-1">
                        {/* Prompt */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block font-semibold text-sm">Prompt</label>
                                <button className="text-xs text-[#7c3aed] hover:text-[#9f7aea] transition-colors flex items-center gap-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                                        <path d="M9 12h6" />
                                        <path d="M12 9v6" />
                                    </svg>
                                    Enhance
                                </button>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe what you want to create..."
                                rows={6}
                                className="w-full p-4 bg-[#20202e]/50 border border-white/10 rounded-xl text-white placeholder:text-[#6b6b88] focus:outline-none focus:border-[#7c3aed] focus:bg-[#20202e] transition-all resize-none text-sm leading-relaxed"
                            />
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {/* AI Model */}
                            <div>
                                <label className="block font-semibold mb-2 text-xs text-[#a0a0b8] uppercase tracking-wider">AI Model</label>
                                <select className="w-full p-3 bg-[#20202e]/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer hover:bg-[#20202e]">
                                    <option>Nanobanana</option>
                                    <option>Veo</option>
                                </select>
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="block font-semibold mb-2 text-xs text-[#a0a0b8] uppercase tracking-wider">Quality</label>
                                <select defaultValue="High" className="w-full p-3 bg-[#20202e]/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer hover:bg-[#20202e]">
                                    <option>Standard</option>
                                    <option>High</option>
                                    <option>Ultra</option>
                                </select>
                            </div>

                            {/* Aspect Ratio */}
                            <div className="col-span-2">
                                <label className="block font-semibold mb-2 text-xs text-[#a0a0b8] uppercase tracking-wider">Aspect Ratio</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                                        <button
                                            key={ratio}
                                            onClick={() => setAspectRatio(ratio)}
                                            className={`p-2 rounded-lg text-sm font-medium border transition-all ${aspectRatio === ratio
                                                    ? 'bg-[#7c3aed]/20 border-[#7c3aed] text-white'
                                                    : 'bg-[#20202e]/50 border-white/10 text-[#a0a0b8] hover:bg-[#20202e] hover:text-white'
                                                }`}
                                        >
                                            {ratio}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 mt-auto border-t border-white/10">
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#667eea]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {generating ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Generate Remix
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-2 text-[#a0a0b8] hover:text-white text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
