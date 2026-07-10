export type FontStyles = {
  body: { fontSize: number };
  title: { fontSize: number };
  input: { fontSize: number };
  button: { fontSize: number };
};

export const getFontSize = (size: 'small' | 'medium' | 'large'): number => {
  switch (size) {
    case 'small': return 13;
    case 'large': return 19;
    default: return 16;
  }
};

export const getFontStyles = (size: 'small' | 'medium' | 'large'): FontStyles => {
  const base = getFontSize(size);
  return {
    body: { fontSize: base },
    title: { fontSize: base + 4 },
    input: { fontSize: base },
    button: { fontSize: base },
  };
};