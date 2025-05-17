import api from '@api/apiService';

export const getAllProducts = async () => {
  try {
    const response = await api.get('/Product');
    return response.data;
  } catch (error: any) {
    console.error('[getAllProducts] Error al obtener productos:', error);
    throw error; // Propaga el error para que lo maneje quien use esta función (por ejemplo, un hook o componente)
  }
};
