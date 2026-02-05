import type { ElementType } from 'react';

export enum AdType {
  IMAGE = 'image',
  UGC_AD = 'ugc_ad',
  VFX_AD = 'vfx_ad',
  NO_HUMAN_AD = 'no_human_ad'
}

export interface FormData {
  productUrl: string;
  productDetails: string;
  adType: AdType;
  productImage: File | null;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: ElementType;
  gradient: string;
}