import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        // Fetch the image
        const imageResp = await fetch(imageUrl);
        const imageBuffer = await imageResp.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

        const result = await model.generateContent([
            "Describe this image in detail to be used as a prompt for an image generator. Focus on the subject, style, lighting, and composition. Keep it concise.",
            {
                inlineData: {
                    data: base64Image,
                    mimeType: imageResp.headers.get('content-type') || 'image/jpeg',
                },
            },
        ]);

        const response = result.response;
        const description = response.text().trim();

        return NextResponse.json({ description });
    } catch (error) {
        console.error('Gemini Vision API Error:', error);
        return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }
}
