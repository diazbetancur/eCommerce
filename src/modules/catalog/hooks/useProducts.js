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
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, []);

  return {
    products,
    loading,
    error,
    filters,
    setFilters
  };
}
