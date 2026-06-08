import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, User as UserIcon, LogOut, Shield, Search, Heart, Leaf, ChevronDown, Package, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (keyword.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get(`/products?keyword=${encodeURIComponent(keyword)}`);
        setSuggestions(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch suggestions', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate(`/products`);
    }
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const [compRes, catRes] = await Promise.all([
          api.get('/companies'),
          api.get('/products/categories/unique')
        ]);
        setCompanies(compRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching navbar data', error);
      }
    };
    fetchNavbarData();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);

    // Trigger Google Translate dropdown
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = lng;
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-emerald-700 text-white text-sm py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <span className="hidden sm:block font-medium tracking-wide">Natural Healing. Trusted Solutions.</span>
          <div className="flex gap-4 mt-1 sm:mt-0 opacity-90 items-center">
            <span className="hidden md:inline">Call: +91 9638930188</span>
            <span className="hidden md:inline">|</span>
            <Link to="/orders" className="hover:text-emerald-200 transition">{t('Track Order')}</Link>
            <span className="hidden sm:inline">|</span>
            <div className="flex gap-2 items-center bg-emerald-800/50 px-3 py-1 rounded-full border border-emerald-600/50">
              <button onClick={() => changeLanguage('en')} className={`text-xs px-1 ${i18n.language === 'en' ? 'font-bold text-white' : 'text-emerald-200/70 hover:text-white'}`}>EN</button>
              <button onClick={() => changeLanguage('hi')} className={`text-xs px-1 ${i18n.language === 'hi' ? 'font-bold text-white' : 'text-emerald-200/70 hover:text-white'}`}>HI</button>
              <button onClick={() => changeLanguage('gu')} className={`text-xs px-1 ${i18n.language === 'gu' ? 'font-bold text-white' : 'text-emerald-200/70 hover:text-white'}`}>GU</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-emerald-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 md:py-4 flex flex-nowrap sm:flex-wrap justify-between items-center gap-1 sm:gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center group shrink-0">
            <img src="/logo%202.png" alt="Logo" className="h-12 w-12 sm:h-20 md:h-24 sm:w-20 md:w-24 object-contain translate-y-1 sm:translate-y-1.5" />
            <img
              src="/logo%20font.png"
              alt="HOMEOVIA"
              className="h-4 sm:h-7 md:h-9 w-auto object-contain -ml-2 sm:-ml-3 md:-ml-4"
              style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(87%) saturate(543%) hue-rotate(113deg) brightness(95%) contrast(92%)' }}
            />
          </Link>

          {/* Centered Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-grow max-w-xl mx-8 relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                 setKeyword(e.target.value);
                 setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for remedies, brands..."
              className="w-full bg-emerald-50 border border-emerald-100 text-gray-800 px-5 py-2.5 rounded-full outline-none focus:border-emerald-400 focus:bg-white transition shadow-inner"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-700 transition">
              <Search size={18} />
            </button>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-emerald-100 rounded-xl shadow-xl overflow-hidden z-50">
                {suggestions.map(product => (
                  <div 
                    key={product._id} 
                    onClick={() => {
                       navigate(`/product/${product._id}`);
                       setShowSuggestions(false);
                       setKeyword('');
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 last:border-0 transition"
                  >
                    <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 object-contain rounded bg-white" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 line-clamp-1">{product.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-600">{product.potency} {product.dilution}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Icons / Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/wishlist" className="relative text-gray-500 hover:text-emerald-600 transition hidden sm:block" title="Wishlist">
              <Heart size={22} />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-gray-500 hover:text-emerald-600 transition" title="Cart">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4 border-l border-gray-200 pl-2 sm:pl-4 ml-1 sm:ml-2">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1" title="Admin Panel">
                    <Shield size={20} /> <span className="hidden xl:inline text-sm font-medium">Admin</span>
                  </Link>
                )}
                <div className="flex items-center gap-2 sm:gap-3">
                  <UserIcon size={20} className="text-emerald-600" />
                  <span className="font-medium text-gray-700 hidden sm:inline text-sm">{user.name}</span>
                  <Link to="/orders" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium ml-1 sm:ml-2 sm:border-l sm:border-gray-200 sm:pl-3 flex items-center" title="My Orders">
                    <Package size={20} className="sm:hidden" />
                    <span className="hidden sm:inline">{t('My Orders')}</span>
                  </Link>
                  <Link to="/messages" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium ml-1 sm:ml-2 sm:border-l sm:border-gray-200 sm:pl-3 flex items-center" title="Messages">
                    <MessageSquare size={20} className="sm:hidden" />
                    <span className="hidden sm:inline">{t('Messages')}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-600 ml-1 sm:ml-3" title="Logout">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 border-l border-gray-200 pl-4 ml-2">
                <Link to="/login" className="text-gray-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                  {t('Login')}
                </Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 transition text-sm font-medium shadow-sm">
                  {t('Sign Up')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Menu Links */}
        <div className="border-t border-emerald-50 bg-white relative">
          <div className="container mx-auto px-1 py-1.5 md:py-2.5 flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 md:gap-8 text-[10px] sm:text-xs md:text-lg font-medium text-gray-600">
            <Link to="/" className="hover:text-emerald-600 transition px-1 py-1">{t('Home')}</Link>
            <Link to="/products" className="hover:text-emerald-600 transition px-1 py-1">{t('Shop')}</Link>
            <div className="static md:relative group flex items-center h-full">
              <button
                onClick={() => toggleDropdown('categories')}
                className="flex items-center gap-0.5 hover:text-emerald-600 transition outline-none focus:outline-none px-1 py-1"
              >
                {t('Categories')} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300 hidden md:block md:w-3.5 md:h-3.5" />
              </button>
              <div className={`absolute top-full left-0 right-0 mx-auto md:mx-0 md:left-0 md:right-auto mt-2 w-[90vw] md:w-72 bg-white shadow-2xl md:shadow-xl rounded-xl border border-emerald-50 transition-all duration-200 z-[9999] flex flex-col py-1.5 ${activeDropdown === 'categories' ? 'opacity-100 visible' : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'}`}>
                {categories.length > 0 ? categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="px-4 py-2 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition font-medium border-b border-gray-50 last:border-0 capitalize"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {cat}
                  </Link>
                )) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">No categories found</div>
                )}
              </div>
            </div>
            <div className="static md:relative group flex items-center h-full">
              <button
                onClick={() => toggleDropdown('companies')}
                className="flex items-center gap-0.5 hover:text-emerald-600 transition outline-none focus:outline-none px-1 py-1"
              >
                {t('Companies')} <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300 hidden md:block md:w-3.5 md:h-3.5" />
              </button>
              <div className={`absolute top-full left-0 right-0 mx-auto md:mx-0 md:left-0 md:right-auto mt-2 w-[90vw] md:w-48 bg-white shadow-2xl md:shadow-xl rounded-xl border border-emerald-50 transition-all duration-200 z-[9999] flex flex-col py-1.5 ${activeDropdown === 'companies' ? 'opacity-100 visible' : 'opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible'}`}>
                {companies.map(comp => (
                  <Link
                    key={comp._id}
                    to={`/products?company=${encodeURIComponent(comp.name)}`}
                    onClick={() => setActiveDropdown(null)}
                    className="px-3 py-2 md:px-4 md:py-2.5 text-[11px] md:text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition border-b border-gray-50 last:border-0 leading-tight"
                  >
                    {comp.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/contact-us" className="hover:text-emerald-600 transition px-1 py-1">{t('Contact Us')}</Link>
            <Link to="/about-homeopathy" className="hover:text-emerald-600 transition px-1 py-1 whitespace-nowrap">{t('About Homeopathy')}</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
