import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';

import { CustomInput } from '../../../../core/components/CustomInput.component';
import { CustomButton } from '../../../../core/components/CustomButton.component';

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

interface ChangePasswordModalProps {
  visible: boolean;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  errors: PasswordErrors;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  setCurrentPassword: (text: string) => void;
  setNewPassword: (text: string) => void;
  setConfirmNewPassword: (text: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  currentPassword,
  newPassword,
  confirmNewPassword,
  errors,
  isLoading,
  onClose,
  onSave,
  setCurrentPassword,
  setNewPassword,
  setConfirmNewPassword,
}) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text, fontSize: currentFontSize + 4 }]}>
                Cambiar contraseña
              </Text>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <CustomInput
                  label="Contraseña actual"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Ingresa tu contraseña actual"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  error={errors.currentPassword}
                />

                <CustomInput
                  label="Nueva contraseña"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nueva contraseña"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  error={errors.newPassword}
                />

                <CustomInput
                  label="Confirmar nueva contraseña"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Confirma tu nueva contraseña"
                  secureTextEntry
                  showPasswordToggle
                  autoCapitalize="none"
                  error={errors.confirmNewPassword}
                />

                <Text style={[styles.hintText, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
                  La contraseña debe tener al menos 6 caracteres
                </Text>

                <CustomButton
                  title="Cambiar contraseña"
                  onPress={onSave}
                  isLoading={isLoading}
                />

                <CustomButton
                  title="Cancelar"
                  onPress={onClose}
                  variant="secondary"
                  disabled={isLoading}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  hintText: {
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 8,
    opacity: 0.7,
  },
});