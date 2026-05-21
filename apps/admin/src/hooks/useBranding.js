import { useEffect, useState } from 'react';
import { cfBrandName, cfBrandSlogan, cfLogoDataUrl } from '../../../../packages/branding/cfLogo.js';
import { API_ORIGIN, resolveAssetUrl } from '../utils/assetUrl.js';

const fallbackBranding = {
  publicName: cfBrandName,
  businessName: cfBrandName,
  slogan: cfBrandSlogan,
  logoUrl: cfLogoDataUrl,
  signatureUrl: '',
};

export function useBranding() {
  const [branding, setBranding] = useState(fallbackBranding);

  useEffect(() => {
    let active = true;

    fetch(`${API_ORIGIN}/api/public/branding`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!active || !payload) return;
        const data = payload.data || payload;
        setBranding({
          ...fallbackBranding,
          ...data,
          publicName: data?.publicName || data?.businessName || cfBrandName,
          slogan: cfBrandSlogan,
          logoUrl: resolveAssetUrl(data?.logoUrl) || cfLogoDataUrl,
          signatureUrl: resolveAssetUrl(data?.signatureUrl),
        });
      })
      .catch(() => {
        if (active) setBranding(fallbackBranding);
      });

    return () => { active = false; };
  }, []);

  return branding;
}
