'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, X, Download, Heart } from 'lucide-react';
import { templates } from '@/config/templates';
import CameraModal from '@/components/CameraModal';
import BentoGallery from '@/components/BentoGallery';
import Link from 'next/link';

// --- Helper Functions ---
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const getModelInstruction = (template: string, prompt: any, options: any) => {
    const {
        headshotExpression, headshotPose,
        currentAlbumStyle,
        hairColors,
        customStyle,
        lookbookStyle,
        customLookbookStyle
    } = options;

    const coreInstruction = "The highest priority is to maintain the exact facial features, likeness, perceived gender, and body type of the person in the provided reference photo. It is critical that the person's masculine or feminine features are preserved. Do not change the person's gender. Do not add any extra people to the photo. Do not add culturally specific elements like henna unless they are clearly present on the person in the original photo. Do not alter the person's core facial structure.";

    let baseInstruction;

    switch (template) {
        case 'seasons':
        case 'holidays':
            baseInstruction = `${coreInstruction} Transform the image into a scene featuring ONLY the person from the reference photo, based on the following detailed description: ${prompt.base}. The person's clothing should be appropriate for the theme.`;
            break;
        case 'costumes':
            baseInstruction = `${coreInstruction} Transform the person in the image to be wearing a costume and in a scene based on the following detailed description: ${prompt.base}.`;
            break;
        case 'decades':
            baseInstruction = `${coreInstruction} Keeping the original photo's composition, change the person's hair, clothing, and accessories, as well as the photo's background, to match the style of the ${prompt.id}.`;
            break;
        case 'impossibleSelfies':
            baseInstruction = `${coreInstruction} Keeping the original photo's composition as much as possible, place the person into the following scene, changing their clothing, hair, and the background to match: ${prompt.base}.`;
            break;
        case 'hairStyler': {
            let instruction = `${coreInstruction} Keeping the original photo's composition, style the person's hair to be a perfect example of ${prompt.base}. If the person's hair already has this style, enhance and perfect it. Do not alter clothing or the background.`;

            if (['Short', 'Medium', 'Long'].includes(prompt.id)) {
                instruction += " Maintain the person's original hair texture (e.g., straight, wavy, curly).";
            }

            if (hairColors && hairColors.length > 0) {
                if (hairColors.length === 1) {
                    instruction += ` The hair color should be ${hairColors[0]}.`;
                } else if (hairColors.length === 2) {
                    instruction += ` The hair should be a mix of two colors: ${hairColors[0]} and ${hairColors[1]}.`;
                }
            }
            baseInstruction = instruction;
            break;
        }
        case 'headshots': {
            const poseInstruction = headshotPose === 'Forward' ? 'facing forward towards the camera' : 'posed at a slight angle to the camera';
            baseInstruction = `${coreInstruction} Transform the image into a professional headshot. The person should be ${poseInstruction} with a "${headshotExpression}" expression. They should be ${prompt.base}. Please maintain the original hairstyle from the photo. The background should be a clean, neutral, out-of-focus studio background (like light gray, beige, or white). The final image should be a well-lit, high-quality professional portrait.`;
            break;
        }
        case 'eightiesMall':
            baseInstruction = `${coreInstruction} Transform the image into a photo from a single 1980s mall photoshoot. The overall style for the entire photoshoot is: "${currentAlbumStyle}". For this specific photo, the person should be in ${prompt.base}. The person's hair and clothing should be 80s style and be consistent across all photos in this set. The background and lighting must also match the overall style for every photo.`;
            break;
        case 'styleLookbook': {
            const finalStyle = lookbookStyle === 'Other' ? customLookbookStyle : lookbookStyle;
            baseInstruction = `${coreInstruction} Transform the image into a high-fashion lookbook photo. The overall fashion style for the entire lookbook is "${finalStyle}". For this specific photo, create a unique, stylish outfit that fits the overall style, and place the person in ${prompt.base} in a suitable, fashionable setting. The person's hair and makeup should also complement the style. Each photo in the lookbook should feature a different outfit.`;
            break;
        }
        case 'socialMedia': {
            const platformName = prompt.id;
            baseInstruction = `${coreInstruction} Transform the image into a perfect social media profile picture for "${platformName}". The desired vibe is: "${prompt.base}". The final image should be a high-quality, eye-catching headshot suitable for a small profile picture format.`;
            break;
        }
        case 'stickers': {
            baseInstruction = `The highest priority is to maintain the exact facial features and likeness of the person in the provided reference photo. Transform the person into a die-cut sticker based on the following style: ${prompt.base}. The sticker must have a thick, white die-cut border around the subject. The background must be transparent. It is critical that the person's masculine or feminine features are preserved. Do not alter the person's core facial structure. The final image should look like a real sticker.`;
            break;
        }
        case 'figurines':
            baseInstruction = `The highest priority is to maintain the exact facial features and likeness of the person in the provided reference photo. Transform the person into a miniature figurine based on the following description, placing it in a realistic environment: ${prompt.base}. It is critical that the person's masculine or feminine features are preserved. Do not alter the person's core facial structure. The final image should look like a real photograph of a physical object.`;
            break;
        default:
            baseInstruction = `${coreInstruction} Create an image based on the reference photo and this prompt: ${prompt.base}`;
    }

    if (customStyle && customStyle.trim() !== '') {
        if (baseInstruction.endsWith('.')) {
            baseInstruction = baseInstruction.slice(0, -1);
        }
        return `${baseInstruction}, and apply the following custom style: ${customStyle.trim()}.`;
    }

    return baseInstruction;
};


