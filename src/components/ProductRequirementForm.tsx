import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Check, X, Loader } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ProductRequirementFormProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

const ProductRequirementForm: React.FC<ProductRequirementFormProps> = ({
  productId,
  productName,
  onClose
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    quantity: 1,
    customization: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('submitting');
    
    try {
      const { error } = await supabase
        .from('product_requirements')
        .insert([
          {
            product_id: productId,
            customer_name: formData.customerName,
            email: formData.email,
            quantity: formData.quantity,
            customization_details: {
              notes: formData.customization
            }
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('Error submitting requirement:', error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full mx-4 border border-purple-900">
        <h3 className="text-xl font-semibold text-purple-200 mb-4">
          Request Quote for {productName}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className={`w-full bg-gray-800 border ${
                errors.customerName ? 'border-red-500' : 'border-purple-900'
              } rounded-lg p-2 text-white focus:outline-none focus:border-purple-500`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full bg-gray-800 border ${
                errors.email ? 'border-red-500' : 'border-purple-900'
              } rounded-lg p-2 text-white focus:outline-none focus:border-purple-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className={`w-full bg-gray-800 border ${
                errors.quantity ? 'border-red-500' : 'border-purple-900'
              } rounded-lg p-2 text-white focus:outline-none focus:border-purple-500`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Customization Requirements
            </label>
            <textarea
              value={formData.customization}
              onChange={(e) => setFormData(prev => ({ ...prev, customization: e.target.value }))}
              rows={4}
              className="w-full bg-gray-800 border border-purple-900 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-purple-200 hover:text-white transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 
                ${status === 'submitting' 
                  ? 'bg-purple-800 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
                }`}
            >
              {status === 'submitting' ? (
                <Loader className="animate-spin" />
              ) : status === 'success' ? (
                <Check />
              ) : (
                'Submit Request'
              )}
            </button>
          </div>

          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-400 mt-4">
              <X size={20} />
              <span>Error submitting request. Please try again.</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductRequirementForm;