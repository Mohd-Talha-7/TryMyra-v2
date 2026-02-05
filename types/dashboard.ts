export type Screen = 'dashboard' | 'generate-ad' | 'my-creations' | 'wallet' | 'settings' | 'support';

export interface Generation {
    id: string;
    title: string;
    type: 'Image' | 'VFX' | 'UGC Video' | 'Script';
    status: 'Ready' | 'Processing' | 'Failed';
    imageUrl?: string;
    content?: string;
    createdAt: number;
}

export interface AdRequest {
    productName: string;
    description: string;
    platform: string;
    mood: string;
}
