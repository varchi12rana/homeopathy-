import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    addToCart(product, 1);
    navigate('/checkout');
  };

  const isWishlisted = wishlistItems?.some(item => item._id === product._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    const added = toggleWishlist(product);
    if (added) {
      toast.success('Added to wishlist');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="group bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-50 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition duration-300 flex flex-col h-full relative">
      
      {/* Bestseller Badge */}
      {product.isBestSeller && (
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-amber-500 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full uppercase tracking-wide z-10">
          Bestseller
        </div>
      )}

      {/* Wishlist Icon */}
      <button 
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 backdrop-blur rounded-full flex items-center justify-center transition z-10 shadow-sm ${isWishlisted ? 'text-red-500 bg-white' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'}`} 
        onClick={handleWishlistClick}
      >
        <Heart size={14} className={`sm:w-4 sm:h-4 w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      <div className="h-32 sm:h-56 overflow-hidden bg-slate-50 flex justify-center items-center p-3 sm:p-6 relative group-hover:bg-emerald-50/50 transition">
        <img 
          src={product.image || 'https://via.placeholder.com/300?text=Medicine'} 
          alt={product.name} 
          className="object-contain h-full w-full group-hover:scale-110 transition duration-500"
        />
      </div>
      
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 sm:mb-2 flex-wrap gap-1">
          <span className="text-[9px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md">{product.company}</span>
        </div>
        
        <h3 className="text-xs sm:text-lg font-bold text-emerald-950 mb-1 leading-tight group-hover:text-emerald-700 transition line-clamp-2" title={`${product.name} ${product.potency || ''} ${product.dilution || ''}`}>
          {product.name} {product.potency && <span className="font-medium text-emerald-700 ml-1">{product.potency}</span>} {product.dilution && <span className="font-medium text-emerald-700">{product.dilution}</span>}
        </h3>
        
        <div className="mt-auto pt-2 sm:pt-4 flex flex-col gap-1.5 sm:gap-2 border-t border-slate-100">
          <span className="text-sm sm:text-xl font-black text-emerald-800">₹{product.price}</span>
          <div className="flex gap-1.5 sm:gap-2 flex-col lg:flex-row">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-semibold flex items-center justify-center gap-1 transition ${
                product.stock === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <ShoppingBag size={12} className="sm:w-4 sm:h-4 w-3 h-3" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span>
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`flex-1 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-semibold transition shadow-sm ${
                product.stock === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
