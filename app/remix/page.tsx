'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RemixPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            router.back();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] p-6 lg:p-8">
            <div className="max-w-[900px] mx-auto">
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

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Remix Your Creation</h1>
                    <p className="text-[#a0a0b8]">Modify the prompt and settings to create something new</p>
                </div>

                <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
                    {/* Left Section - Form */}
                    <div>
                        {/* Prompt */}
                        <div className="mb-6">
                            <label className="block font-semibold mb-2">Your Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe what you want to create..."
                                rows={4}
                                className="w-full p-4 bg-[#20202e] border border-white/10 rounded-xl text-white placeholder:text-[#6b6b88] focus:outline-none focus:border-[#7c3aed] transition-colors resize-none"
                            />
                        </div>

                        {/* Model Selection */}
                        <div className="mb-6">
                            <label className="block font-semibold mb-2">AI Model</label>
                            <select className="w-full p-4 bg-[#20202e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer">
                                <option>Nanobanana</option>
                                <option>Veo</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Section - Settings */}
                    <div className="bg-[#20202e] p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-semibold mb-6">Preview Settings</h3>

                        <div className="space-y-6">
                            {/* Style Strength */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-[#a0a0b8]">Style Strength</label>
                                    <span className="text-sm text-[#a0a0b8]">75%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    defaultValue="75"
                                    className="w-full h-1.5 bg-[#0a0a0f] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7c3aed]"
                                />
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="block text-sm font-medium text-[#a0a0b8] mb-2">Quality</label>
                                <select defaultValue="High" className="w-full p-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer">
                                    <option>Standard</option>
                                    <option>High</option>
                                    <option>Ultra</option>
                                </select>
                            </div>

                            {/* Aspect Ratio */}
                            <div>
                                <label className="block text-sm font-medium text-[#a0a0b8] mb-2">Aspect Ratio</label>
                                <select defaultValue="16:9" className="w-full p-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#7c3aed] transition-colors appearance-none cursor-pointer">
                                    <option>1:1</option>
                                    <option>16:9</option>
                                    <option>9:16</option>
                                    <option>4:3</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-white/10">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-[#20202e] border border-white/10 rounded-xl font-semibold hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#667eea]/30 transition-all flex items-center gap-2 disabled:opacity-50"
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
