import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
    console.log("Replicate API Route Hit");
    console.log("API Token exists:", !!process.env.REPLICATE_API_TOKEN);

    try {
        const { prompt, image, aspectRatio = '1:1' } = await req.json();
        console.log("Request params:", { prompt, hasImage: !!image, aspectRatio });

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let output;

        if (image) {
            // Image-to-Image Generation using SDXL
            // SDXL expects 'image' as input and 'prompt'
            // We might need to adjust strength/prompt_strength
            console.log("Using SDXL for Image-to-Image");
            output = await replicate.run(
                "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                {
                    input: {
                        prompt: prompt,
                        image: image, // Replicate accepts data URI
                        prompt_strength: 0.75, // Adjust as needed
                        refine: "expert_ensemble_refiner",
                        disable_safety_checker: true
                    }
                }
            );
        } else {
            // Text-to-Image Generation using Flux Schnell
            console.log("Using Flux Schnell for Text-to-Image");
            const validAspectRatio = aspectRatio === 'Auto' ? '1:1' : aspectRatio;
            output = await replicate.run(
                "black-forest-labs/flux-schnell",
                {
                    input: {
                        prompt: prompt,
                        aspect_ratio: validAspectRatio,
                        output_format: "png",
                        output_quality: 90,
                        disable_safety_checker: true
                    }
                }
            );
        }

        console.log("Replicate Output:", output);

        // Flux returns an array of output URLs (usually readable streams or URLs)
        // SDXL also returns an array
        let imageUrl = Array.isArray(output) ? output[0] : output;

        // Handle case where output might be an object (e.g. ReadableStream) or not a string
        if (typeof imageUrl !== 'string') {
            console.log("Output is not a string, attempting to stringify or extract:", imageUrl);
            if (imageUrl && typeof imageUrl === 'object' && 'toString' in imageUrl) {
                imageUrl = imageUrl.toString();
            } else {
                imageUrl = String(imageUrl);
            }
        }

        console.log("Final Image URL:", imageUrl);

        return NextResponse.json({ imageUrl });

    } catch (error: any) {
        console.error('Replicate API Error:', error);
        const errorMessage = error.message || 'Failed to generate image';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
