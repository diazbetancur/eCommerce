import api from './apiService';

export async function fetchCategories() {
  const response = await api.get('/Category');

  return response.data;
}
