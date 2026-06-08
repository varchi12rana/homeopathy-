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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const location = useLocation();

  const uniquePotencies = [...new Set(products.map(p => p.potency).filter(Boolean))].sort();

  // Since pagination is active, we just use the products from the backend directly
  const filteredProducts = products.filter(p => !potencyFilter || p.potency === potencyFilter);

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');
  const company = searchParams.get('company');
  const keyword = searchParams.get('keyword');

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, company, keyword, sortOption]);

  const handleAlphabetClick = async (letter) => {
    try {
      let url = `/products/alphabet-page?letter=${letter}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      else if (category) url += `&category=${encodeURIComponent(category)}`;
      else if (company) url += `&company=${encodeURIComponent(company)}`;
      
      const { data } = await api.get(url);
      if (data.page) {
        setPage(data.page);
        setSortOption('name_asc'); // Force name sort to make A-Z jump logical
      }
    } catch (error) {
      console.error('Failed to jump to alphabet', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&sortOption=${sortOption}`;
        if (keyword) {
          url += `&keyword=${encodeURIComponent(keyword)}`;
        } else if (category) {
          url += `&category=${encodeURIComponent(category)}`;
        } else if (company) {
          url += `&company=${encodeURIComponent(company)}`;
        }
        const { data } = await api.get(url);
        
        // Handle both paginated response and old array response (for safety)
        if (data.products) {
          setProducts(data.products);
          setPages(data.pages);
          setTotal(data.total);
        } else {
          setProducts(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, company, keyword, page, sortOption]);

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
        
        {/* A-Z Alphabet Row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
            <button
              key={letter}
              onClick={() => handleAlphabetClick(letter)}
              className="w-8 h-8 flex items-center justify-center rounded-md font-medium text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors text-sm border border-emerald-100"
            >
              {letter}
            </button>
          ))}
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
              <p className="text-sm text-slate-500 font-medium">
                {total > 0 ? `Showing ${filteredProducts.length} of ${total} products` : `${filteredProducts.length} products found`}
              </p>
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
              {filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    page === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center px-4 bg-white rounded-md border border-slate-200 text-slate-700 font-medium shadow-sm">
                  Page {page} of {pages}
                </div>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    page === pages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  Next Page
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
