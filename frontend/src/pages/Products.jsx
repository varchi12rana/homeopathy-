import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const company = searchParams.get('company');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products';
        if (category) {
          url = `/products?category=${encodeURIComponent(category)}`;
        } else if (company) {
          url = `/products?company=${encodeURIComponent(company)}`;
        }
        const { data } = await api.get(url);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, company]);

  return (
    <div className="w-full bg-slate-50 text-slate-800 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-emerald-950 mb-4 capitalize">
            {category ? category : company ? company : 'Shop All Remedies'}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse our complete collection of authentic, natural homeopathic treatments.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-2xl shadow-sm">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
