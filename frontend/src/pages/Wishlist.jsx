import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems } = useContext(WishlistContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={28} className="text-emerald-600" />
        <h1 className="text-3xl font-bold text-emerald-900">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-12 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
            <Heart size={48} />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-3">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any products to your wishlist yet. Explore our products and find something you like!
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg">
            <ArrowLeft size={20} /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
