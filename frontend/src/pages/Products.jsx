import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');
  const [potencyFilter, setPotencyFilter] = useState('');
  const location = useLocation();

  const uniquePotencies = [...new Set(products.map(p => p.potency).filter(Boolean))].sort();

  const filteredProducts = products.filter(p => !potencyFilter || p.potency === potencyFilter);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name_desc') return b.name.localeCompare(a.name);
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    return 0; // default
  });

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const company = searchParams.get('company');
  const keyword = searchParams.get('keyword');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products';
        if (keyword) {
          url = `/products?keyword=${encodeURIComponent(keyword)}`;
        } else if (category) {
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
  }, [category, company, keyword]);

  const pageTitle = keyword ? `Search Results for "${keyword}"` : category ? `${category} Medicines` : company ? `${company} Products` : 'All Homeopathic Remedies';

  return (
    <div className="w-full bg-slate-50 text-slate-800 min-h-screen py-12">
      <SEO 
        title={pageTitle}
        description={`Browse our collection of ${pageTitle.toLowerCase()}. High quality homeopathic treatments for a range of health issues.`}
      />
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
          <>
            <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-slate-500 font-medium">{sortedProducts.length} products found</p>
              <div className="flex items-center gap-4">
                {uniquePotencies.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">Potency:</span>
                    <select 
                      value={potencyFilter} 
                      onChange={(e) => setPotencyFilter(e.target.value)}
                      className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-slate-50 text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">All Potencies</option>
                      {uniquePotencies.map(pot => (
                        <option key={pot} value={pot}>{pot}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">Sort by:</span>
                  <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-slate-50 text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="default">Default</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="price_asc">Price (Low to High)</option>
                    <option value="price_desc">Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {sortedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
