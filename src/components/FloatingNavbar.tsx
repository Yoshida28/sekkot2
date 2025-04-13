import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, FileUp, Mail, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const FloatingNavbar = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-purple-600' : 'bg-gray-900 hover:bg-purple-800';
  };

  const openMailto = () => {
    window.location.href = 'mailto:sekkot_engineering@yahoo.com';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="flex flex-col gap-4 p-4 bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-900">
        <Link 
          to="/"
          className={`${isActive('/')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
        >
          <Home size={20} />
          <span className="hidden group-hover:block">Home</span>
        </Link>
        
        <Link 
          to="/products"
          className={`${isActive('/products')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
        >
          <Package size={20} />
          <span className="hidden group-hover:block">Products</span>
        </Link>
        
        {user ? (
          <>
            <Link 
              to="/submit-requirement"
              className={`${isActive('/submit-requirement')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
            >
              <FileUp size={20} />
              <span className="hidden group-hover:block">Submit</span>
            </Link>
            
            <Link 
              to="/dashboard"
              className={`${isActive('/dashboard')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
            >
              <User size={20} />
              <span className="hidden group-hover:block">Dashboard</span>
            </Link>

            {isAdmin && (
              <Link 
                to="/admin"
                className={`${isActive('/admin')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
              >
                <Shield size={20} />
                <span className="hidden group-hover:block">Admin</span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="bg-gray-900 hover:bg-red-900 p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2"
            >
              <LogOut size={20} />
              <span className="hidden group-hover:block">Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className={`${isActive('/login')} p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2`}
            >
              <User size={20} />
              <span className="hidden group-hover:block">Sign In</span>
            </Link>
          </>
        )}
        
        <button
          onClick={openMailto}
          className="bg-gray-900 hover:bg-purple-800 p-3 rounded-xl transition-all duration-300 text-white flex items-center gap-2"
        >
          <Mail size={20} />
          <span className="hidden group-hover:block">Contact</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingNavbar;