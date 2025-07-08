// screens/guest/HomeScreen.js
import { useModules } from '../../context/ModulesContext';

const HomeScreen = () => {
  const { hasFeature } = useModules();

  return (
    <ScrollView>
      <CategoriesGrid />
      <FeaturedProducts />

      {/* Solo mostrar promociones si el módulo está activo */}
      {hasFeature('promotions', 'promotional_banners') && <PromotionBanner />}

      {/* Solo mostrar programa de lealtad si está disponible */}
      {hasFeature('loyalty_program', 'point_accumulation') && <LoyaltySection />}
    </ScrollView>
  );
};
