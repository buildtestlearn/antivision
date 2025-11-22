'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RemixContextType {
    isOpen: boolean;
    selectedStyleImage: string | null;
    openRemix: (image?: string) => void;
    closeRemix: () => void;
    setSelectedStyleImage: (url: string | null) => void;
}

const RemixContext = createContext<RemixContextType | undefined>(undefined);

export function RemixProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStyleImage, setSelectedStyleImage] = useState<string | null>(null);

    const openRemix = (image?: string) => {
        if (image) {
            setSelectedStyleImage(image);
        }
        setIsOpen(true);
    };

    const closeRemix = () => {
        setIsOpen(false);
    };

    return (
        <RemixContext.Provider value={{ isOpen, selectedStyleImage, openRemix, closeRemix, setSelectedStyleImage }}>
            {children}
        </RemixContext.Provider>
    );
}

export function useRemix() {
    const context = useContext(RemixContext);
    if (context === undefined) {
        throw new Error('useRemix must be used within a RemixProvider');
    }
    return context;
}
