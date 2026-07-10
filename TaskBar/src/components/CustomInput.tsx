import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontStyles } from '../utils/fontStyles';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, value, onChangeText, placeholder, multiline, numberOfLines = 1 }) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const fontStyles = getFontStyles(fontSize);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text, fontSize: fontStyles.input.fontSize }]}>
        {label}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text, fontSize: fontStyles.input.fontSize }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
});