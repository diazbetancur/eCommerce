import { useEffect, useState } from 'react';

export function useBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de carga de banners desde API
    setTimeout(() => {
      setBanners([
        { id: 1, image: 'banner1.png' },
        { id: 2, image: 'banner2.png' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { banners, loading, error };
}
