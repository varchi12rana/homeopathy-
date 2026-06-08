import { useState, useEffect, useRef } from 'react';
import { Check, X, Plus, ChevronDown } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const CategorySelect = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories/unique');
      const uniqueCats = data.filter(Boolean).map(c => c.toLowerCase());
      
      // Ensure default categories are present
      const defaultCats = [
        'mother tincture', 'liquid specialist & tablets', 'personal care',
        'ointments & gels', 'herbal range', 'baby care', 'ear /eye drops',
        'bio chemics & bio combinations tablets', 'liquid dilution'
      ];
      
      const merged = [...new Set([...defaultCats, ...uniqueCats])].sort();
      setCategories(merged);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const cat = newCategoryName.trim().toLowerCase();
    
    if (!categories.includes(cat)) {
      setCategories([cat, ...categories].sort());
    }
    
    onSelectCategory(cat);
    setNewCategoryName('');
    setIsAdding(false);
    setIsOpen(false);
    toast.success('Category selected!');
  };

  const handleDeleteCategory = async (categoryName, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/products/categories/${encodeURIComponent(categoryName)}`);
      const updated = categories.filter(c => c !== categoryName);
      setCategories(updated);
      if (selectedCategory === categoryName) {
        onSelectCategory('');
      }
      toast.info('Category removed from all products');
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div 
        className="w-full border rounded px-3 py-2 flex justify-between items-center cursor-pointer bg-white outline-none focus:border-teal-500 hover:border-teal-400 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCategory ? 'text-gray-800 capitalize' : 'text-gray-400'}>
          {selectedCategory ? selectedCategory : 'Select a category...'}
        </span>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded shadow-lg bg-white overflow-hidden">
          {!isAdding ? (
            <div 
              className="flex items-center gap-2 px-3 py-2 cursor-pointer text-teal-600 hover:bg-teal-50 border-b transition"
              onClick={(e) => {
                e.stopPropagation();
                setIsAdding(true);
              }}
            >
              <Plus size={16} /> <span className="text-sm font-medium">Add New Category...</span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50"
              onClick={e => e.stopPropagation()}
            >
              <input 
                type="text" 
                className="flex-grow border rounded px-2 py-1.5 text-sm outline-none focus:border-teal-500" 
                placeholder="Type category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <button 
                type="button" 
                onClick={handleAddCategory}
                className="text-emerald-600 bg-emerald-100 hover:bg-emerald-200 p-1.5 rounded transition shadow-sm"
                title="Select Category"
              >
                <Check size={16} />
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdding(false);
                }}
                className="text-gray-500 bg-gray-200 hover:bg-gray-300 p-1.5 rounded transition shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {categories.map(c => (
              <div 
                key={c} 
                className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-emerald-50 ${selectedCategory === c ? 'bg-emerald-100 font-medium text-emerald-800' : 'text-gray-700'}`}
                onClick={() => {
                  onSelectCategory(c);
                  setIsOpen(false);
                }}
              >
                <span className="capitalize">{c}</span>
                <button 
                  type="button" 
                  onClick={(e) => handleDeleteCategory(c, e)}
                  className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                  title="Delete Category"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
