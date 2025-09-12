// Servicio mock para programa de lealtad
export async function fetchLoyaltyData(userId) {
  // Simula puntos acumulados y recompensas
  return {
    points: 1200,
    rewards: [
      { id: 1, name: 'Descuento 10%', requiredPoints: 1000 },
      { id: 2, name: 'Envío gratis', requiredPoints: 800 },
      { id: 3, name: 'Producto especial', requiredPoints: 1500 }
    ],
    referrals: 3
  };
}

export async function fetchRedeemableProducts() {
  // Simula productos para redención
  return [
    { id: 101, name: 'Camiseta exclusiva', points: 900 },
    { id: 102, name: 'Taza personalizada', points: 700 },
    { id: 103, name: 'Gift Card', points: 1200 }
  ];
}
