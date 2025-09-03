import type { NextPage } from 'next';

const ServerErrorPage: NextPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>500 - Server Error</h1>
        <p style={{ color: '#4b5563' }}>An unexpected error occurred. Please try again later.</p>
      </div>
    </div>
  );
};

export default ServerErrorPage;
