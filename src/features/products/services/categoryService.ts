import api from '@api/apiService';

export const getAllCategories = async () => {
  try {
    const response = await api.get('/Category');
    return response.data;
  } catch (error: any) {
    console.error('[getAllProducts] Error al obtener categorias:', error);
    throw error; // Propaga el error para que lo maneje quien use esta función (por ejemplo, un hook o componente)
  }
};
