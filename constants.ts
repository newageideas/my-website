
import { ContentItem, BioCardProps } from './types';

// ============================================================================
// 🟢 SETUP INSTRUCTIONS:
// To use your own images, place them in the 'public' folder and update the 
// thumbnailUrl below (e.g., '/my-image.jpg').
// ============================================================================

const RESTAURANT_LOOP = "/restaurant.mp4"; 
const BAR_LOOP = "/bar.mp4"; 
const FILM_LOOP = "/film.mp4"; 
const TUTORIAL_LOOP = "/tutorial.mp4";

// Real Unsplash Images matching the futuristic/neon aesthetic
const IMG_RESTAURANT = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"; // Cyberpunk cocktail/food vibe
const IMG_BAR = "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop"; // Neon club/bar vibe
const IMG_WEB = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop"; // Cyberpunk city/tech
const IMG_APP = "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop"; // Tech/Mobile abstract

// ============================================================================

export const CONTENT_ITEMS: ContentItem[] = [
    {
        id: 'restaurant-full',
        category: 'RESTAURANT ADS',
        title: 'Crave-Worthy Ads',
        thumbnailUrl: IMG_RESTAURANT,
        previewVideoUrl: RESTAURANT_LOOP, 
        fullVideoEmbedId: 'EngW7tLk6R8', 
        fullVideoUrl: RESTAURANT_LOOP, 
        description: 'STOP THE SCROLL',
        longDescription: 'Make your menu look so good they can\'t scroll past. We turn basic kitchen footage into cinematic masterpieces that spark instant cravings. High-energy visuals designed to drive orders and put your most profitable dishes in the spotlight.'
    },
    {
        id: 'bar-full',
        category: 'BAR PROMOTIONS',
        title: 'The Vibe Shift',
        thumbnailUrl: IMG_BAR,
        previewVideoUrl: BAR_LOOP, 
        fullVideoUrl: BAR_LOOP, 
        description: 'OWN THE NIGHT',
        longDescription: 'Capture the Friday night feeling. We craft high-end motion graphics for your drinks that scream "luxury" and "fun." It’s not just a cocktail ad; it’s a digital invitation that packs your venue with the right crowd.'
    },
    {
        id: 'web-design-full',
        category: 'WEB DESIGN',
        title: 'Digital Flagships',
        thumbnailUrl: IMG_WEB,
        previewVideoUrl: TUTORIAL_LOOP, 
        fullVideoEmbedId: 'WhWc3b3KhnY',
        fullVideoUrl: TUTORIAL_LOOP,
        description: 'FUTURE PROOF',
        longDescription: 'Ditch the boring templates. We build immersive, lightning-fast websites that feel like the future. Designed to hook the new generation instantly, our sites mix 3D visuals with speed to convert casual visitors into superfans.'
    },
    {
        id: 'app-dev-full',
        category: 'APP DEVELOPMENT',
        title: 'Pocket Powerhouse',
        thumbnailUrl: IMG_APP,
        previewVideoUrl: FILM_LOOP, 
        fullVideoEmbedId: 'YE7VzlLtp-4', 
        fullVideoUrl: FILM_LOOP,
        description: 'STAY CONNECTED',
        longDescription: 'Your brand, 24/7 in their pocket. We build slick, gamified apps that customers actually want to use. From seamless ordering to addictive loyalty rewards, we create custom ecosystems that keep them coming back for more.'
    }
];

export const VALUE_PROPS: BioCardProps[] = [
    {
        icon: '💰',
        title: 'Stop Wasting Cash',
        description: 'Our AI predicts what your customers actually want. We highlight high-profit items to kill food waste and inventory loss before it hits your bottom line.',
        tooltip: 'AI Capability: Predictive demand forecasting models.'
    },
    {
        icon: '🕰️',
        title: 'Staff Smarter',
        description: 'Get customers in the door exactly when you need them. Our targeted ads fill seats during slow shifts so you\'re never paying staff to stand around.',
        tooltip: 'AI Capability: Traffic pattern analysis & shift scheduling.'
    },
    {
        icon: '🧠',
        title: 'Marketing on Autopilot',
        description: 'Forget the stress of content creation. We handle the visuals, the copy, and the strategy so you can get back to running your business.',
        tooltip: 'AI Capability: Generative image creation & automated copy.'
    },
    {
        icon: '✅',
        title: 'Pro Quality, Low Price',
        description: 'We use AI to automate the expensive boring stuff. You get Hollywood-level production value without the Hollywood-level price tag.',
        tooltip: 'AI Capability: Automated post-production & rendering pipelines.'
    }
];