import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import SwipeContainer from './components/SwipeContainer';
import { useReadings } from './hooks/useReadings';
import { Loader } from 'lucide-react';

function App() {
  const { readings, loading, error } = useReadings();

  return (
    <ThemeProvider>
      <Layout date={readings?.date}>
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Loader className="animate-spin mb-2" />
            <p>Cargando lecturas...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full text-red-400">
            <p>Error al cargar las lecturas. Intenta recargar.</p>
          </div>
        )}

        {!loading && !error && readings && (
          <SwipeContainer readings={readings.readings} />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
