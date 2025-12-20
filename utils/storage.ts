import { GalleryItem, Enquiry } from '../types';
import { supabase } from '../src/supabase';

const INITIAL_POSTS: Omit<GalleryItem, 'id'>[] = [
  {
    title: 'Modern Office Partition',
    category: 'aluminium',
    author: 'Shankar Soni',
    date: '2023-10-15',
    type: 'image',
    imageUrl: 'https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/shankarsoni.jpg',
    description: 'Glass and aluminium partition for a tech startup.'
  },
  {
    title: 'Living Room Makeover',
    category: 'painting',
    author: 'MANOJ SONI',
    date: '2023-11-02',
    type: 'image',
    imageUrl: 'https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/manojsoni.jpg',
    description: 'Royal texture paint with false ceiling integration.'
  },
  {
    title: 'Heavy Duty Sliding Door',
    category: 'aluminium',
    author: 'Santosh Soni',
    date: '2023-12-10',
    type: 'image',
    imageUrl: 'https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/blog_thumb_1760688683.webp',
    description: 'Balcony slider with mosquito mesh.'
  },
  {
    title: 'Exterior Villa Painting',
    category: 'painting',
    author: 'Shankar Soni',
    date: '2024-01-05',
    type: 'image',
    imageUrl: 'https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/Ombre_Elegance_08ec1c43a1.webp',
    description: 'Weather-proof coating for a 2-story villa.'
  }
];

// Initialize Supabase with initial posts if table is empty
const initializeGalleryPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .limit(1);

    if (error) {
      console.error("Error checking gallery posts:", error);
      return;
    }

    // If table is empty, add initial posts
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('gallery')
        .insert(INITIAL_POSTS);

      if (insertError) {
        console.error("Error inserting initial gallery posts:", insertError);
      } else {
        console.log("Initial gallery posts inserted successfully");
      }
    } else {
      console.log("Gallery table already has data, skipping initialization");
    }
  } catch (error) {
    console.error("Error initializing gallery posts:", error);
  }
};

// Initialize enquiries table if empty
const initializeEnquiries = async () => {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .limit(1);

    if (error) {
      console.error("Error checking enquiries:", error);
      return;
    }

    // Create table if it doesn't exist by inserting and then deleting a dummy record
    if (!data || data.length === 0) {
      console.log("Enquiries table initialized");
    }
  } catch (error) {
    console.error("Error initializing enquiries:", error);
  }
};

// Call initialization
initializeGalleryPosts();
initializeEnquiries();

export const getGalleryPosts = async (): Promise<GalleryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching gallery posts:", error);
      return [];
    }

    return data as GalleryItem[];
  } catch (error) {
    console.error("Error fetching gallery posts:", error);
    return [];
  }
};

export const addGalleryPost = async (post: Omit<GalleryItem, 'id'>) => {
  try {
    const { error } = await supabase
      .from('gallery')
      .insert([post]);

    if (error) {
      console.error("Error adding gallery post:", error);
    }
  } catch (error) {
    console.error("Error adding gallery post:", error);
  }
};

export const getEnquiries = async (): Promise<Enquiry[]> => {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching enquiries:", error);
      return [];
    }

    return data as Enquiry[];
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return [];
  }
};

export const addEnquiry = async (enquiry: Omit<Enquiry, 'id'>) => {
  try {
    const { error } = await supabase
      .from('enquiries')
      .insert([enquiry]);

    if (error) {
      console.error("Error adding enquiry:", error);
    }
  } catch (error) {
    console.error("Error adding enquiry:", error);
  }
};

export const deleteGalleryPost = async (id: string) => {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting gallery post:", error);
    }
  } catch (error) {
    console.error("Error deleting gallery post:", error);
  }
};

// Upload image to Supabase Storage
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};