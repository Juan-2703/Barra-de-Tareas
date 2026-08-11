import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../hooks/useTheme.hook';
import { useFontSize } from '../hooks/useFontSize.hook';
import { textSizes } from '../../config/theme/texts';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  editable?: boolean;
  maxLength?: number;
  style?: TextStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  showPasswordToggle = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  error,
  editable = true,
  maxLength,
  style,
}) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry && showPasswordToggle;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: theme.text,
            fontSize: currentFontSize,
          },
        ]}
      >
        {label}
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              borderColor: error ? '#e74c3c' : theme.border,
              color: theme.text,
              fontSize: currentFontSize,
              minHeight: multiline ? 140 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
              paddingRight: isPassword ? 50 : 16,
              opacity: editable ? 1 : 0.6,
            },
            style,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          editable={editable}
          maxLength={maxLength}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {!!error && (
        <Text
          style={[
            styles.errorText,
            {
              fontSize: currentFontSize - 3,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#e74c3c',
    marginTop: 6,
    marginLeft: 4,
  },
});