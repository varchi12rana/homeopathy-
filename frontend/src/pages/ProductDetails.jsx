import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
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
    "image": product.image || `${window.location.origin}/logo.png`,
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

  return (
    <div className="container mx-auto max-w-5xl">
      <SEO 
        title={`${product.name} | Homeopathic Medicine`} 
        description={product.description?.substring(0, 160) || `Buy ${product.name} online from Aura Homeopathy. High-quality homeopathic remedies for effective healing.`}
        image={product.image}
        type="product"
        structuredData={structuredData}
      />
      <Link to="/" className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Products
      </Link>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 bg-gray-50 flex justify-center items-center">
          <img 
            src={product.image || 'https://via.placeholder.com/400?text=Medicine'} 
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
            {product.name} {product.potency && <span className="font-semibold text-teal-700 ml-2 text-2xl">{product.potency}</span>} {product.dilution && <span className="font-semibold text-teal-700 text-2xl">{product.dilution}</span>}
          </h1>
          <p className="text-2xl font-bold text-teal-600 mb-6">₹{product.price}</p>
          
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Details</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><span className="font-medium">Potency:</span> {product.potency}</li>
              <li><span className="font-medium">Dilution:</span> {product.dilution}</li>
              {user?.role === 'admin' && (
                <li><span className="font-medium">Status:</span> {product.stock > 0 ? <span className="text-green-600">In Stock ({product.stock})</span> : <span className="text-red-600">Out of Stock</span>}</li>
              )}
            </ul>
          </div>
          
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
