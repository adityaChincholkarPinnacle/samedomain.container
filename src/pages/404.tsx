import type { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>404 - Page Not Found</h1>
        <p style={{ color: '#4b5563' }}>The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
