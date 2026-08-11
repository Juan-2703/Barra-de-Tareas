import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';

interface PhotoPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
}

export const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.title, { color: theme.text, fontSize: currentFontSize + 4 }]}>
                Seleccionar foto
              </Text>

              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.option} onPress={onCamera}>
                  <View style={[styles.iconCircle, { backgroundColor: theme.header + '20' }]}>
                    <MaterialIcons name="photo-camera" size={32} color={theme.text} />
                  </View>
                  <Text style={[styles.optionText, { color: theme.text, fontSize: currentFontSize }]}>
                    Cámara
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={onGallery}>
                  <View style={[styles.iconCircle, { backgroundColor: theme.header + '20' }]}>
                    <MaterialIcons name="photo-library" size={32} color={theme.text} />
                  </View>
                  <Text style={[styles.optionText, { color: theme.text, fontSize: currentFontSize }]}>
                    Galería
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={[styles.cancelText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '85%',
    maxWidth: 320,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  option: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {
    fontWeight: '500',
  },
});