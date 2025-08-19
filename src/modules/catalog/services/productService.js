// Servicio para obtener productos desde la API
import { mockProducts } from './mockProducts';

export async function fetchProducts({ category, subcategory, price, brand, color, size, search }) {
  let products = mockProducts;

  if (category) products = products.filter((p) => p.category === category);
  if (subcategory) products = products.filter((p) => p.subcategory === subcategory);
  if (price) products = products.filter((p) => p.price <= price);
  if (brand) products = products.filter((p) => p.brand === brand);
  if (color) products = products.filter((p) => p.color === color);
  if (size) products = products.filter((p) => p.size === size);
  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term)
    );
  }
  return products;
}
