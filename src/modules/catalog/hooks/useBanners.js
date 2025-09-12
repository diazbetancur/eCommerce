import { useEffect, useState } from 'react';
import { fetchBanners } from '../../../api/bannerService';

export function useBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchBanners()
      .then((data) => {
        setBanners(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return { banners, loading, error };
}
