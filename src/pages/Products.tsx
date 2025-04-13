import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import ProductRequirementForm from '../components/ProductRequirementForm';
import ProductManagement from '../components/ProductManagement';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
}

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(data?.map(p => p.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-300 text-center mb-12">
          Our Products
        </h1>

        {isAdmin && <ProductManagement />}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 bg-gray-900 border border-purple-900 rounded-lg text-white focus:outline-none focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-900 text-gray-300 hover:bg-purple-800'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-purple-900 hover:border-purple-500 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-purple-200 mb-2">{product.name}</h3>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <ProductRequirementForm
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;