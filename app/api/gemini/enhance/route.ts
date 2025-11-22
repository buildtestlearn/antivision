import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const result = await model.generateContent(`
            You are an expert AI image prompt engineer. 
            Enhance the following user prompt to create a high-quality, detailed, and artistic image generation prompt.
            Keep it under 40 words. Focus on lighting, texture, and style.
            
            User Prompt: "${prompt}"
            
            Enhanced Prompt:
        `);

        const response = result.response;
        const enhancedPrompt = response.text().trim();

        return NextResponse.json({ enhancedPrompt });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'Failed to enhance prompt' }, { status: 500 });
    }
}
