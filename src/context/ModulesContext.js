// context/ModulesContext.js
import { ModuleUtils } from '../config/modules.config';

export const ModulesProvider = ({ children }) => {
  const { userProfile } = useAuth();
  const businessType = userProfile?.businessType || 'restaurant';
  const userLicense = userProfile?.license || {};

  const activeModules = ModuleUtils.getActiveModules(businessType, userLicense);

  const hasModule = (moduleId) =>
    ModuleUtils.isModuleAvailable(moduleId, businessType, userLicense);

  const hasFeature = (moduleId, featureName) =>
    ModuleUtils.hasFeature(moduleId, featureName, businessType, userLicense);

  return (
    <ModulesContext.Provider
      value={{
        activeModules,
        hasModule,
        hasFeature,
        businessType
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
};
