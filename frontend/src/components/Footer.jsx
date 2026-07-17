import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Leaf } from 'lucide-react';
import api from '../services/api';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories/unique');
        // Show up to 6 categories in the footer to keep it tidy
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories for footer', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="bg-emerald-900 text-emerald-50 pt-16 pb-8 mt-auto border-t border-emerald-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6 group inline-flex">
              <img src="/logo%202.png" alt="Logo" className="h-20 w-20 object-contain translate-y-1.5" />
              <img src="/logo%20font.png" alt="HOMEOVIA" className="h-8 w-auto object-contain brightness-0 invert -ml-3" />
            </Link>
            <p className="text-emerald-200 mb-6 max-w-sm leading-relaxed">
              Your trusted partner in holistic wellness. We provide 100% natural and authentic homeopathic remedies right to your doorstep.
            </p>
            <div className="space-y-3 text-emerald-200 text-sm">
              <p className="flex items-start gap-3"><Phone size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <a href="tel:+919638930188" className="hover:text-white transition">+91 9638930188</a></p>
              <p className="flex items-start gap-3"><Mail size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <a href="mailto:homeovia.care@gmail.com" className="hover:text-white transition">homeovia.care@gmail.com</a></p>
              <p className="flex items-start gap-3"><MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span>102,Sahyog shopping centre,<br />udhna main road, udhana,<br />surat, gujarat-394210</span></p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-emerald-500 after:-bottom-1 after:left-0">Quick Links</h3>
            <ul className="space-y-2 text-emerald-200 text-sm">
              <li><Link to="/about-homeopathy" className="hover:text-white transition">About Homeopathy</Link></li>
              <li><Link to="/consult-doctor" className="hover:text-white transition">Consult a Doctor</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition">Track Order</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link to="/return-and-refund-policy" className="hover:text-white transition">Return & Refund Policy</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition">FAQs</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-emerald-500 after:-bottom-1 after:left-0">Categories</h3>
            <ul className="space-y-2 text-emerald-200 text-sm">
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-white transition capitalize">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-0.5 after:bg-emerald-500 after:-bottom-1 after:left-0">Newsletter</h3>
            <p className="text-emerald-200 text-sm mb-4">Subscribe to receive health tips and exclusive offers.</p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-emerald-800/50 border border-emerald-700 text-white px-4 py-2 rounded-md outline-none focus:border-emerald-400 placeholder:text-emerald-400/50 text-sm"
              />
              <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-medium py-2 rounded-md transition text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-emerald-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} HOMEOVIA. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm text-emerald-400">
            <Link to="/shipping-policy" className="hover:text-emerald-50 transition">Shipping Policy</Link>
            <Link to="/return-and-refund-policy" className="hover:text-emerald-50 transition">Return & Refund Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-emerald-50 transition">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="hover:text-emerald-50 transition">Privacy Policy</Link>
            <Link to="/contact-us" className="hover:text-emerald-50 transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
