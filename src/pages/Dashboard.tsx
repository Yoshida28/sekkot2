import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { Bell, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface Requirement {
  id: string;
  description: string;
  file_path: string;
  file_name: string;
  status: string;
  created_at: string;
}

function Dashboard() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch notifications
        const { data: notifData, error: notifError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notifError) throw notifError;
        setNotifications(notifData || []);

        // Fetch requirements
        const { data: reqData, error: reqError } = await supabase
          .from('requirements')
          .select('*')
          .order('created_at', { ascending: false });

        if (reqError) throw reqError;
        setRequirements(reqData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to notifications
    const notificationsSubscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, payload => {
        setNotifications(current => [payload.new as Notification, ...current]);
      })
      .subscribe();

    return () => {
      notificationsSubscription.unsubscribe();
    };
  }, [user]);

  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(current =>
        current.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
        <h1 className="text-4xl font-bold text-purple-300 mb-12">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-900">
            <h2 className="text-2xl font-semibold text-purple-200 mb-6 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </h2>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-gray-400">No notifications yet</p>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read
                        ? 'border-gray-800 bg-gray-800'
                        : 'border-purple-500 bg-purple-900 bg-opacity-20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-purple-200 font-medium">
                        {notification.title}
                      </h3>
                      <button
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {notification.read ? 'Read' : 'Mark as read'}
                      </button>
                    </div>
                    <p className="text-gray-400 mt-2">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {format(new Date(notification.created_at), 'PPp')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-900">
            <h2 className="text-2xl font-semibold text-purple-200 mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Your Requirements
            </h2>
            <div className="space-y-4">
              {requirements.length === 0 ? (
                <p className="text-gray-400">No requirements submitted yet</p>
              ) : (
                requirements.map(requirement => (
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
                      </div>
                      <div className="flex items-center gap-2">
                        {requirement.status === 'completed' && (
                          <CheckCircle className="text-green-500" />
                        )}
                        {requirement.status === 'rejected' && (
                          <XCircle className="text-red-500" />
                        )}
                        {requirement.status === 'pending' && (
                          <Clock className="text-yellow-500" />
                        )}
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;