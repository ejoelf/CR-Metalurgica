import { useEffect, useState } from 'react';
import { cfBrandName, cfBrandSlogan, cfLogoDataUrl } from '../../../../packages/branding/cfLogo.js';
import { getPublicBranding, resolveAssetUrl } from '../services/brandingService.js';

const fallbackBranding = {
  publicName: cfBrandName,
  businessName: cfBrandName,
  slogan: cfBrandSlogan,
  logoUrl: cfLogoDataUrl,
  uploadedLogoUrl: '',
};

export function usePublicBranding() {
  const [branding, setBranding] = useState(fallbackBranding);

  useEffect(() => {
    let active = true;

    getPublicBranding()
      .then((data) => {
        if (!active) return;
        setBranding({
          ...fallbackBranding,
          ...data,
          publicName: data?.publicName || data?.businessName || cfBrandName,
          slogan: cfBrandSlogan,
          logoUrl: cfLogoDataUrl,
          uploadedLogoUrl: resolveAssetUrl(data?.logoUrl) || '',
        });
      })
      .catch(() => {
        if (active) setBranding(fallbackBranding);
      });

    return () => { active = false; };
  }, []);

  return branding;
}
