'use client';

import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import CameraModal from './CameraModal';

interface MediaInputProps {
    currentImage: string | null;
    onImageChange: (imageDataUrl: string | null, file?: File) => void;
    label?: string;
    compact?: boolean;
}

export default function MediaInput({ currentImage, onImageChange, label = "Upload Photo", compact = false }: MediaInputProps) {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageChange(reader.result as string, file);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleCapture = (imageDataUrl: string) => {
        onImageChange(imageDataUrl);
        setIsCameraOpen(false);
    };

    // Compact Mode (for Remix Drawer)
    if (compact) {
        return (
            <>
                <div className="group relative aspect-square bg-white/5 rounded-xl border border-white/10 border-dashed hover:border-[#7c3aed]/50 hover:bg-white/10 transition-all cursor-pointer overflow-hidden">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {currentImage ? (
                        <>
                            <img src={currentImage} alt="Uploaded" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm py-1 text-center border-t border-white/10">
                                <span className="text-[9px] font-bold text-white tracking-wide">YOU</span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); // Prevent triggering file input
                                    onImageChange(null);
                                }}
                                className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-full text-white backdrop-blur-sm hover:bg-red-500/50 transition-colors z-20"
                            >
                                <X size={10} />
                            </button>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-500 group-hover:text-gray-300 pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <Upload size={14} />
                            </div>
                            <div className="flex flex-col items-center text-center px-1">
                                <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wide">Your Face</span>
                            </div>
                        </div>
                    )}
                </div>
                {/* Camera Button for Compact Mode - Optional, maybe add a small button below? 
                    For now, keeping it simple as per original design, but could add a camera toggle.
                */}
            </>
        );
    }

    // Full Mode (for Studio Page)
    return (
        <>
            <div className="w-full">
                <div
                    className={`
                        relative w-full aspect-video md:aspect-[2/1] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
                        ${isDragging ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}
                        ${currentImage ? 'border-transparent' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {currentImage ? (
                        <div className="relative w-full h-full group">
                            <img src={currentImage} alt="Preview" className="w-full h-full object-contain bg-black/50" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Change Photo
                                </button>
                                <button
                                    onClick={() => setIsCameraOpen(true)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors flex items-center gap-2"
                                >
                                    <Camera className="w-4 h-4" />
                                    Retake
                                </button>
                                <button
                                    onClick={() => onImageChange(null)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-full backdrop-blur-md transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center mb-4">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{label}</h3>
                            <p className="text-gray-400 mb-6 max-w-sm">
                                Drag and drop your photo here, or choose an option below.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full font-medium transition-colors flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload File
                                </button>
                                <button
                                    onClick={() => setIsCameraOpen(true)}
                                    className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-colors flex items-center gap-2"
                                >
                                    <Camera className="w-4 h-4" />
                                    Use Camera
                                </button>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCapture}
            />
        </>
    );
}
