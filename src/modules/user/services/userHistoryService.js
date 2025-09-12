// Mock servicios para historiales y referidos
export async function fetchPurchaseHistory(userId) {
  return [
    {
      id: 1,
      date: '2025-08-19',
      items: 3,
      total: 120000,
      products: [
        { name: 'Zapatos', qty: 1, price: 60000 },
        { name: 'Camisa', qty: 2, price: 30000 }
      ]
    },
    {
      id: 2,
      date: '2025-07-10',
      items: 1,
      total: 45000,
      products: [{ name: 'Gorra', qty: 1, price: 45000 }]
    }
  ];
}

export async function fetchAccrualHistory(userId) {
  return [
    { id: 1, date: '2025-08-19', value: 120000, points: 120, expires: '2026-08-19' },
    { id: 2, date: '2025-07-10', value: 45000, points: 45, expires: '2026-07-10' }
  ];
}

export async function fetchRedemptionHistory(userId) {
  return [
    { id: 1, date: '2025-08-20', product: 'Gift Card', points: 100 },
    { id: 2, date: '2025-07-15', product: 'Camiseta exclusiva', points: 90 }
  ];
}

export async function fetchReferralHistory(userId) {
  return [
    { id: 1, user: 'Juan Pérez', reward: '10 pts', activated: '2025-08-01' },
    { id: 2, user: 'Ana Gómez', reward: 'Descuento 5%', activated: '2025-07-20' }
  ];
}
