import React, { useState, useEffect } from 'react';
import { AUTHORS, GalleryItem, ServiceMode, Enquiry } from '../types';
import { addGalleryPost, getGalleryPosts, getEnquiries, deleteGalleryPost } from '../utils/storage';
import { Trash2, ArrowLeft, LogOut } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'enquiries'>('posts');

  // New Post State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceMode>('aluminium');
  const [author, setAuthor] = useState(AUTHORS[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [desc, setDesc] = useState('');

  // Data Lists
  const [posts, setPosts] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setPosts(getGalleryPosts());
    setEnquiries(getEnquiries());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sneha123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload an image before submitting.');
      return;
    }
    const newPost: GalleryItem = {
      id: Date.now().toString(),
      title,
      category,
      author,
      imageUrl,
      type: 'image',
      date: new Date().toLocaleDateString(),
      description: desc
    };
    addGalleryPost(newPost);
    refreshData();
    // Reset Form
    setTitle('');
    setImageUrl('');
    setDesc('');
    alert('Post added successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deleteGalleryPost(id);
      refreshData();
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
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="#/" className="text-gray-500 hover:text-black"><ArrowLeft size={20} /></a>
          <h1 className="text-xl font-bold">Sneha Sliding Admin</h1>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-red-600 flex items-center gap-2 hover:bg-red-50 px-3 py-1 rounded-md"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-2 rounded-full font-medium ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Manage Gallery
          </button>
          <button 
            onClick={() => setActiveTab('enquiries')}
            className={`px-6 py-2 rounded-full font-medium ${activeTab === 'enquiries' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            View Enquiries
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Create Post Form */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
              <h2 className="text-lg font-bold mb-4">Add New Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Image</label>
                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e.target.files?.[0] || null)}
                    className="w-full border p-2 rounded bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, WEBP (max few MB).</p>
                  {imageUrl && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Preview</p>
                      <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value as ServiceMode)} className="w-full border p-2 rounded">
                    <option value="aluminium">Aluminium</option>
                    <option value="painting">Painting</option>
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
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">Title</th>
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
                    {posts.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No posts yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enquiries.map((enq, idx) => (
                  <tr key={idx}>
                    <td className="p-4 whitespace-nowrap text-gray-500 text-sm">{enq.date}</td>
                    <td className="p-4 font-bold">{enq.name}</td>
                    <td className="p-4 text-blue-600">{enq.phone}</td>
                    <td className="p-4 text-gray-600 max-w-xs">{enq.message}</td>
                  </tr>
                ))}
                 {enquiries.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No enquiries received yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;