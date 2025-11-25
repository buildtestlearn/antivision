'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Sparkles, Image as ImageIcon, User } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Don't show nav on the actual camera capture view if we were to have a dedicated route for it,
    // but for now we just wrap everything.
    // We can conditionally hide it if needed.

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Studio', href: '/studio', icon: Sparkles },
        { name: 'Remix', href: '/remix', icon: ImageIcon }, // Assuming /remix or similar exists, or maybe just a placeholder
        { name: 'Profile', href: '/u/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-caveat text-2xl font-bold text-white tracking-tight">
                                Picture<span className="text-yellow-400">Me</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-yellow-400"
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden bg-gray-900 border-b border-white/10"
                        >
                            <div className="px-4 pt-2 pb-4 space-y-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${isActive
                                                    ? 'bg-yellow-400/10 text-yellow-400'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
