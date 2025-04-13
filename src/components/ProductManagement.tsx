import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

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
  created_at: string;
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  image: string;
  status: 'active' | 'inactive';
}

const initialFormData: ProductFormData = {
  name: '',
  category: '',
  description: '',
  image: '',
  status: 'active'
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        ...formData,
        image: imageUrl,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Product added successfully');
      }

      await fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      status: product.status
    });
    setPreviewUrl(product.image);
    setEditingProduct(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
    setImageFile(null);
    setPreviewUrl('');
    setIsModalOpen(false);
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-8 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        <Plus size={24} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple-300">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-800 border border-purple-900 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-800 border border-purple-900 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-800 border border-purple-900 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="product-image"
                    />
                    <label
                      htmlFor="product-image"
                      className="flex items-center justify-center w-full bg-gray-800 border border-purple-900 rounded-lg p-3 cursor-pointer hover:bg-gray-700"
                    >
                      <ImageIcon className="mr-2" size={20} />
                      <span className="text-purple-200">Choose Image</span>
                    </label>
                  </div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full bg-gray-800 border border-purple-900 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-purple-200 hover:text-white"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900 rounded-lg p-4 flex items-center gap-4 border border-purple-900"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-purple-200">{product.name}</h3>
              <p className="text-gray-400">{product.description}</p>
              <p className="text-purple-400 text-sm mt-1">Category: {product.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 text-purple-400 hover:text-purple-300"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductManagement;