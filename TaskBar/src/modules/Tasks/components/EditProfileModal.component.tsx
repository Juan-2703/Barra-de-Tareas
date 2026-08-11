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

interface EditProfileModalProps {
  visible: boolean;
  displayName: string;
  error?: string;
  onClose: () => void;
  onSave: () => void;
  onChangeText: (text: string) => void;
  isSaving: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  displayName,
  error,
  onClose,
  onSave,
  onChangeText,
  isSaving,
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
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: theme.text,
                    fontSize: currentFontSize + 4,
                  },
                ]}
              >
                Editar nombre de usuario
              </Text>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <CustomInput
                  label="Nombre de usuario"
                  value={displayName}
                  onChangeText={onChangeText}
                  placeholder="Tu nombre de usuario"
                  autoCapitalize="words"
                  maxLength={25}
                  error={error}
                />

                <View style={styles.usernameHintContainer}>
                  <Text
                    style={[
                      styles.usernameHint,
                      {
                        color: theme.textSecondary,
                        fontSize: currentFontSize - 4,
                      },
                    ]}
                  >
                    Máximo 25 caracteres
                  </Text>

                  <Text
                    style={[
                      styles.usernameHint,
                      {
                        color: theme.textSecondary,
                        fontSize: currentFontSize - 4,
                      },
                    ]}
                  >
                    {displayName.length}/25
                  </Text>
                </View>

                <CustomButton
                  title="Guardar cambios"
                  onPress={onSave}
                  isLoading={isSaving}
                />

                <CustomButton
                  title="Cancelar"
                  onPress={onClose}
                  variant="secondary"
                  disabled={isSaving}
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  usernameHintContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -12,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  usernameHint: {
    opacity: 0.7,
  },
});