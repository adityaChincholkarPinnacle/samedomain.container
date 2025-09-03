"use client";
import dynamic from "next/dynamic";
import type { GetServerSideProps } from 'next';
import { useAuthClient } from '../hooks/useAuthClient';
import { AuthModal } from '../components/AuthModal';
import { useState } from 'react';

const Remote2Page = dynamic(() => import("remote2/RemotePage"), {
  ssr: false,
  loading: () => <div>Loading Remote2...</div>,
});

export default function Remote2Route() {
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
            You need to be logged in to access Remote2.
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

  return <Remote2Page />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
