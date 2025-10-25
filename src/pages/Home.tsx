import { Zap, Shield, CheckCircle, Instagram, MapPin, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useServices } from '../hooks/useServices';
import { useMaterials } from '../hooks/useMaterials';
import { useHeroContent } from '../hooks/useHeroContent';
import { initializeContent } from '../services/initializeContent';

export function Home() {
  const { products, loading } = useProducts();
  const { settings } = useSiteSettings();
  const { services, loading: servicesLoading } = useServices();
  const { materials, loading: materialsLoading } = useMaterials();
  const { heroContent, loading: heroLoading } = useHeroContent();
  const { isAdmin, user, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const displayedProducts = showAllProducts ? products : products.slice(0, 3);

  useEffect(() => {
    initializeContent();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleMouseEnter = (productId: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setHoveredProductId(productId);
    }, 1000);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredProductId(null);
  };

  const heroAnimation = useScrollAnimation();
  const productsAnimation = useScrollAnimation();
  const servicesAnimation = useScrollAnimation();
  const materialsAnimation = useScrollAnimation();
  const contactAnimation = useScrollAnimation();

  const iconMap: Record<string, any> = {
    Zap,
    Shield,
    CheckCircle
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        <nav className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-[#3d4f5c] to-[#5a7280] bg-opacity-90 backdrop-blur-sm text-white rounded-2xl shadow-lg px-6 py-4 flex items-center justify-between" style={{backgroundColor: 'rgba(61, 79, 92, 0.9)'}}>
            <div className="flex items-center gap-3">
              <img src={settings.logoUrl} alt="ATSA Logo" className="w-14 h-14 object-contain" style={{mixBlendMode: 'lighten'}} />
              <span className="text-xl font-bold">ATSA</span>
            </div>
            <div className="hidden md:flex gap-3">
              <a href="#products" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Products</a>
              <a href="#services" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Services</a>
              <a href="#materials" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Materials</a>
              <a href="#contact" className="px-4 py-2 rounded-lg bg-white text-[#3d4f5c] hover:bg-gray-100 transition font-semibold shadow-md">Contact</a>
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 rounded-lg bg-white text-[#3d4f5c] hover:bg-gray-100 transition font-semibold shadow-md flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white text-[#3d4f5c] hover:bg-gray-100 transition font-semibold shadow-md"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate('/admin/login')}
                  className="px-4 py-2 rounded-lg bg-white text-[#3d4f5c] hover:bg-gray-100 transition font-semibold shadow-md flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {user && (
        <div className="container mx-auto px-6 pt-24">
          <div className="bg-gradient-to-r from-[#3d4f5c] to-[#5a7280] text-white rounded-xl shadow-lg px-6 py-4 text-center">
            <p className="text-lg font-semibold">
              Welcome, {userName || user.email?.split('@')[0]}!
            </p>
          </div>
        </div>
      )}

      <section ref={heroAnimation.ref} className="container mx-auto px-6 py-32 mt-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-400/30 via-blue-gray-400/20 to-transparent rounded-3xl"></div>
        <div className={`max-w-3xl relative z-10 transition-all duration-700 ${heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl font-bold text-[#3d4f5c] mb-6 animate-fadeIn">
            {heroContent.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4 animate-fadeIn delay-100">
            {heroContent.subtitle}
          </p>
          <p className="text-lg text-gray-500 mb-8 animate-fadeIn delay-200">
            {heroContent.description}
          </p>
        </div>
      </section>

      <section ref={productsAnimation.ref} id="products" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className={`text-3xl font-bold text-[#3d4f5c] mb-12 text-center transition-all duration-700 ${productsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Our Work</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product, index) => {
              const isExpanded = hoveredProductId === product.id;
              const isOtherExpanded = hoveredProductId && hoveredProductId !== product.id;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => handleMouseEnter(product.id)}
                  onMouseLeave={handleMouseLeave}
                  className={`relative group transition-all duration-500 ease-out ${productsAnimation.isVisible ? 'opacity-100' : 'opacity-0 scale-95'} ${
                    isExpanded ? 'z-30' : isOtherExpanded ? 'opacity-60' : 'z-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute -inset-2 bg-gradient-to-br from-[#3d4f5c]/20 to-[#5a7280]/20 rounded-xl transition-all duration-500 ${
                    isExpanded ? 'opacity-100 blur-xl' : 'opacity-0 blur-none'
                  }`}></div>
                  <div className={`relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${
                    isExpanded ? 'shadow-2xl scale-105 ring-2 ring-[#3d4f5c]/30' : 'shadow-lg hover:shadow-xl hover:scale-[1.02]'
                  }`}>
                    {product.imageUrl && (
                      <div className="overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={`w-full object-cover transition-all duration-500 ${
                            isExpanded ? 'h-80 scale-105' : 'h-64 group-hover:scale-110'
                          }`}
                        />
                      </div>
                    )}
                    <div className={`p-6 transition-all duration-500 ${isExpanded ? 'bg-gradient-to-b from-white to-slate-50' : ''}`}>
                      <h3 className={`font-bold text-[#3d4f5c] mb-2 transition-all duration-500 ${
                        isExpanded ? 'text-2xl' : 'text-xl'
                      }`}>{product.name}</h3>
                      <p className={`text-gray-600 transition-all duration-500 leading-relaxed ${
                        isExpanded ? 'text-base' : 'text-sm line-clamp-3'
                      }`}>{product.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
          {!loading && !showAllProducts && products.length > 3 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllProducts(true)}
                className="bg-[#3d4f5c] text-white px-8 py-3 rounded-lg hover:bg-[#2d3f4c] transition font-semibold shadow-lg"
              >
                Show All
              </button>
            </div>
          )}
        </div>
      </section>

      <section ref={servicesAnimation.ref} id="services" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold text-[#3d4f5c] mb-12 text-center transition-all duration-700 ${servicesAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Our Services</h2>
          {servicesLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || CheckCircle;
                const delays = ['', 'delay-100', 'delay-200'];
                const animations = ['opacity-0 -translate-x-10', 'opacity-0 translate-y-10', 'opacity-0 translate-x-10'];

                return (
                  <div key={service.id} className={`bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-700 ${delays[index % 3]} ${servicesAnimation.isVisible ? 'opacity-100 translate-x-0 translate-y-0' : animations[index % 3]}`}>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="w-8 h-8 text-[#3d4f5c]" />
                        <h3 className="text-xl font-bold text-[#3d4f5c]">{service.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section ref={materialsAnimation.ref} id="materials" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold text-[#3d4f5c] mb-12 text-center transition-all duration-700 ${materialsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Materials We Work With</h2>
          {materialsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#3d4f5c] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className={`max-w-2xl mx-auto transition-all duration-700 delay-200 ${materialsAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <ul className="space-y-4">
                {materials.map((material) => (
                  <li key={material.id} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-[#3d4f5c] flex-shrink-0" />
                    <span className="text-lg text-gray-700">{material.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section ref={contactAnimation.ref} id="contact" className="bg-[#3d4f5c] text-white py-20">
        <div className={`container mx-auto px-6 text-center transition-all duration-700 ${contactAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your manufacturing needs and receive a detailed quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href="tel:+96171981996" className="bg-white text-[#3d4f5c] px-8 py-3 rounded hover:bg-gray-100 transition font-medium">
              +961 71 981 996
            </a>
            <a href="tel:+2250150191162" className="bg-white text-[#3d4f5c] px-8 py-3 rounded hover:bg-gray-100 transition font-medium">
              +225 01 50 19 11 62
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-500">
            <h3 className="text-xl font-bold mb-6">Follow Us</h3>
            <div className="flex flex-wrap gap-6 justify-center">
              <a
                href="https://www.instagram.com/ats_a1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-[#3d4f5c] px-6 py-3 rounded hover:bg-gray-100 transition"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@atsa067"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-[#3d4f5c] px-6 py-3 rounded hover:bg-gray-100 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </a>
              <a
                href="https://maps.app.goo.gl/oerTXUjQhQee3rPa8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-[#3d4f5c] px-6 py-3 rounded hover:bg-gray-100 transition"
              >
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#2d3f4c] text-gray-300 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 1992-2024 ATSA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
