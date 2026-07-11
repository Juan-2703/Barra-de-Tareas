export const getFontSize = (size: 'small' | 'medium' | 'large'): number => {
  switch (size) {
    case 'small': return 12;
    case 'large': return 18;
    default: return 14;
  }
};