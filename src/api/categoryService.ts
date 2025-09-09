import api from './apiService';

export async function fetchCategories() {
  const response = await api.get('/Category');
  console.log(response.data.length);
  return response.data;
}
