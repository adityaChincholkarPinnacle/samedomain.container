"use client";
import dynamic from "next/dynamic";
import { useAuthClient } from '../hooks/useAuthClient';
import { AuthModal } from '../components/AuthModal';
import { useState } from 'react';

const DashboardPage = dynamic(() => import("dashboard/DashboardPage"), {
  ssr: false,
  loading: () => <div>Loading Dashboard...</div>,
});

export default function DashboardRoute() {
  const { isAuthenticated, loading } = useAuthClient();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the Dashboard.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return <DashboardPage />;
}
