export type ServiceMode = 'aluminium' | 'painting';

export interface GalleryItem {
  id: string;
  title: string;
  category: ServiceMode;
  author: string;
  date: string;
  imageUrl: string;
  type: 'image' | 'video';
  description?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
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
  { title: "Toughened Glass", desc: "High safety and strength glazing.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800" },
  { title: "Mosquito Mesh", desc: "Durable protection nets.", image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?auto=format&fit=crop&q=80&w=800" },
  { title: "Fabrication", desc: "Custom industrial aluminium work.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" },
];

export const INITIAL_PAINTING_SERVICES = [
  { title: "Wall Painting", desc: "Premium interior & exterior finishes.", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800" },
  { title: "False Ceiling", desc: "Gypsum & POP decorative ceilings.", image: "https://images.unsplash.com/photo-1594445339843-162eb995a56d?auto=format&fit=crop&q=80&w=800" },
  { title: "Wall Putty", desc: "Smooth base for perfect finish.", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800" },
  { title: "POP Work", desc: "Intricate designs and moldings.", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800" },
  { title: "Exterior Painting", desc: "Weather-proof long lasting coats.", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800" },
  { title: "Texture Design", desc: "Artistic wall textures and stencils.", image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=800" },
];

export const AUTHORS = ["Shankar Soni", "MANOJ SONI", "Santosh Soni"];