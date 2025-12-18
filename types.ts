
export interface ContentItem {
    id: string;
    title: string;
    category: 'RESTAURANT ADS' | 'BAR PROMOTIONS' | 'WEB DESIGN' | 'APP DEVELOPMENT';
    thumbnailUrl: string; // New field for the cover image
    previewVideoUrl: string; // URL for the circular loop
    fullVideoEmbedId?: string; // YouTube ID for the modal (optional if fullVideoUrl is provided)
    fullVideoUrl?: string; // Local MP4 URL for the modal (optional)
    description: string;
    longDescription: string;
}

export interface BioCardProps {
    icon: string;
    title: string;
    description: string;
    tooltip: string;
}