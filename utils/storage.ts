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
    console.log('Fetching enquiries from Supabase...');
    
    // First, let's check what columns exist in the table
    const { data: sampleData, error: sampleError } = await supabase
      .from('enquiries')
      .select('*')
      .limit(1);
      
    if (sampleError) {
      console.error("Error checking table structure:", sampleError);
    } else if (sampleData && sampleData.length > 0) {
      console.log('Available columns in enquiries table:', Object.keys(sampleData[0]));
    }
    
    // Try to fetch enquiries with various ordering options
    let data: any[] | null = null;
    let error: any = null;
    
    // Try ordering by created_at first (common timestamp column)
    const result1 = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (result1.error) {
      console.log('Failed to order by created_at, trying date column...');
      
      // Try ordering by date column
      const result2 = await supabase
        .from('enquiries')
        .select('*')
        .order('date', { ascending: false })
        .limit(100);
        
      if (result2.error) {
        console.log('Failed to order by date, trying without specific ordering...');
        
        // Try without specific ordering
        const result3 = await supabase
          .from('enquiries')
          .select('*')
          .limit(100);
          
        data = result3.data;
        error = result3.error;
      } else {
        data = result2.data;
        error = result2.error;
      }
    } else {
      data = result1.data;
      error = result1.error;
    }

    if (error) {
      console.error("Error fetching enquiries:", error);
      return [];
    }
    
    console.log(`Successfully fetched ${data?.length || 0} enquiries`);
    
    // Transform the data to match our Enquiry interface
    if (data && data.length > 0) {
      const transformedData: Enquiry[] = data.map(item => ({
        id: item.id || '',
        name: item.name || '',
        phone: item.phone || '',
        message: item.message || '',
        worker: item.worker || item.Worker || '', // Handle case variations
        date: item.date || item.created_at || item.Date || '' // Handle different timestamp fields
      }));
      
      return transformedData;
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return [];
  }
};

export const addEnquiry = async (enquiry: Omit<Enquiry, 'id'>) => {
  try {
    console.log('Attempting to add enquiry:', enquiry);
    
    // Check if Supabase client is properly initialized
    if (!supabase) {
      console.error('Supabase client is not initialized');
      return false;
    }
    
    // First, try to get the actual table structure
    console.log('Checking table structure...');
    
    // Try a simple select to see what columns exist
    const { data: sampleData, error: sampleError } = await supabase
      .from('enquiries')
      .select('*')
      .limit(1);
      
    let existingColumns: string[] = [];
    if (sampleData && sampleData.length > 0) {
      existingColumns = Object.keys(sampleData[0]);
      console.log('Existing columns in enquiries table:', existingColumns);
    } else if (!sampleError) {
      console.log('Enquiries table is empty, will try to insert with basic fields');
    } else {
      console.log('Could not determine table structure, proceeding with basic fields');
    }
    
    // Create an enquiry object with only the fields that are likely to exist
    const safeEnquiry: Record<string, any> = {};
    
    // Always include these basic fields if they exist in the enquiry
    if ('name' in enquiry) safeEnquiry.name = enquiry.name;
    if ('phone' in enquiry) safeEnquiry.phone = enquiry.phone;
    if ('message' in enquiry) safeEnquiry.message = enquiry.message;
    
    // Only include worker if it exists in the original enquiry AND the table likely has it
    if ('worker' in enquiry && enquiry.worker) {
      // For now, let's not include worker until we confirm the table has it
      // safeEnquiry.worker = enquiry.worker;
      console.log('Worker field present in enquiry but not being inserted to avoid column errors');
    }
    
    // Only include date if the table likely has a timestamp column
    if ('date' in enquiry && enquiry.date) {
      // Try common timestamp column names
      // safeEnquiry.created_at = enquiry.date;
      console.log('Date field present in enquiry but not being inserted to avoid column errors');
    }
    
    console.log('Inserting safe enquiry object:', safeEnquiry);
    
    // Try inserting with only basic fields
    const { data, error } = await supabase
      .from('enquiries')
      .insert([safeEnquiry])
      .select()
      .single();

    if (error) {
      console.error("Error adding enquiry:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Handle RLS policy violation
      if (error.code === '42501') {
        console.warn('RLS policy violation detected. This is likely because your Supabase table has Row Level Security enabled but no policies allowing inserts.');
        console.warn('Possible solutions:');
        console.warn('1. Disable RLS on the enquiries table in Supabase');
        console.warn('2. Add an RLS policy allowing anonymous inserts');
        console.warn('3. Use service key for inserts (not recommended for client-side)');
        return false;
      }
      
      // Handle column not found errors
      if (error.code === 'PGRST204') {
        console.warn('Column not found error. This suggests the table structure is different from what we expect.');
        console.warn('Current enquiry object keys:', Object.keys(enquiry));
        console.warn('Safe enquiry object keys:', Object.keys(safeEnquiry));
        return false;
      }
      
      return false;
    }
    
    console.log('Successfully added enquiry:', data);
    return true;
  } catch (error) {
    console.error("Error adding enquiry:", error);
    return false;
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