'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ElementType;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon: Icon,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const variants = {
        primary: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-lg shadow-yellow-400/20",
        secondary: "bg-gray-800 text-white hover:bg-gray-700",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${sizes[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && Icon && <Icon className="w-4 h-4" />}
            {children}
        </motion.button>
    );
}
