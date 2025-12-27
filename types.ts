export type ServiceMode = 'aluminium' | 'painting';

export interface GalleryItem {
  id: string;
  title: string;
  category: ServiceMode;
  service?: string; // Specific service type (e.g. 'Sliding Windows')
  author: string;
  date: string;
  imageUrl: string;
  images?: string[]; // Array of all images for the post
  type: 'image' | 'video';
  description?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  worker?: string; // Made optional since the table might not have this column
  date?: string; // Made optional since the table might not have this column
}

export interface FamilyMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const INITIAL_ALUMINIUM_SERVICES = [
  { title: "Sliding Windows", desc: "Smooth operation, durable frames.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" },
  { title: "Sliding Doors", desc: "Space-saving elegant designs.", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800" },
  { title: "Office Partitions", desc: "Modern aluminum & glass cabins.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
  { title: "Kitchen Covering", desc: "Custom aluminium covering for modular kitchens and cabinets.", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800" },
  { title: "PVC Folding Door", desc: "Waterproof space-saving doors for bathrooms and dividers.", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" },
  { title: "Mosquito Net Work", desc: "High-quality durable mesh for windows and balconies.", image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=800" },
];

export const INITIAL_PAINTING_SERVICES = [
  { title: "Wall Painting", desc: "Premium interior & exterior finishes.", image: "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/wall%20painting.png" },
  { title: "False Ceiling", desc: "Gypsum & POP decorative ceilings.", image: "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/false%20ceiling.jpeg" },
  { title: "Wall Putty", desc: "Smooth base for perfect finish.", image: "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/wall%20putty.jpeg" },
  { title: "POP Work", desc: "Intricate designs and moldings.", image: "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/pop%20work.jpg" },
  { title: "Exterior Painting", desc: "Weather-proof long lasting coats.", image: "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/exteriror%20painting.webp" },
  { title: "Texture Design", desc: "Artistic wall textures and stencils.", image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800" },
];

export const AUTHORS = ["Shankar Soni", "MANOJ SONI", "Santosh Soni"];