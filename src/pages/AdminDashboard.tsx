import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Users, Package, FileText, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Requirement {
  id: string;
  description: string;
  file_path: string;
  file_name: string;
  status: string;
  created_at: string;
  email?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

function AdminDashboard() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch all requirements
        const { data: reqData, error: reqError } = await supabase
          .from('requirements')
          .select('*')
          .order('created_at', { ascending: false });

        if (reqError) throw reqError;
        setRequirements(reqData || []);

        // Fetch all products
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;
        setProducts(prodData || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateRequirementStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('requirements')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequirements(current =>
        current.map(r => (r.id === id ? { ...r, status } : r))
      );

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedRequirement?.email,
            title: `Requirement ${status}`,
            message: `Your requirement has been marked as ${status}`,
            type: status,
          },
        ]);

      toast.success(`Requirement marked as ${status}`);
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast.error('Failed to update requirement status');
    }
  };

  const sendResponse = async () => {
    if (!selectedRequirement || !response.trim()) return;

    try {
      // Create notification with response
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedRequirement.email,
            title: 'New response to your requirement',
            message: response,
            type: 'response',
          },
        ]);

      setResponse('');
      setSelectedRequirement(null);
      toast.success('Response sent successfully');
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-300 mb-12">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requirements Management */}
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-900">
            <h2 className="text-2xl font-semibold text-purple-200 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Requirements
            </h2>
            <div className="space-y-4">
              {requirements.map(requirement => (
                <div
                  key={requirement.id}
                  className="p-4 rounded-lg border border-gray-800 bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-purple-200 font-medium mb-2">
                        {requirement.file_name}
                      </h3>
                      <p className="text-gray-400">{requirement.description}</p>
                      {requirement.email && (
                        <p className="text-sm text-purple-400 mt-2">
                          From: {requirement.email}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateRequirementStatus(requirement.id, 'completed')}
                        className="text-green-500 hover:text-green-400"
                      >
                        <CheckCircle />
                      </button>
                      <button
                        onClick={() => updateRequirementStatus(requirement.id, 'rejected')}
                        className="text-red-500 hover:text-red-400"
                      >
                        <XCircle />
                      </button>
                      <button
                        onClick={() => setSelectedRequirement(requirement)}
                        className="text-purple-500 hover:text-purple-400"
                      >
                        <MessageSquare />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Status: <span className="capitalize">{requirement.status}</span>
                    </span>
                    <span>
                      {format(new Date(requirement.created_at), 'PPp')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Management */}
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-900">
            <h2 className="text-2xl font-semibold text-purple-200 mb-6 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Products
            </h2>
            <div className="space-y-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="p-4 rounded-lg border border-gray-800 bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-purple-200 font-medium">{product.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{product.description}</p>
                      <p className="text-purple-400 text-sm mt-2">
                        Category: {product.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response Modal */}
        {selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-lg w-full">
              <h3 className="text-xl font-semibold text-purple-200 mb-4">
                Respond to Requirement
              </h3>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full bg-gray-800 border border-purple-900 rounded-lg p-4 text-white focus:outline-none focus:border-purple-500 min-h-[150px]"
                placeholder="Type your response..."
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="px-4 py-2 text-purple-200 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={sendResponse}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;