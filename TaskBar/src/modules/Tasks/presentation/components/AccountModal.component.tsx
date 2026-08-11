import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';
import { useUser } from '../../../../core/contexts/UserContext';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  visible,
  onClose,
  onEditProfile,
  onChangePassword,
  onLogout,
}) => {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];
  const { user } = useUser();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  const email = user?.email || 'usuario@email.com';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text, fontSize: currentFontSize + 4 }]}>
              Cuenta
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: '#5d8a6e' }]}>
                <Text style={[styles.avatarText, { fontSize: currentFontSize + 12 }]}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text, fontSize: currentFontSize + 4 }]}>
                {displayName}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary, fontSize: currentFontSize - 2 }]}>
                {email}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={onEditProfile}>
            <MaterialIcons name="edit" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text, fontSize: currentFontSize }]}>
              Editar nombre de usuario
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={onChangePassword}>
            <MaterialIcons name="lock" size={24} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text, fontSize: currentFontSize }]}>
              Cambiar contraseña
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={onLogout}>
            <MaterialIcons name="logout" size={24} color="#FF3B30" />
            <Text style={[styles.menuText, { color: '#FF3B30', fontSize: currentFontSize }]}>
              Cerrar sesión
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: 'bold',
  },
  profileEmail: {
    opacity: 0.6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  logoutItem: {
    marginTop: 8,
  },
});