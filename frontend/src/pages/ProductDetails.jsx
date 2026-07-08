import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/imageHelper';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        
        try {
          const { data: variantsData } = await api.get(`/products/${id}/variants`);
          setVariants(variantsData);
        } catch (err) {
          console.error('Failed to fetch variants', err);
        }

        setLoading(false);
      } catch (error) {
        toast.error('Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success('Added to cart');
    navigate('/cart');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image ? getImageUrl(product.image) : `${window.location.origin}/logo.png`,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.company
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const sanitizeValue = (val) => (!val || val === 'false' || val === 'null' || val === 'undefined') ? '' : val.trim();
  const currentPotency = product ? sanitizeValue(product.potency) : '';
  const currentSize = product ? sanitizeValue(product.dilution) : '';

  const availablePotencies = [...new Set([
    currentPotency,
    ...variants.map(v => sanitizeValue(v.potency))
  ])].filter(Boolean).sort();

  const availableSizes = [...new Set([
    currentSize,
    ...variants.map(v => sanitizeValue(v.dilution))
  ])].filter(Boolean).sort();

  const handlePotencyChange = (e) => {
    const newPotency = e.target.value;
    const targetVariant = variants.find(v => sanitizeValue(v.potency) === newPotency && sanitizeValue(v.dilution) === currentSize) 
      || variants.find(v => sanitizeValue(v.potency) === newPotency);
    
    if (targetVariant && targetVariant._id !== id) {
      navigate(`/product/${targetVariant._id}`);
      setQty(1); // Reset qty when switching variants
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    const targetVariant = variants.find(v => sanitizeValue(v.potency) === currentPotency && sanitizeValue(v.dilution) === newSize) 
      || variants.find(v => sanitizeValue(v.dilution) === newSize);
    
    if (targetVariant && targetVariant._id !== id) {
      navigate(`/product/${targetVariant._id}`);
      setQty(1);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <SEO 
        title={`${product.name} | Homeopathic Medicine`} 
        description={product.description?.substring(0, 160) || `Buy ${product.name} online from Aura Homeopathy. High-quality homeopathic remedies for effective healing.`}
        image={getImageUrl(product.image)}
        type="product"
        structuredData={structuredData}
      />
      <Link to="/" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 bg-gray-50 flex justify-center items-center">
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className="max-h-96 object-contain"
          />
        </div>
        
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="mb-2">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold">{product.company}</span>
            {product.motherTincture && (
              <span className="ml-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">Mother Tincture</span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.name} 
            {product.potency && product.potency !== 'false' && product.potency !== 'null' && <span className="font-semibold text-teal-700 ml-2 text-2xl">{product.potency}</span>} 
            {product.dilution && product.dilution !== 'false' && product.dilution !== 'null' && <span className="font-semibold text-teal-700 text-2xl ml-2">{product.dilution}</span>}
          </h1>
          <div className="mb-6 flex flex-col">
            {(() => {
              const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
              return product.mrp > product.price && discountPercent > 0 ? (
                <>
                  <span className="text-3xl font-black text-black">₹{product.price.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 mt-1">
                    M.R.P: <span className="line-through">₹{product.mrp.toFixed(2)}</span> ({discountPercent}% off)
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-black">₹{product.price.toFixed(2)}</span>
              );
            })()}
          </div>
          
          {((availablePotencies.length > 0) || (availableSizes.length > 0) || user?.role === 'admin') && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Details</h3>
              
              <div className="space-y-3">
                {availablePotencies.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-gray-600 w-28">Potency:</span>
                    {availablePotencies.length > 1 ? (
                      <select 
                        value={currentPotency} 
                        onChange={handlePotencyChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-teal-500 w-32"
                      >
                        {availablePotencies.map(pot => (
                          <option key={pot} value={pot}>{pot}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-100">{currentPotency}</span>
                    )}
                  </div>
                )}
                
                {availableSizes.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-gray-600 w-28">Dilution / Size:</span>
                    {availableSizes.length > 1 ? (
                      <select 
                        value={currentSize} 
                        onChange={handleSizeChange}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-teal-500 w-32"
                      >
                        {availableSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm font-medium text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-100">{currentSize}</span>
                    )}
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-gray-600 w-28">Status:</span>
                    <span className="text-sm">
                      {product.stock > 0 ? <span className="text-green-600">In Stock ({product.stock})</span> : <span className="text-red-600">Out of Stock</span>}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mb-8 flex-grow">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>
          
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="px-4 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition text-lg"
                >
                  -
                </button>
                <span className="px-4 h-full flex items-center justify-center border-x border-gray-300 font-medium w-14 text-center bg-gray-50">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={qty >= Math.min(product.stock, 10)}
                  className="px-4 h-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition text-lg"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-teal-600 text-white font-bold py-3 px-6 rounded-md hover:bg-teal-700 transition"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
