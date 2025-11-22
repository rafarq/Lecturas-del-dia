import React from 'react';
import Layout from './components/Layout';
import SwipeContainer from './components/SwipeContainer';
import useReadings from './hooks/useReadings';

function App() {
  const { readings, date, loading } = useReadings();

  return (
    <Layout date={date}>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Cargando lecturas...</p>
        </div>
      ) : (
        <SwipeContainer readings={readings} />
      )}
    </Layout>
  );
}

export default App;
