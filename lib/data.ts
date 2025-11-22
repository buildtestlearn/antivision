// Image and Ideas Data

export interface Image {
    id: number;
    type: 'nanobanana' | 'veo';
    title: string;
    prompt: string;
    url: string;
    similar: number[];
}

export interface Idea {
    name: string;
    gradient: string;
}

export const images: Image[] = [
    {
        id: 1,
        type: 'nanobanana',
        title: 'Ethereal Landscape',
        prompt: 'A surreal landscape with floating islands, bioluminescent flora, and ethereal mist under a purple twilight sky',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        similar: [2, 3, 4, 5, 7, 9]
    },
    {
        id: 2,
        type: 'veo',
        title: 'Cyberpunk City',
        prompt: 'Neon-lit cyberpunk cityscape at night with holographic billboards, flying vehicles, and rain-soaked streets',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        similar: [1, 6, 7, 8, 10, 14]
    },
    {
        id: 3,
        type: 'nanobanana',
        title: 'Abstract Dreams',
        prompt: 'Abstract composition of flowing liquid metal, iridescent colors, and geometric patterns',
        url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
        similar: [4, 5, 9, 10, 13, 19]
    },
    {
        id: 4,
        type: 'veo',
        title: 'Ocean Depths',
        prompt: 'Underwater scene with bioluminescent creatures, coral reefs, and shafts of light from above',
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        similar: [1, 3, 11, 12, 15, 20]
    },
    {
        id: 5,
        type: 'nanobanana',
        title: 'Mountain Vista',
        prompt: 'Majestic mountain peaks at golden hour with dramatic clouds and alpine meadows',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        similar: [6, 7, 13, 14, 17, 1]
    },
    {
        id: 6,
        type: 'veo',
        title: 'Desert Dunes',
        prompt: 'Vast sand dunes under starlit sky with the Milky Way visible and subtle moonlight',
        url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
        similar: [2, 5, 8, 15, 17, 13]
    },
    {
        id: 7,
        type: 'nanobanana',
        title: 'Forest Magic',
        prompt: 'Mystical forest with ancient trees, glowing mushrooms, and magical particles in the air',
        url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
        similar: [1, 9, 10, 16, 3, 5]
    },
    {
        id: 8,
        type: 'veo',
        title: 'Aurora Sky',
        prompt: 'Northern lights dancing over snowy landscape with silhouetted pine trees',
        url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80',
        similar: [2, 6, 11, 17, 13, 1]
    },
    {
        id: 9,
        type: 'nanobanana',
        title: 'Crystal Cave',
        prompt: 'Interior of a crystal cave with glowing gems, stalactites, and refracted light beams',
        url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80',
        similar: [3, 7, 12, 18, 1, 15]
    },
    {
        id: 10,
        type: 'veo',
        title: 'Space Station',
        prompt: 'Futuristic space station orbiting Earth with solar panels and observation deck',
        url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80',
        similar: [3, 13, 14, 19, 2, 16]
    },
    {
        id: 11,
        type: 'nanobanana',
        title: 'Tropical Paradise',
        prompt: 'Pristine tropical beach with turquoise water, palm trees, and white sand at sunset',
        url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
        similar: [4, 8, 15, 20, 6, 17]
    },
    {
        id: 12,
        type: 'veo',
        title: 'Urban Garden',
        prompt: 'Rooftop garden in modern city with vertical farms, waterfalls, and skyline views',
        url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
        similar: [4, 9, 16, 1, 2, 18]
    },
    {
        id: 13,
        type: 'nanobanana',
        title: 'Fire and Ice',
        prompt: 'Volcano erupting with lava flows next to frozen glacier, creating steam and contrast',
        url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        similar: [5, 10, 17, 2, 6, 8]
    },
    {
        id: 14,
        type: 'veo',
        title: 'Cosmic Portal',
        prompt: 'Interdimensional portal with swirling energy, stars, and geometric patterns',
        url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
        similar: [5, 10, 18, 3, 2, 16]
    },
    {
        id: 15,
        type: 'nanobanana',
        title: 'Autumn Path',
        prompt: 'Winding path through autumn forest with golden leaves, morning fog, and sunbeams',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        similar: [6, 11, 19, 4, 7, 9]
    },
    {
        id: 16,
        type: 'veo',
        title: 'Neon Dreams',
        prompt: 'Abstract neon art installation with tubes of colored light in dark space',
        url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
        similar: [7, 12, 20, 5, 2, 14]
    },
    {
        id: 17,
        type: 'nanobanana',
        title: 'Stormy Seas',
        prompt: 'Dramatic ocean waves during storm with lightning, dark clouds, and spray',
        url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
        similar: [8, 13, 1, 6, 11, 5]
    },
    {
        id: 18,
        type: 'veo',
        title: 'Ancient Temple',
        prompt: 'Overgrown ancient temple ruins in jungle with vines, moss, and filtered sunlight',
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
        similar: [9, 14, 2, 7, 12, 1]
    },
    {
        id: 19,
        type: 'nanobanana',
        title: 'Glitch Art',
        prompt: 'Digital glitch art with distorted reality, RGB split, and pixel sorting effects',
        url: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80',
        similar: [10, 15, 3, 8, 13, 7]
    },
    {
        id: 20,
        type: 'veo',
        title: 'Zen Garden',
        prompt: 'Minimalist Japanese zen garden with raked sand patterns, rocks, and cherry blossom',
        url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
        similar: [11, 16, 4, 9, 12, 6]
    }
];

export const ideas = {
    nanobanana: [
        { name: 'Ethereal landscapes', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Abstract art concepts', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Mystical forest scenes', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { name: 'Dramatic nature', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { name: 'Surreal compositions', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { name: 'Organic patterns', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
    ],
    veo: [
        { name: 'Cyberpunk aesthetics', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { name: 'Neon cityscapes', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Futuristic architecture', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
        { name: 'Sci-fi scenes', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
        { name: 'Digital art styles', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { name: 'Space exploration', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
    ]
};
