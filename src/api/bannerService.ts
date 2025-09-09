import api from './apiService';

export async function fetchBanners() {
  const response = await api.get('/Banner');
  console.log(response.data.length);
  return response.data;
}
