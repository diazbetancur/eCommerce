import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros avanzados
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    price: '',
    brand: '',
    color: '',
    size: '',
    search: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(filters);
        setProducts(data);
      } catch (err) {
        setError('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  return {
    products,
    loading,
    error,
    filters,
    setFilters
  };
}
