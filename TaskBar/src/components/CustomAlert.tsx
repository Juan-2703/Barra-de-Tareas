import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  hideConfirmButton?: boolean;
}

export const CustomAlert: React.FC<Props> = ({ visible, title, message, onClose, onConfirm, hideConfirmButton }) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text, fontSize: currentFontSize + 4 }]}>{title}</Text>
          
          <ScrollView
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 12 }}
          >
            <Text style={[styles.message, { color: theme.textSecondary, fontSize: currentFontSize }]}>
              {message}
            </Text>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, { color: theme.text, fontSize: currentFontSize }]}>Cerrar</Text>
            </TouchableOpacity>

            {onConfirm && !hideConfirmButton && (
              <TouchableOpacity style={[styles.button, styles.confirmButton, { backgroundColor: theme.header }]} onPress={onConfirm}>
                <Text style={[styles.buttonText, { color: '#fff', fontSize: currentFontSize }]}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    maxWidth: 320,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontWeight: '600',
  },
});