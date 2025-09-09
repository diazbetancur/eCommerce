import api from './apiService';

export async function fetchProducts() {
  const response = await api.get('/Product');
  console.log(response);
  return response.data;
}
