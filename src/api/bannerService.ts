import api from './apiService';

export async function fetchBanners() {
  const response = await api.get('/Banner');
  return response.data;
}
