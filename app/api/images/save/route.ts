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

        const { data, error } = await supabase
            .from('generated_images')
            .insert([
                {
                    user_id: user.id,
                    image_url,
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
            hint: 'Check if generated_images table exists and RLS policies are set.'
        }, { status: 500 });
    }
}
