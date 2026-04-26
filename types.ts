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
  { title: "Sliding Windows", desc: "Smooth operation, durable frames.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/Modern-sliding-windows-with-sleek-black-frames-and-plants-e1747982285374.webp" },
  { title: "Sliding Doors", desc: "Space-saving elegant designs.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/Wooden%20Sliding%201.webp" },
  { title: "Office Partitions", desc: "Modern aluminum & glass cabins.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/aluminium-partition-982.webp" },
  { title: "Kitchen Covering", desc: "Custom aluminium covering for modular kitchens and cabinets.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/WhatsApp%20Image%202026-04-26%20at%207.41.42%20PM.jpeg" },
  { title: "PVC Folding Door", desc: "Waterproof space-saving doors for bathrooms and dividers.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/pvc-folding-door.jpg" },
  { title: "Mosquito Net Work", desc: "High-quality durable mesh for windows and balconies.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/20230927061352-de1aa8bf-5a68-46cd-8a0a-73205add6399.jpg" },
];

export const INITIAL_PAINTING_SERVICES = [
  { title: "Wall Painting", desc: "Premium interior & exterior finishes.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/wall%20painting.png" },
  { title: "False Ceiling", desc: "Gypsum & POP decorative ceilings.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/false%20ceiling.jpeg" },
  { title: "Wall Putty", desc: "Smooth base for perfect finish.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/wall%20putty.jpeg" },
  { title: "POP Work", desc: "Intricate designs and moldings.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/pop%20work.jpg" },
  { title: "Exterior Painting", desc: "Weather-proof long lasting coats.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/exteriror%20painting.webp" },
  { title: "Texture Design", desc: "Artistic wall textures and stencils.", image: "https://momqzfnyzhfdyiwtjqis.supabase.co/storage/v1/object/public/gallery-images/22c3533fbdfd39031d2b00e3e8585e23.jpg" },
];

export const AUTHORS = ["Shankar Soni", "Manoj Soni", "Santosh Soni"];