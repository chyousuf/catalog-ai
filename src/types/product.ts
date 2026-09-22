export interface MissingSpecItem {
  key: string;
  label: string;
  question: string;
  resolvedValue?: string;
  isSkipped?: boolean;
}

export interface ProductSpecifications {
  material?: string;
  dimensions?: string;
  certifications?: string;
  brand?: string;
  weight?: string;
  origin?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  knownDetails: string;
  imageUrl: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  tags: string[];
  seoMetaDescription: string;
  instagramCaption: string;
  specifications: ProductSpecifications;
  missingSpecs: MissingSpecItem[];
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIGenerationRequest {
  name: string;
  price: number;
  currency: string;
  knownDetails: string;
  imagePreview?: string;
  confirmedSpecs?: ProductSpecifications;
}

export interface AIGenerationResponse {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  tags: string[];
  seoMetaDescription: string;
  instagramCaption: string;
  specifications: ProductSpecifications;
  missingSpecs: MissingSpecItem[];
  source: 'gemini' | 'offline_engine';
}
