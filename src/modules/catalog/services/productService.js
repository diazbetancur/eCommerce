import { fetchProducts as fetchProductsApi } from '../../../api/productService';

export async function fetchProducts() {
  return await fetchProductsApi();
}
