import { ThemeStyle } from '../types';

const THEMES: ThemeStyle[] = ['classic', 'sparkle', 'adventure'];

export function getRandomTheme(): ThemeStyle {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

export function getThemeColors(theme: ThemeStyle) {
  switch (theme) {
    case 'classic':
      return { bg: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 60%, #4CAF50 60%)', accent: '#FF69B4', text: '#333' };
    case 'sparkle':
      return { bg: 'linear-gradient(135deg, #FFB6C1, #FF69B4, #DDA0DD)', accent: '#FFD700', text: '#fff' };
    case 'adventure':
      return { bg: 'linear-gradient(180deg, #E3F2FD, #BBDEFB 40%, #C8E6C9 60%, #A5D6A7)', accent: '#FF9800', text: '#333' };
  }
}
