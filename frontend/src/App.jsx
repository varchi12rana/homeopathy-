import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';

import Navbar from './components/Navbar';

import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import MyMessages from './pages/MyMessages';
import AboutHomeopathy from './pages/AboutHomeopathy';
import ConsultDoctor from './pages/ConsultDoctor';
import TrackOrder from './pages/TrackOrder';
import ShippingPolicy from './pages/ShippingPolicy';
import FAQs from './pages/FAQs';
import ContactUs from './pages/ContactUs';

// Admin
import AdminDashboard from './admin/AdminDashboard';
import CompanyProducts from './admin/CompanyProducts';
import AddProduct from './admin/AddProduct';
import BulkUpload from './admin/BulkUpload';
import EditProduct from './admin/EditProduct';
import Orders from './admin/Orders';
import AdminMessages from './admin/AdminMessages';
import AdminUsers from './admin/AdminUsers';
import AdminUserDetails from './admin/AdminUserDetails';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.className = '';
    if (i18n.language === 'hi') {
      document.body.classList.add('lang-hi');
    } else if (i18n.language === 'gu') {
      document.body.classList.add('lang-gu');
    }
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<div className="container mx-auto px-4 py-8"><Login /></div>} />
              <Route path="/register" element={<div className="container mx-auto px-4 py-8"><Register /></div>} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<div className="container mx-auto px-4 py-8"><ProductDetails /></div>} />
              <Route path="/cart" element={<div className="container mx-auto px-4 py-8"><Cart /></div>} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<div className="container mx-auto px-4 py-8"><Checkout /></div>} />
              <Route path="/orders" element={<div className="container mx-auto px-4 py-8"><MyOrders /></div>} />
              <Route path="/messages" element={<MyMessages />} />
              <Route path="/about-homeopathy" element={<AboutHomeopathy />} />
              <Route path="/consult-doctor" element={<ConsultDoctor />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact-us" element={<ContactUs />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<div className="container mx-auto px-4 py-8"><AdminDashboard /></div>} />
              <Route path="/admin/company/:companyName" element={<div className="container mx-auto px-4 py-8"><CompanyProducts /></div>} />
              <Route path="/admin/add-product" element={<div className="container mx-auto px-4 py-8"><AddProduct /></div>} />
              <Route path="/admin/bulk-upload" element={<div className="container mx-auto px-4 py-8"><BulkUpload /></div>} />
              <Route path="/admin/edit-product/:id" element={<div className="container mx-auto px-4 py-8"><EditProduct /></div>} />
              <Route path="/admin/orders" element={<div className="container mx-auto px-4 py-8"><Orders /></div>} />
              <Route path="/admin/messages" element={<div className="container mx-auto px-4 py-8"><AdminMessages /></div>} />
              <Route path="/admin/users" element={<div className="container mx-auto px-4 py-8"><AdminUsers /></div>} />
              <Route path="/admin/user/:id" element={<div className="container mx-auto px-4 py-8"><AdminUserDetails /></div>} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
