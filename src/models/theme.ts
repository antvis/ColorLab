import { useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark';

export default () => {
  const [theme, setTheme] = useState<ThemeType>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.setProperty('--main-bg-color', '#151515');
      document.body.style.setProperty('--second-bg-color', '#222222');
      document.body.style.setProperty('--third-bg-color', '#363636');
      document.body.style.setProperty('--dashboard-bg-color', '#2d2e2f');
      document.body.style.setProperty('--hover-bg-color', '#343434');
      document.body.style.setProperty('--main-border-color', '#383838');
      document.body.style.setProperty('--second-border-color', '#A9A9A9');
      document.body.style.setProperty('--main-text-color', 'rgba(255, 255, 255, 0.85)');
      document.body.style.setProperty('--second-text-color', 'rgba(255, 255, 255, 0.65)');
      document.body.style.setProperty('--third-text-color', 'rgba(255, 255, 255, 0.45)');
      document.body.style.setProperty('--forth-text-color', 'rgba(255, 255, 255, 0.25)');
      document.body.style.setProperty('--main-shadow-color', '#5a5858');
    } else {
      document.body.style.setProperty('--main-bg-color', '#FFFFFF');
      document.body.style.setProperty('--second-bg-color', '#F8F8F8');
      document.body.style.setProperty('--third-bg-color', '#f5f5f5');
      document.body.style.setProperty('--dashboard-bg-color', '#eaf2f6');
      document.body.style.setProperty('--hover-bg-color', '#f0f7ff');
      document.body.style.setProperty('--main-border-color', '#F0F0F0');
      document.body.style.setProperty('--second-border-color', '#D9D9D9');
      document.body.style.setProperty('--main-text-color', 'rgba(0, 0, 0, 0.85)');
      document.body.style.setProperty('--second-text-color', 'rgba(0, 0, 0, 0.65)');
      document.body.style.setProperty('--third-text-color', 'rgba(0, 0, 0, 0.45)');
      document.body.style.setProperty('--forth-text-color', 'rgba(0, 0, 0, 0.25)');
      document.body.style.setProperty('--main-shadow-color', '#cac8c8');
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};
