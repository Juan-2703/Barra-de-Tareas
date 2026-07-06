import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<Props> = ({ title, onPress, variant = 'primary' }) => {
  const { theme } = useTheme();
  const isSecondary = variant === 'secondary';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary
          ? [styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.border }]
          : [styles.primaryButton, { backgroundColor: theme.header }],
      ]}
      onPress={onPress}
    >
      <Text style={isSecondary ? [styles.secondaryText, { color: theme.text }] : [styles.primaryText, { color: '#fff' }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  primaryButton: { borderWidth: 0 },
  secondaryButton: { borderWidth: 1 },
  primaryText: { fontWeight: 'bold', fontSize: 16 },
  secondaryText: { fontWeight: 'bold', fontSize: 16 },
});