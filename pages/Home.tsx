import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import { INITIAL_ALUMINIUM_SERVICES, INITIAL_PAINTING_SERVICES } from '../types';
import { ToggleLeft, ToggleRight, Phone, Mail, MapPin, ArrowRight, CheckCircle2, Instagram, Facebook } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import GallerySection from '../components/GallerySection';
import { addEnquiry } from '../utils/storage';

const Navbar: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const isAlu = mode === 'aluminium';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-2 md:px-4`}>
      <div className={`max-w-7xl mx-auto rounded-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3 px-4 md:px-6' : 'bg-transparent py-4 px-4'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${isAlu ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-purple-600 to-purple-700'}`}>
              <span className="text-lg">S</span>
            </div>
            <span className={`font-sans text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white drop-shadow-md'}`}>
              Sneha Sliding<span className="opacity-70">.</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className={`hidden md:flex gap-8 text-sm font-semibold tracking-wide ${scrolled ? 'text-gray-600' : 'text-white/90'}`}>
              <a href="#services" className="hover:text-current transition-opacity hover:opacity-70">Services</a>
              <a href="#gallery" className="hover:text-current transition-opacity hover:opacity-70">Work</a>
              <a href="#about" className="hover:text-current transition-opacity hover:opacity-70">About</a>
              <a href="#contact" className="hover:text-current transition-opacity hover:opacity-70">Contact</a>
            </div>

            <button
              onClick={toggleMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95 ${isAlu
                ? 'bg-white text-blue-700 border-blue-100'
                : 'bg-white text-purple-700 border-purple-100'
                }`}
            >
              {isAlu ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
              <span className="text-xs font-bold uppercase tracking-wider">{mode === 'aluminium' ? 'Glass Work' : 'Interior'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Home: React.FC = () => {
  const { mode } = useTheme();
  const isAlu = mode === 'aluminium';

  // --- Dynamic Data ---
  const services = isAlu ? INITIAL_ALUMINIUM_SERVICES : INITIAL_PAINTING_SERVICES;
  const themeColor = isAlu ? 'text-blue-900' : 'text-purple-900';
  const themeSubColor = isAlu ? 'text-blue-500' : 'text-purple-600';
  const themeBg = isAlu ? 'bg-blue-50' : 'bg-purple-50';

  // Modern gradient buttons
  const primaryBtnClass = isAlu
    ? 'bg-blue-600 text-white shadow-glow-slate hover:bg-blue-700'
    : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-glow-orange hover:from-purple-700 hover:to-purple-800';

  // --- Hero Image Logic ---
  const heroImage = isAlu
    ? "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/blog_thumb_1760688683.webp"
    : "https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/Ombre_Elegance_08ec1c43a1.webp";

  // --- Contact Form State ---
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', worker: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addEnquiry({
      ...formData,
      date: new Date().toISOString()
    });

    if (success) {
      setFormStatus('success');
      setFormData({ name: '', phone: '', message: '', worker: '' });
    } else {
      alert('Failed to submit enquiry. Please check the console for details.');
    }

    setTimeout(() => setFormStatus('idle'), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-black/10`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Hero" className="w-full h-full object-cover scale-105" />
          <div className={`absolute inset-0 bg-gradient-to-r ${isAlu ? 'from-blue-900/90 via-blue-900/70 to-blue-900/20' : 'from-purple-900/90 via-purple-900/70 to-purple-900/20'}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className={`inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full text-xs font-bold tracking-widest text-white border border-white/20 backdrop-blur-sm uppercase`}>
              <span className={`w-2 h-2 rounded-full ${isAlu ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
              {isAlu ? 'Premium Glass & Sliding Systems' : 'Creative Interior & Paint'}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
              {isAlu ? <>Sneha <span className="text-blue-300">Sliding</span></> : <>Sneha <span className="text-purple-300">Interiors</span></>}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-xl leading-relaxed font-light">
              {isAlu
                ? 'Expert craftsmanship in aluminium sliding windows, modern office partitions, and custom glass fabrication.'
                : 'Transforming homes with vibrant colors, elegant false ceilings, and premium wall finishes.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className={`group px-8 py-4 rounded-full font-bold text-base transition-all duration-300 flex items-center gap-2 ${isAlu ? 'bg-white text-blue-900 hover:bg-blue-50' : 'bg-white text-purple-900 hover:bg-purple-50'}`}>
                Book Consultation
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#gallery" className="px-8 py-4 rounded-full font-bold text-base border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all">
                Our Work
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`py-32 px-6 scroll-mt-24 ${themeBg} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-2xl">
              <h2 className={`text-sm font-extrabold tracking-widest uppercase mb-3 ${themeSubColor}`}>Our Expertise</h2>
              <h3 className={`text-4xl md:text-5xl font-serif font-bold ${themeColor}`}>
                {isAlu ? 'Engineered for Perfection' : 'Colors that Inspire'}
              </h3>
            </div>
            <p className="text-gray-500 max-w-sm text-sm font-medium leading-relaxed">
              We specialize in delivering high-quality finishes and durable installations for both residential and commercial spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, idx) => {
              return (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isAlu ? 'from-blue-900/60' : 'from-purple-900/60'} to-transparent opacity-60`}></div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className={`text-2xl font-bold mb-4 ${themeColor}`}>{s.title}</h4>
                    <p className="text-gray-500 leading-relaxed text-sm mb-6 flex-1">{s.desc}</p>
                    <div className={`w-8 h-1 rounded-full transition-all duration-500 ${isAlu ? 'bg-blue-100 group-hover:bg-blue-600' : 'bg-purple-100 group-hover:bg-purple-600'} group-hover:w-16`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before / After Section */}
      <section className="py-32 bg-white px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className={`absolute top-0 right-0 w-1/3 h-full opacity-5 ${isAlu ? 'bg-blue-900' : 'bg-purple-600'}`} style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-6 ${isAlu ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                Visual Proof
              </div>
              <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-8 ${themeColor}`}>Transformation Stories</h2>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Swipe to see the dramatic difference our work makes. Whether it's a sleek new window installation or a complete room repaint, the results speak for themselves.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  { title: 'Modern Aesthetics', desc: 'Upgrade from old styles to contemporary designs.' },
                  { title: 'Premium Materials', desc: 'We only use top-grade aluminium and paints.' },
                  { title: 'Clean Execution', desc: 'No mess left behind, just beautiful results.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isAlu ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100'}`}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${themeColor}`}>{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#contact" className={`inline-flex items-center gap-2 font-bold transition-colors ${isAlu ? 'text-blue-600 hover:text-blue-700' : 'text-purple-600 hover:text-purple-700'}`}>
                Get your quote today <ArrowRight size={18} />
              </a>
            </div>

            <div className="order-1 lg:order-2">
              <div className="p-4 bg-white rounded-xl shadow-none">
                <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1505934524419-f55db4db9a0a?auto=format&fit=crop&q=80&w=800"
                  afterImage="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                  className=""
                />
                <div className="mt-6 text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Drag slider handle to open the view</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <div className={`${themeBg} transition-colors duration-500`}>
        <GallerySection />
      </div>

      {/* Team Section */}
      <section id="about" className="py-32 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className={`text-4xl md:text-5xl font-serif font-bold mb-6 ${themeColor}`}>Meet The Team</h2>
            <p className="text-gray-500">The dedicated family behind Sneha Sliding ensuring quality in every inch.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: 'Shankar Soni', role: 'Aluminum work', bio: 'Master of fabrication with 25+ years experience.', img: 'https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/shankarsoni.jpg' },
              { name: 'Manoj soni', role: 'Civil work', bio: 'Expert in texture, color theory and finishes.', img: 'https://fxwryouedphlotunmzbq.supabase.co/storage/v1/object/public/gallery-images/manojsoni.jpg' },
              { name: 'Santosh Soni', role: 'Civil work', bio: 'Expert in texture, color theory and finishes.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' }
            ].map((member, i) => (
              <div key={i} className="group cursor-default">
                <div className="relative overflow-hidden rounded-3xl mb-6 shadow-md aspect-[4/5]">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8 ${isAlu ? 'bg-blue-900/80' : 'bg-purple-900/80'}`}>
                    <p className="text-white text-sm font-medium leading-relaxed">{member.bio}</p>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${themeColor}`}>{member.name}</h3>
                <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${themeSubColor}`}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-32 px-6 scroll-mt-24 ${isAlu ? 'bg-blue-700 text-white' : 'bg-purple-800 text-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl font-serif font-bold mb-8">Ready to upgrade?</h2>
              <p className="text-white/80 mb-12 text-lg leading-relaxed">
                Contact Sneha Sliding for a free site visit and estimation. We guarantee the best rates and quality service.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Call Us</p>
                    {isAlu ? (
                      <p className="font-sans text-2xl font-bold">+91 93229 32329</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-sans text-2xl font-bold">+91 98334 51763 (Manoj Soni)</p>
                        <p className="font-sans text-2xl font-bold">+91 98207 19496 (Santosh Soni)</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Email</p>
                    <p className="font-sans text-2xl font-bold">snehasliding@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60 font-bold uppercase tracking-wider mb-1">Workshop</p>
                    <p className="font-sans text-xl font-bold leading-snug">Shop No 44 Rajkamal Market Plot No 18,<br />10, Nerul West, Nerul, Navi Mumbai, Maharashtra 400706</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl text-gray-800">
              <h3 className="text-2xl font-bold mb-8">Send an Enquiry</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Your Number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Worker</label>
                  <select
                    value={formData.worker}
                    onChange={e => setFormData({ ...formData, worker: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    required
                  >
                    <option value="">Choose a worker</option>
                    <option value="Shankar Soni">Shankar Soni</option>
                    <option value="Manoj Soni">Manoj Soni</option>
                    <option value="Santosh Soni">Santosh Soni</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Requirements..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform hover:-translate-y-1 hover:shadow-lg ${primaryBtnClass}`}
                >
                  {formStatus === 'success' ? 'Sent Successfully!' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-white font-bold text-lg">Sneha Sliding</span>
        </div>
        <p className="mb-6">&copy; {new Date().getFullYear()} Sneha Sliding & Interiors. All rights reserved.</p>
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://www.instagram.com/shankar.soni.311?igsh=cnpnOGtwd3BqZTB6" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <a href="https://www.facebook.com/share/16hL2gSP4p/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Facebook size={20} />
          </a>
        </div>
        <a href="#/admin" className="inline-block text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border border-gray-700 px-4 py-2 rounded hover:border-gray-500">Admin Login</a>
      </footer>
    </div>
  );
};

export default Home;