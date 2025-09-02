import dynamic from 'next/dynamic';

const DynamicHome = dynamic(() => import('../components/HomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  ),
});

export default function Home() {
  return <DynamicHome />;
}
