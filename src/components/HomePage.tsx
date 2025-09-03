import React, { useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { UserPayload } from '../lib/jwt';

export default function HomePage() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    checkAuth(); // Refresh auth state
  };

  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Container App</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Welcome, {user?.name}!</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            {isAuthenticated ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to your Microfrontend Container!
                </h2>
                <p className="text-gray-600 mb-6">
                  You are successfully authenticated as {user?.email}
                </p>
                <div className="space-x-4">
                  <a
                    href="https://samedomain-dashboard-pfbanvyln-aditya-s-projects-03b412df.vercel.app/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
                  >
                    Go to Dashboard
                  </a>
                  <a
                    href="https://samedomain-remote2.vercel.app/"
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 inline-block"
                  >
                    Go to Remote2
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Please Login to Continue
                </h2>
                <p className="text-gray-600 mb-6">
                  You need to be authenticated to access the microfrontend applications.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                >
                  Login / Register
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
