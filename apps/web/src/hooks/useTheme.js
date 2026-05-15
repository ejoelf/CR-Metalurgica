import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    localStorage.removeItem('cfmp_public_theme');
  }, []);

  return { theme: 'dark', isDark: true, toggleTheme: () => {} };
}
