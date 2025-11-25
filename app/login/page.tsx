'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const { signInWithGoogle } = useAuth();
    const supabase = createClient();
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#13131a] rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold font-['Outfit'] tracking-tight mb-2">
                        <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">AI</span>
                        {' '}Remix
                    </h1>
                    <p className="text-[#a0a0b8]">
                        {isSignUp ? 'Create an account to start remixing' : 'Sign in to save your remixes'}
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <button
                        onClick={handleGoogleLogin}
                        className="text-[#7c3aed] hover:underline font-medium"
                    >
                        {isSignUp ? 'Sign in' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
