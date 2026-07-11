import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary'
          ? { backgroundColor: theme.card, borderColor: theme.border }
          : { backgroundColor: '#5d8a6e' },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          variant === 'secondary' ? styles.secondaryText : styles.primaryText,
          { fontSize: currentFontSize }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#333',
    fontWeight: 'bold',
  },
});