export default function StudioPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Template State
    const [template, setTemplate] = useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = useState('Autumn');
    const [selectedHoliday, setSelectedHoliday] = useState('Christmas');
    const [headshotExpression, setHeadshotExpression] = useState('Friendly Smile');
    const [headshotPose, setHeadshotPose] = useState('Forward');
    const [lookbookStyle, setLookbookStyle] = useState('');
    const [customLookbookStyle, setCustomLookbookStyle] = useState('');
    const [hairColors, setHairColors] = useState<string[]>([]);
    const [selectedHairStyles, setSelectedHairStyles] = useState<string[]>([]);
    const [customHairStyle, setCustomHairStyle] = useState('');
    const [isCustomHairActive, setIsCustomHairActive] = useState(false);
    const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState<string[]>([]);
    const [customSocialPlatform, setCustomSocialPlatform] = useState('');
    const [isCustomSocialPlatformActive, setIsCustomSocialPlatformActive] = useState(false);
    const [customStyle, setCustomStyle] = useState('');

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64Image = await toBase64(file);
                setUploadedImage(base64Image);
                setGeneratedImages([]);
            } catch (err) {
                console.error("Error during image upload:", err);
                setError("That image couldn't be processed. Please try another file.");
            }
        }
    };

    const handleCaptureConfirm = (imageDataUrl: string) => {
        setUploadedImage(imageDataUrl);
        setGeneratedImages([]);
        setError(null);
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage) {
            setError("Please upload a photo to get started!");
            return;
        }
        if (!template) {
            setError("Please select a theme!");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        const activeTemplate = templates[template as keyof typeof templates];
        let promptsForGeneration: any[] = [];

        // Logic to select prompts based on template
        if (template === 'seasons') {
            promptsForGeneration = (activeTemplate as any).prompts[selectedSeason];
        } else if (template === 'holidays') {
            promptsForGeneration = (activeTemplate as any).prompts[selectedHoliday];
        } else if (template === 'hairStyler') {
            const allPrompts = (activeTemplate as any).prompts;
            promptsForGeneration = allPrompts.filter((p: any) => selectedHairStyles.includes(p.id));
            if (isCustomHairActive && customHairStyle) {
                promptsForGeneration.push({ id: customHairStyle, base: customHairStyle });
            }
        } else if (template === 'socialMedia') {
            const allPlatforms = Object.values((activeTemplate as any).platforms).flat();
            promptsForGeneration = (allPlatforms as any[]).filter(p => selectedSocialPlatforms.includes(p.id));
            if (isCustomSocialPlatformActive && customSocialPlatform) {
                promptsForGeneration.push({ id: customSocialPlatform, base: customSocialPlatform });
            }
        } else {
            promptsForGeneration = (activeTemplate as any).prompts;
        }

        if (!promptsForGeneration || promptsForGeneration.length === 0) {
            setError("No prompts selected.");
            setIsLoading(false);
            return;
        }

        const initialPlaceholders = promptsForGeneration.map((p, index) => ({
            id: p.id,
            originalIndex: index,
            title: p.id,
            desc: p.base,
            status: 'pending',
            url: null,
            liked: false,
            span: "sm:col-span-1 sm:row-span-2" // Default span
        }));
        setGeneratedImages(initialPlaceholders);

        // Generate images sequentially or in parallel (limited)
        for (let i = 0; i < promptsForGeneration.length; i++) {
            const p = promptsForGeneration[i];
            try {
                const modelInstruction = getModelInstruction(template, p, {
                    headshotExpression, headshotPose,
                    lookbookStyle, customLookbookStyle,
                    hairColors,
                    customStyle,
                });

                const response = await fetch('/api/replicate/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: modelInstruction,
                        image: uploadedImage,
                        aspectRatio: '1:1' // Default for now
                    })
                });

                const data = await response.json();
                console.log("API Response Data:", data);

                if (data.error) throw new Error(data.error);

                setGeneratedImages(prev => prev.map((img, index) =>
                    index === i ? { ...img, status: 'success', url: data.imageUrl } : img
                ));

            } catch (err: any) {
                console.error(`Failed to generate image for ${p.id}:`, err);
                setGeneratedImages(prev => prev.map((img, index) =>
                    index === i ? { ...img, status: 'failed' } : img
                ));
            }
        }

        setIsLoading(false);
    };

    // Helper to toggle selection in arrays
    const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // Helper to download image
    const downloadImage = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Small delay before revoking to ensure download starts
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback: try opening in new tab
            window.open(url, '_blank');
        }
    };

    // Helper to save image
    const handleSave = async (item: any) => {
        try {
            const response = await fetch('/api/images/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: item.url,
                    prompt: item.desc,
                    template_id: template
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to save');
            }

            alert('Image saved to your profile!');
        } catch (error: any) {
            console.error('Save failed:', error);
            alert(`Failed to save image: ${error.message}`);
        }
    };

    return (
        <div className="bg-black min-h-screen text-white font-sans">
            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCaptureConfirm}
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <header className="relative text-center mb-16">
                    {/* Back Button */}
                    <a href="/" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                        <X className="w-6 h-6" />
                    </a>

                    {/* Profile Link */}
                    <Link href="/u/profile" className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        Profile
                    </Link>

                    <h1 className="text-6xl md:text-7xl font-caveat text-white tracking-tight">
                        Picture<span className="text-yellow-400">Me</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">Transform your photos with AI themes.</p>
                </header>

                {/* Upload Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-800 mb-16">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">1. Upload Your Photo</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700 max-w-3xl mx-auto">
                        <div
                            className="w-40 h-40 rounded-lg flex-shrink-0 bg-gray-700/50 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden transition-colors hover:border-yellow-400 cursor-pointer"
                            onClick={() => !uploadedImage && fileInputRef.current?.click()}
                        >
                            {uploadedImage ? (
                                <img src={uploadedImage} alt="Uploaded preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-sm">Upload</span>
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-semibold text-white">
                                {uploadedImage ? "Your Photo" : "Start Here"}
                            </h3>
                            <p className="text-gray-400 mt-1 mb-4 max-w-sm">
                                {uploadedImage ? "Looking good! Now choose a theme below." : "Upload a clear, front-facing photo of a single person."}
                            </p>
                            <div className="flex gap-4 justify-center md:justify-start">
                                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors">
                                    {uploadedImage ? "Change Photo" : "Upload Photo"}
                                </button>
                                <button onClick={() => setIsCameraOpen(true)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-colors flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    <span>{uploadedImage ? "Retake" : "Use Camera"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg" className="hidden" />
                </div>

                {/* Template Selection */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">2. Choose a Theme</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Object.entries(templates).map(([key, data]) => (
                            <div
                                key={key}
                                onClick={() => setTemplate(key)}
                                className={`relative rounded-xl overflow-hidden cursor-pointer group border-4 transition-all duration-300 transform hover:scale-[1.02] shadow-lg
                                ${template === key ? 'border-yellow-400' : 'border-transparent hover:border-gray-700'}`}
                            >
                                <img src={data.imageUrl} alt={data.name} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 text-white text-lg font-bold tracking-wide">{data.name}</h3>
                                {template === key && (
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black rounded-full p-1">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customization */}
                {template && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">3. Customize (Optional)</h2>
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 max-w-4xl mx-auto">

                            {/* Seasons Options */}
                            {template === 'seasons' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-3">Select Season</label>
                                    <div className="flex flex-wrap gap-3">
                                        {templates.seasons.seasons.map(season => (
                                            <button
                                                key={season}
                                                onClick={() => setSelectedSeason(season)}
                                                className={`px-4 py-2 rounded-full border transition-all ${selectedSeason === season ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                            >
                                                {season}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Holidays Options */}
                            {template === 'holidays' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-3">Select Holiday</label>
                                    <div className="flex flex-wrap gap-3">
                                        {templates.holidays.holidays.map(holiday => (
                                            <button
                                                key={holiday}
                                                onClick={() => setSelectedHoliday(holiday)}
                                                className={`px-4 py-2 rounded-full border transition-all ${selectedHoliday === holiday ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                            >
                                                {holiday}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Media Options */}
                            {template === 'socialMedia' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-3">Select Platforms</label>
                                    <div className="space-y-4">
                                        {Object.entries(templates.socialMedia.platforms).map(([category, platforms]) => (
                                            <div key={category}>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{category}</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {platforms.map((p: any) => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => toggleSelection(p.id, selectedSocialPlatforms, setSelectedSocialPlatforms)}
                                                            className={`px-4 py-2 rounded-full border transition-all ${selectedSocialPlatforms.includes(p.id) ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                                        >
                                                            {p.id}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Hair Styler Options */}
                            {template === 'hairStyler' && (
                                <div className="mb-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-400 mb-3">Select Hair Styles</label>
                                        <div className="flex flex-wrap gap-3">
                                            {templates.hairStyler.prompts.map((p: any) => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => toggleSelection(p.id, selectedHairStyles, setSelectedHairStyles)}
                                                    className={`px-4 py-2 rounded-full border transition-all ${selectedHairStyles.includes(p.id) ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                                >
                                                    {p.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-3">Select Hair Color (Optional)</label>
                                        <div className="flex flex-wrap gap-3">
                                            {templates.hairStyler.hairColors.map((color: string) => (
                                                <button
                                                    key={color}
                                                    onClick={() => toggleSelection(color, hairColors, setHairColors)}
                                                    className={`px-4 py-2 rounded-full border transition-all ${hairColors.includes(color) ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Headshots Options */}
                            {template === 'headshots' && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-3">Expression</label>
                                        <div className="flex flex-wrap gap-3">
                                            {templates.headshots.expressions.map(exp => (
                                                <button
                                                    key={exp}
                                                    onClick={() => setHeadshotExpression(exp)}
                                                    className={`px-4 py-2 rounded-full border transition-all ${headshotExpression === exp ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                                >
                                                    {exp}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-3">Pose</label>
                                        <div className="flex flex-wrap gap-3">
                                            {templates.headshots.poses.map(pose => (
                                                <button
                                                    key={pose}
                                                    onClick={() => setHeadshotPose(pose)}
                                                    className={`px-4 py-2 rounded-full border transition-all ${headshotPose === pose ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                                >
                                                    {pose}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Style Lookbook Options */}
                            {template === 'styleLookbook' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-3">Choose a Fashion Style</label>
                                    <div className="flex flex-wrap gap-3">
                                        {[...templates.styleLookbook.styles, 'Other'].map(style => (
                                            <button
                                                key={style}
                                                onClick={() => setLookbookStyle(style)}
                                                className={`px-4 py-2 rounded-full border transition-all ${lookbookStyle === style ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'}`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                    {lookbookStyle === 'Other' && (
                                        <input
                                            type="text"
                                            placeholder="Describe your style..."
                                            value={customLookbookStyle}
                                            onChange={(e) => setCustomLookbookStyle(e.target.value)}
                                            className="mt-3 w-full bg-gray-800 border border-gray-600 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Generic Custom Style Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Custom Style Details</label>
                                <p className="text-xs text-gray-500 mb-2">Add extra details like "wearing a red hat" or "sunset background".</p>
                                <input
                                    type="text"
                                    placeholder="e.g., vintage polaroid effect..."
                                    value={customStyle}
                                    onChange={(e) => setCustomStyle(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500"
                                />
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleGenerateClick}
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-yellow-400 text-black font-bold text-xl rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-6 h-6" />
                                            <span>Generate Images</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div ref={resultsRef}>
                    {generatedImages.length > 0 && (
                        <>
                            <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Generated Photos</h2>
                            <BentoGallery
                                mediaItems={generatedImages}
                                onRegenerate={() => { }} // Implement specific regeneration if needed
                                onDownload={(url, title) => downloadImage(url, `${title}.png`)}
                                onDownloadOriginal={(url, title) => downloadImage(url, `${title}_original.png`)}
                                onLike={() => { }}
                                onShare={() => { }}
                                onSave={handleSave}
                            />

                            {/* Footer Actions */}
                            <div className="flex justify-center gap-4 mt-12 mb-20">
                                <button
                                    onClick={() => {
                                        setUploadedImage(null);
                                        setGeneratedImages([]);
                                        setTemplate(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-colors"
                                >
                                    Start Over
                                </button>
                                <button
                                    onClick={() => {
                                        generatedImages.forEach(img => {
                                            if (img.status === 'success' && img.url) {
                                                handleSave(img);
                                            }
                                        });
                                    }}
                                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full font-bold transition-colors flex items-center gap-2"
                                >
                                    <Heart className="w-5 h-5 fill-current" />
                                    Save All to Profile
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
