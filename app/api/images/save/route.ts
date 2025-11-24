import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { image_url, prompt, template_id } = body;

        if (!image_url) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        // 1. Download the image from the temporary URL
        const imageResponse = await fetch(image_url);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image from URL: ${imageResponse.statusText}`);
        }
        const imageBlob = await imageResponse.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Upload to Supabase Storage
        // 2. Upload to Supabase Storage (Using 'remixes' bucket as it's already configured)
        const fileName = `generated/${user.id}/${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
            .from('remixes')
            .upload(fileName, buffer, {
                contentType: 'image/png',
                upsert: false
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw new Error(`Failed to upload to storage: ${uploadError.message}`);
        }

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('remixes')
            .getPublicUrl(fileName);

        // 4. Save Metadata to DB
        const { data, error } = await supabase
            .from('generated_images')
            .insert([
                {
                    user_id: user.id,
                    image_url: publicUrl, // Use the permanent Storage URL
                    prompt,
                    template_id
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error saving image:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Server error saving image:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message,
            hint: 'Check if generated_images bucket exists and is public.'
        }, { status: 500 });
    }
}
