// Mock de productos con categorías, subcategorías, imágenes y videos
export const mockProducts = [
  {
    id: 1,
    name: 'Camiseta Nike',
    description: 'Camiseta deportiva original',
    category: 'Ropa',
    subcategory: 'Deportiva',
    price: 120000,
    brand: 'Nike',
    color: 'Azul',
    size: 'M',
    images: [
      'https://via.placeholder.com/300x300.png?text=camiseta1',
      'https://via.placeholder.com/300x300.png?text=camiseta2',
      { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ]
  },
  {
    id: 2,
    name: 'Zapatos Adidas',
    description: 'Zapatos running',
    category: 'Calzado',
    subcategory: 'Running',
    price: 250000,
    brand: 'Adidas',
    color: 'Negro',
    size: '42',
    images: [
      'https://via.placeholder.com/300x300.png?text=zapato1',
      'https://via.placeholder.com/300x300.png?text=zapato2'
    ]
  },
  {
    id: 3,
    name: 'Celular Samsung',
    description: 'Smartphone gama media',
    category: 'Electrónica',
    subcategory: 'Celulares',
    price: 900000,
    brand: 'Samsung',
    color: 'Gris',
    size: '',
    images: [
      'https://via.placeholder.com/300x300.png?text=celular1',
      { type: 'video', url: 'https://www.w3schools.com/html/movie.mp4' }
    ]
  }
];
