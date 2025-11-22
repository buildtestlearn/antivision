'use client';

import React, { useState } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, Monitor, Smartphone, Square, Loader2, Wand2, Eye, Ratio, RectangleVertical, LayoutTemplate, Download, ArrowLeft } from 'lucide-react';
import { useRemix } from '@/context/RemixContext';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

const ASPECT_RATIOS = [
    { id: 'Auto', icon: LayoutTemplate, label: 'Auto' },
    { id: '1:1', icon: Square, label: '1:1' },
    { id: '9:16', icon: Smartphone, label: '9:16' },
    { id: '16:9', icon: Monitor, label: '16:9' },
    { id: '4:3', icon: Ratio, label: '4:3' },
    { id: '3:4', icon: RectangleVertical, label: '3:4' },
];

export default function RemixDrawer() {
    const { isOpen, closeRemix, selectedStyleImage, setSelectedStyleImage } = useRemix();
    const { user } = useAuth();
    const supabase = createClient();

    const [selectedSize, setSelectedSize] = useState('Auto');
    const [prompt, setPrompt] = useState('');

    // SEPARATED STATES for User Face (Slot 1) and Style/Target (Slot 2)
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    // targetImage is controlled by selectedStyleImage context

    // AI Loading & Result States
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<string | null>(null);

    // Validation for button state
    const isReadyToGenerate = sourceImage && selectedStyleImage && prompt.trim().length > 0;

    // Handle USER file upload (Slot 1)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSourceFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSourceImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) return;
        setIsEnhancing(true);

        try {
            const response = await fetch('/api/gemini/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            if (data.enhancedPrompt) {
                setPrompt(data.enhancedPrompt);
            }
        } catch (error) {
            console.error('Enhance failed:', error);
        } finally {
            setIsEnhancing(false);
        }
    };

    // Analyze the TARGET image if present
    const handleAnalyzeImage = async () => {
        if (!selectedStyleImage) return;
        setIsAnalyzing(true);

        try {
            const response = await fetch('/api/gemini/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: selectedStyleImage }),
            });
            const data = await response.json();
            if (data.description) {
                setPrompt(data.description);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Handle Generation Logic
    const handleGenerate = async () => {
        if (!isReadyToGenerate || isGenerating) return;
        if (!user) {
            alert("Please login to generate images");
            return;
        }

        setIsGenerating(true);

        try {
            let sourceUrl = sourceImage;

            // 1. Upload Source Image if it's a file
            if (sourceFile) {
                const fileName = `${user.id}/${Date.now()}-${sourceFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('remixes')
                    .upload(fileName, sourceFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('remixes')
                    .getPublicUrl(fileName);

                sourceUrl = publicUrl;
            }

            // 2. Call Replicate API for Generation
            const response = await fetch('/api/replicate/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    aspectRatio: selectedSize // Pass the selected aspect ratio
                }),
            });

            const data = await response.json();
            console.log("Generation API Response:", data);

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Generation failed');
            }

            const resultUrl = data.imageUrl;

            // 3. Save Record to DB
            const { error: dbError } = await supabase
                .from('remixes')
                .insert({
                    user_id: user.id,
                    original_image_url: sourceUrl, // This might be null if no source image
                    generated_image_url: resultUrl,
                    prompt_used: prompt,
                    style_preset: selectedStyleImage,
                    category: 'remix',
                    is_public: true
                });

            if (dbError) throw dbError;

            setGeneratedResult(resultUrl);

        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate remix. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle Download Logic
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!generatedResult) return;

        const link = document.createElement('a');
        link.href = generatedResult;
        link.download = `remix-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle Reset
    const handleReset = () => {
        setGeneratedResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-24 right-6 w-full max-w-[360px] z-[100] flex flex-col animate-in slide-in-from-right-5 duration-500 font-sans">

            {/* Glassy Card */}
            <div className="relative flex flex-col bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5 max-h-[calc(100vh-8rem)]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0 bg-white/5">
                    <div className="flex items-center gap-2">
                        {!generatedResult ? (
                            <>
                                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#667eea] to-[#764ba2] flex items-center justify-center">
                                    <Sparkles size={12} className="text-white" />
                                </div>
                                <span className="font-semibold tracking-wide text-gray-200 text-sm">Remix Studio</span>
                            </>
                        ) : (
                            <button onClick={handleReset} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft size={16} />
                                <span className="text-xs font-medium">Back</span>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={closeRemix}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* CONTENT AREA: Switch between Inputs and Result */}
                {generatedResult ? (
                    // RESULT VIEW
                    <div className="flex flex-col p-5 animate-in fade-in duration-500">
                        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 mb-4 group aspect-[3/4]">
                            <img src={generatedResult} alt="Generated Remix" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/10"
                            >
                                <Download size={14} />
                                <span className="text-black">Download Image</span>
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full py-2.5 bg-white/5 text-gray-400 hover:text-white rounded-xl font-medium text-[10px] hover:bg-white/10 transition-colors"
                            >
                                Generate Another
                            </button>
                        </div>
                    </div>
                ) : (
                    // INPUT VIEW
                    <div className="flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="p-5 space-y-5">

                            {/* DUAL SLOTS: Source Face + Target Style */}
                            <div className="grid grid-cols-2 gap-2">

                                {/* Slot 1: YOUR FACE (Source) */}
                                <div className="group relative aspect-square bg-white/5 rounded-xl border border-white/10 border-dashed hover:border-[#7c3aed]/50 hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />

                                    {sourceImage ? (
                                        <>
                                            <img src={sourceImage} alt="Uploaded" className="w-full h-full object-cover" />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 text-center border-t border-white/10">
                                                <span className="text-[9px] font-bold text-white tracking-wide">YOU</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSourceImage(null);
                                                    setSourceFile(null);
                                                }}
                                                className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-full text-white backdrop-blur-sm hover:bg-red-500/50 transition-colors z-20"
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-500 group-hover:text-gray-300">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <Upload size={14} />
                                            </div>
                                            <div className="flex flex-col items-center text-center px-1">
                                                <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wide">Your Face</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Slot 2: TARGET STYLE (Background Card) */}
                                <div className="relative aspect-square bg-white/5 rounded-xl border border-white/10 flex flex-col items-center justify-center overflow-hidden group">
                                    {selectedStyleImage ? (
                                        <>
                                            <img src={selectedStyleImage} alt="Target Style" className="w-full h-full object-cover" />

                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 text-center border-t border-white/10">
                                                <span className="text-[9px] font-bold text-[#7c3aed] tracking-wide">STYLE</span>
                                            </div>

                                            <button
                                                onClick={() => setSelectedStyleImage(null)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-full text-white backdrop-blur-sm hover:bg-red-500/50 transition-colors z-20"
                                            >
                                                <X size={10} />
                                            </button>

                                            {/* Analyze Button */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button
                                                    onClick={handleAnalyzeImage}
                                                    disabled={isAnalyzing}
                                                    className="flex items-center gap-1 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-medium text-white hover:bg-black shadow-xl whitespace-nowrap"
                                                >
                                                    {isAnalyzing ? <Loader2 size={10} className="animate-spin" /> : <Eye size={10} className="text-blue-400" />}
                                                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-1.5 text-gray-500 px-2 text-center">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-gray-600">
                                                <Sparkles size={14} />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wide">Style Ref</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DEDICATED ASPECT RATIO SELECTOR */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Aspect Ratio</label>
                                    <span className="text-[9px] text-[#7c3aed] font-mono bg-[#7c3aed]/10 px-1.5 py-0.5 rounded">{selectedSize}</span>
                                </div>
                                <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar no-scrollbar">
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <button
                                            key={ratio.id}
                                            onClick={() => setSelectedSize(ratio.id)}
                                            className={`
                                flex flex-col items-center justify-center min-w-[40px] h-[40px] rounded-lg border transition-all shrink-0
                                ${selectedSize === ratio.id
                                                    ? 'bg-white/10 border-[#7c3aed]/50 text-[#7c3aed] shadow-[0_0_10px_rgba(124,58,237,0.1)]'
                                                    : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'}
                                `}
                                        >
                                            <ratio.icon size={12} />
                                            <span className="text-[8px] font-medium mt-0.5">{ratio.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Prompt Input */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Prompt</label>
                                    <button
                                        onClick={handleEnhancePrompt}
                                        disabled={isEnhancing || !prompt}
                                        className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                                    >
                                        {isEnhancing ? <Loader2 size={8} className="animate-spin" /> : <Wand2 size={8} />}
                                        {isEnhancing ? "Enhancing..." : "Magic Expand"}
                                    </button>
                                </div>
                                <div className="relative group">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe your headshot or scene..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#7c3aed]/50 focus:ring-1 focus:ring-[#7c3aed]/20 transition-all resize-none h-20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 pt-0 bg-gradient-to-t from-black/40 to-transparent shrink-0">
                            <button
                                onClick={handleGenerate}
                                disabled={!isReadyToGenerate || isGenerating}
                                className={`
                            group relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg overflow-hidden
                            ${isReadyToGenerate
                                        ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-white/10 cursor-pointer'
                                        : 'bg-white/10 text-gray-500 cursor-not-allowed opacity-50'}
                        `}
                            >
                                {isReadyToGenerate && !isGenerating && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#667eea] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                                )}
                                <Sparkles size={14} className={isReadyToGenerate && !isGenerating ? "group-hover:rotate-12 transition-transform" : ""} />
                                <span>{isGenerating ? "Generating..." : "Generate"}</span>
                            </button>
                            <p className="text-center text-[9px] text-gray-600 mt-2">
                                Generates 1 image • Costs 5 credits
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 3px;
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    );
}
