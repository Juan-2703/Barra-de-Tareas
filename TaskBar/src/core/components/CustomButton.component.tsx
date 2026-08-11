import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '../hooks/useTheme.hook';
import { useFontSize } from '../hooks/useFontSize.hook';
import { textSizes } from '../../config/theme/texts';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = true,
}) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  const isDisabled = disabled || isLoading;

  const backgroundColor =
    isDisabled
      ? '#ccc'
      : variant === 'secondary'
        ? theme.card
        : variant === 'danger'
          ? '#dc3545'
          : '#5d8a6e';

  const textColor =
    isDisabled
      ? '#999'
      : variant === 'secondary'
        ? theme.text
        : '#fff';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: theme.border,
          width: fullWidth ? '100%' : 'auto',
          opacity: isDisabled ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? theme.text : '#fff'}
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: textColor,
              fontSize: currentFontSize,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});