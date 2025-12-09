import { GalleryItem, Enquiry } from '../types';

const POSTS_KEY = 'cms_posts';
const ENQUIRIES_KEY = 'cms_enquiries';

const INITIAL_POSTS: GalleryItem[] = [
  {
    id: '1',
    title: 'Modern Office Partition',
    category: 'aluminium',
    author: 'Shankar Soni',
    date: '2023-10-15',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
    description: 'Glass and aluminium partition for a tech startup.'
  },
  {
    id: '2',
    title: 'Living Room Makeover',
    category: 'painting',
    author: 'MANOJ SONI',
    date: '2023-11-02',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000',
    description: 'Royal texture paint with false ceiling integration.'
  },
  {
    id: '3',
    title: 'Heavy Duty Sliding Door',
    category: 'aluminium',
    author: 'Santosh Soni',
    date: '2023-12-10',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000',
    description: 'Balcony slider with mosquito mesh.'
  },
  {
    id: '4',
    title: 'Exterior Villa Painting',
    category: 'painting',
    author: 'Shankar Soni',
    date: '2024-01-05',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1513584685908-2274653fa36f?auto=format&fit=crop&q=80&w=1000',
    description: 'Weather-proof coating for a 2-story villa.'
  }
];

export const getGalleryPosts = (): GalleryItem[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  if (!stored) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }
  return JSON.parse(stored);
};

export const addGalleryPost = (post: GalleryItem) => {
  const posts = getGalleryPosts();
  const newPosts = [post, ...posts];
  localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
};

export const getEnquiries = (): Enquiry[] => {
  const stored = localStorage.getItem(ENQUIRIES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addEnquiry = (enquiry: Enquiry) => {
  const list = getEnquiries();
  const newList = [enquiry, ...list];
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(newList));
};

export const deleteGalleryPost = (id: string) => {
    const posts = getGalleryPosts();
    const newPosts = posts.filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(newPosts));
};