import React, { useState, useEffect } from 'react';
import { GalleryItem, AUTHORS, INITIAL_ALUMINIUM_SERVICES, INITIAL_PAINTING_SERVICES } from '../types';
import { getGalleryPosts } from '../utils/storage';
import { X, ZoomIn } from 'lucide-react';
import { useTheme } from '../App';

const GallerySection: React.FC = () => {
  const { mode } = useTheme();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'aluminium' | 'painting'>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all'); // New filter state
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Colors
  const textColor = mode === 'aluminium' ? 'text-blue-900' : 'text-purple-900';
  const accentColor = mode === 'aluminium' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white';
  const inactiveColor = 'bg-white text-gray-500 hover:bg-gray-100';

  useEffect(() => {
    // Load items
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGalleryPosts();
        setItems(data);
        setFilter(mode);
      } catch (err) {
        console.error('Error fetching gallery posts:', err);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mode]);

  useEffect(() => {
    let result = items;
    if (filter !== 'all') {
      result = result.filter(item => item.category === filter);
    }
    if (authorFilter !== 'all') {
      result = result.filter(item => item.author === authorFilter);
    }
    // New Service Filter Logic
    if (serviceFilter !== 'all') {
      result = result.filter(item => item.service === serviceFilter);
    }
    setFilteredItems(result);
  }, [items, filter, authorFilter, serviceFilter]);

  // Reset service filter when main category filter changes
  useEffect(() => {
    setServiceFilter('all');
  }, [filter]);

  const openLightbox = (item: GalleryItem) => setSelectedItem(item);
  const closeLightbox = () => setSelectedItem(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Determine available services based on current filter
  const availableServices = filter === 'aluminium'
    ? INITIAL_ALUMINIUM_SERVICES
    : filter === 'painting'
      ? INITIAL_PAINTING_SERVICES
      : [...INITIAL_ALUMINIUM_SERVICES, ...INITIAL_PAINTING_SERVICES];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto scroll-mt-24" id="gallery">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-4 ${textColor}`}>Selected Works</h2>
          <p className="text-gray-500 max-w-lg">Explore our portfolio of precision aluminium fabrication and artistic interior projects.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap justify-end">
          <div className="flex rounded-full bg-white p-1.5 shadow-sm border border-gray-100">
            {['all', 'aluminium', 'painting'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all capitalize ${filter === f ? accentColor + ' shadow-md' : inactiveColor
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Service Filter Dropdown */}
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none pl-6 pr-10 py-3 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer hover:border-gray-400 transition-colors shadow-sm max-w-[200px]"
            >
              <option value="all">All Services</option>
              {availableServices.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="appearance-none pl-6 pr-10 py-3 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
            >
              <option value="all">All Authors</option>
              {AUTHORS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading gallery items...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-20 text-red-500 bg-white rounded-3xl border border-dashed border-red-200">
          <p className="text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100 hover:border-transparent hover:-translate-y-2"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // Handle broken images
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <ZoomIn size={24} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider ${item.category === 'aluminium' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                      {item.category}
                    </span>
                    {item.service && (
                      <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider border border-gray-200">
                        {item.service}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">{formatDate(item.date)}</span>
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium">by {item.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-lg">No projects found for this selection.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/95 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2 bg-white/10 rounded-full"
          >
            <X size={32} />
          </button>

          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 items-center md:items-start bg-black/50 p-2 md:p-8 rounded-3xl overflow-hidden md:max-h-[90vh]">
            <div className="flex-1 flex items-center justify-center w-full">
              {selectedItem.type === 'video' ? (
                <video controls src={selectedItem.imageUrl} className="max-h-[60vh] md:max-h-[80vh] w-auto rounded-xl shadow-2xl" />
              ) : (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="max-h-[60vh] md:max-h-[80vh] w-full object-contain rounded-xl shadow-2xl bg-black"
                  onError={(e) => {
                    // Handle broken images
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';
                  }}
                />
              )}
            </div>

            <div className="w-full md:w-80 text-white shrink-0">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${selectedItem.category === 'aluminium' ? 'bg-blue-700' : 'bg-purple-600'}`}>
                  {selectedItem.category}
                </div>
                {selectedItem.service && (
                  <div className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/20">
                    {selectedItem.service}
                  </div>
                )}
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4">{selectedItem.title}</h3>
              <div className="w-12 h-1 bg-white/20 rounded-full mb-6"></div>
              <p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base">{selectedItem.description || "No description provided."}</p>

              <div className="space-y-4 border-t border-white/10 pt-6 text-sm">
                <div>
                  <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Executed By</span>
                  <span className="font-medium text-white">{selectedItem.author}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase font-bold mb-1">Date</span>
                  <span className="font-medium text-white">{formatDate(selectedItem.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;