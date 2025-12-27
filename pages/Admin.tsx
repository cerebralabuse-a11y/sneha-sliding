import React, { useState, useEffect } from 'react';
import { AUTHORS, GalleryItem, ServiceMode, Enquiry, INITIAL_ALUMINIUM_SERVICES, INITIAL_PAINTING_SERVICES } from '../types';
import { addGalleryPost, getGalleryPosts, getEnquiries, deleteGalleryPost, uploadImage } from '../utils/storage';
import { Trash2, ArrowLeft, LogOut, X } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'enquiries'>('posts');

  // New Post State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceMode>('aluminium');
  const [service, setService] = useState('');
  const [author, setAuthor] = useState(AUTHORS[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [desc, setDesc] = useState('');

  // Data Lists
  const [posts, setPosts] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Refresh enquiries when switching to the enquiries tab
  useEffect(() => {
    if (isAuthenticated && activeTab === 'enquiries') {
      refreshData();
    }
  }, [isAuthenticated, activeTab]);

  const refreshData = async () => {
    const postsData = await getGalleryPosts();
    setPosts(postsData);

    // Fetch enquiries with loading states
    if (activeTab === 'enquiries') {
      setLoadingEnquiries(true);
      setEnquiriesError(null);
      try {
        const enquiriesData = await getEnquiries();
        setEnquiries(enquiriesData);
        if (enquiriesData.length === 0) {
          setEnquiriesError('No enquiries found in the database');
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
        setEnquiriesError('Failed to fetch enquiries. Please check the console for details.');
      } finally {
        setLoadingEnquiries(false);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sneha123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  const handleImagesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setImages(prev => [...prev, ...uploadedUrls]);
      // Set the first image as main imageUrl if not already set
      if (!imageUrl && uploadedUrls.length > 0) {
        setImageUrl(uploadedUrls[0]);
      } else if (images.length === 0 && uploadedUrls.length > 0) {
        // Logic to fallback
        setImageUrl(uploadedUrls[0]);
      }
    }
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    // If we removed the currently set 'imageUrl' (cover), reset it to the first of the remaining
    if (newImages.length > 0) {
      setImageUrl(newImages[0]);
    } else {
      setImageUrl('');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required");
    if (!category) errors.push("Category is required");
    if (!service) errors.push("Service Type is required");
    if (!author) errors.push("Worker (Author) is required");
    if (!desc.trim()) errors.push("Description is required");
    if (images.length === 0 && !imageUrl) errors.push("At least one image is required");

    if (errors.length > 0) {
      alert("Please fill in all required fields:\n- " + errors.join("\n- "));
      return;
    }

    // Use existing imageUrl if images array is empty (backward compatibility fallback)
    // OR use the first image of the array as the cover
    const finalCoverUrl = images.length > 0 ? images[0] : imageUrl;
    const finalImages = images.length > 0 ? images : [imageUrl];

    const newPost = {
      title,
      category,
      service,
      author,
      imageUrl: finalCoverUrl,
      images: finalImages,
      type: 'image' as const,
      date: new Date().toISOString(),
      description: desc
    };

    try {
      await addGalleryPost(newPost);
      await refreshData();
      // Reset Form
      setTitle('');
      setImageUrl('');
      setImages([]);
      setDesc('');
      setService('');
      alert('Post added successfully!');
    } catch (error) {
      console.error("Error creating post:", error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deleteGalleryPost(id);
      await refreshData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-500">Sneha Sliding</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Password"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="#/" className="text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Nav */}
      <nav className="bg-white border-b px-4 py-3 md:px-6 md:py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <a href="#/" className="text-gray-500 hover:text-black"><ArrowLeft size={20} /></a>
          <h1 className="text-lg md:text-xl font-bold truncate">Sneha Sliding Admin</h1>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-red-600 flex items-center gap-1 md:gap-2 hover:bg-red-50 px-2 md:px-3 py-1 rounded-md text-sm md:text-base"
        >
          <LogOut size={16} className="md:w-[18px] md:h-[18px]" /> <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base flex-1 sm:flex-none text-center transition-colors ${activeTab === 'posts' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent shadow-sm'}`}
          >
            Manage Gallery
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 md:px-6 py-2 rounded-full font-medium text-sm md:text-base flex-1 sm:flex-none text-center transition-colors ${activeTab === 'enquiries' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-transparent shadow-sm'}`}
          >
            View Enquiries
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Create Post Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
              <h2 className="text-lg font-bold mb-4">Add New Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Images (Long press to select multiple on mobile)</label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImagesUpload(e.target.files)}
                    className="w-full border p-2 rounded bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {isUploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}

                  {/* Image Grid Preview */}
                  {images.length > 0 ? (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-20 object-cover rounded-md border" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center">Cover</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    imageUrl && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Preview</p>
                        <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
                      </div>
                    )
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={category} onChange={e => {
                    setCategory(e.target.value as ServiceMode);
                    setService(''); // Reset service when category changes
                  }} className="w-full border p-2 rounded">
                    <option value="aluminium">Aluminium</option>
                    <option value="painting">Painting</option>
                  </select>
                </div>

                {/* Dynamic Service Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <select value={service} onChange={e => setService(e.target.value)} className="w-full border p-2 rounded" required>
                    <option value="">Select Service...</option>
                    {category === 'aluminium' ? (
                      INITIAL_ALUMINIUM_SERVICES.map(s => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))
                    ) : (
                      INITIAL_PAINTING_SERVICES.map(s => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <select value={author} onChange={e => setAuthor(e.target.value)} className="w-full border p-2 rounded">
                    {AUTHORS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full border p-2 rounded" rows={3}></textarea>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Add to Gallery</button>
              </form>
            </div>

            {/* List Posts */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {posts.map(post => (
                        <tr key={post.id}>
                          <td className="p-4">
                            <img src={post.imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                          </td>
                          <td className="p-4 font-medium">{post.title}</td>
                          <td className="p-4 text-sm text-gray-500">{post.service || '-'}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded ${post.category === 'aluminium' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                              {post.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No posts yet.</td></tr>}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {posts.map(post => (
                    <div key={post.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex gap-4 items-start">
                      <img src={post.imageUrl} alt="" className="w-20 h-20 object-cover rounded-md shrink-0 bg-white" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 truncate pr-2">{post.title}</h3>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-red-500 hover:text-red-700 bg-white p-1.5 rounded shadow-sm border border-gray-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 truncate">{post.service || 'No service specified'}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wide ${post.category === 'aluminium' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No posts found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
        }

        {
          activeTab === 'enquiries' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Customer Enquiries</h2>
                <p className="text-sm text-gray-500">View all customer inquiries submitted through the website</p>
              </div>

              {loadingEnquiries ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p>Loading enquiries...</p>
                </div>
              ) : enquiriesError ? (
                <div className="p-8 text-center">
                  <p className="text-red-500 mb-2">{enquiriesError}</p>
                  <button
                    onClick={refreshData}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="p-4">Date</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Worker</th>
                          <th className="p-4">Message</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {enquiries.map((enq, idx) => (
                          <tr key={enq.id || idx}>
                            <td className="p-4 whitespace-nowrap text-gray-500 text-sm">
                              {enq.date ? new Date(enq.date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-4 font-bold">{enq.name || 'N/A'}</td>
                            <td className="p-4 text-blue-600">
                              <a href={`tel:${enq.phone}`}>{enq.phone || 'N/A'}</a>
                            </td>
                            <td className="p-4">{enq.worker || 'Not specified'}</td>
                            <td className="p-4 text-gray-600 max-w-xs">{enq.message || 'No message'}</td>
                          </tr>
                        ))}
                        {enquiries.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                              <p>No enquiries received yet.</p>
                              <p className="text-sm mt-2">Customer enquiries will appear here once submitted through the website.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {enquiries.map((enq, idx) => (
                      <div key={enq.id || idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">
                              {enq.date ? new Date(enq.date).toLocaleDateString() : 'N/A'}
                            </span>
                            <h3 className="font-bold text-lg">{enq.name || 'N/A'}</h3>
                          </div>
                          {enq.worker && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {enq.worker}
                            </span>
                          )}
                        </div>

                        <a href={`tel:${enq.phone}`} className="text-blue-600 font-medium block mb-3 flex items-center gap-2">
                          <span>📞</span> {enq.phone || 'N/A'}
                        </a>

                        <div className="bg-white p-3 rounded border border-gray-100 text-sm text-gray-600">
                          {enq.message || 'No message'}
                        </div>
                      </div>
                    ))}
                    {enquiries.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No enquiries yet.
                      </div>
                    )}
                  </div>

                  {enquiries.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t text-sm text-gray-500">
                      Showing {enquiries.length} enquiry(s)
                    </div>
                  )}
                </>
              )}
            </div>
          )
        }
      </div >
    </div >
  );
};

export default Admin;