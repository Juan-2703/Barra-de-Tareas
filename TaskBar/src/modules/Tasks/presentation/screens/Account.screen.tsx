import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { useUser } from '../../../../core/contexts/UserContext';
import { textSizes } from '../../../../config/theme/texts';

import { useProfile } from '../hooks/useProfile.hook';
import { useChangePassword } from '../hooks/useChangePassword.hook';

import { EditProfileModal } from '../components/EditProfileModal.component';
import { ChangePasswordModal } from '../components/ChangePasswordModal.component';
import { PhotoPickerModal } from '../components/PhotoPickerModal.component';
import { CustomAlert } from '../../../../core/components/CustomAlert.component';

export const AccountScreen = () => {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  const [forceUpdate, setForceUpdate] = useState(0);
  const [photoPickerVisible, setPhotoPickerVisible] = useState(false);

  const {
    displayName,
    photoURL,
    editModalVisible,
    editDisplayName,
    nameError,
    isSaving,
    isUploading,
    alert: profileAlert,
    handleDisplayNameChange,
    openEditModal,
    closeEditModal,
    handleSaveProfile,
    handleSelectPhoto,
    hideAlert: hideProfileAlert,
  } = useProfile();

  const {
    modalVisible: passwordModalVisible,
    currentPassword,
    newPassword,
    confirmNewPassword,
    errors: passwordErrors,
    isLoading: isChangingPassword,
    alert: passwordAlert,
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
    handleChangePassword,
    hideAlert: hidePasswordAlert,
  } = useChangePassword();

  useFocusEffect(
    useCallback(() => {
      refreshUser().then(() => setForceUpdate((prev) => prev + 1));
    }, [])
  );

  const email = user?.email || 'usuario@email.com';

  const handleAvatarPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tomar foto', 'Elegir de galería'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) void handleSelectPhoto('camera');
          if (buttonIndex === 2) void handleSelectPhoto('gallery');
        }
      );

      return;
    }

    setPhotoPickerVisible(true);
  };

  const handleCameraPress = () => {
    setPhotoPickerVisible(false);
    setTimeout(() => void handleSelectPhoto('camera'), 300);
  };

  const handleGalleryPress = () => {
    setPhotoPickerVisible(false);
    setTimeout(() => void handleSelectPhoto('gallery'), 300);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: '#fff', fontSize: currentFontSize + 4 }]}>
          Cuenta
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        key={forceUpdate}
      >
        <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.avatarLarge} />
              ) : (
                <View style={[styles.avatarLarge, { backgroundColor: '#2d5a3d' }]}>
                  <Text style={[styles.avatarTextLarge, { fontSize: currentFontSize + 16 }]}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}

              <View style={styles.editAvatarBadge}>
                <MaterialIcons name="edit" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={[styles.usernameLarge, { color: theme.text, fontSize: currentFontSize + 6 }]}>
            {displayName}
          </Text>

          <Text style={[styles.emailLarge, { color: theme.textSecondary, fontSize: currentFontSize - 2 }]}>
            {email}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
            CUENTA
          </Text>

          <TouchableOpacity style={styles.menuItem} onPress={openEditModal}>
            <MaterialIcons name="edit" size={24} color={theme.text} />

            <Text style={[styles.menuText, { color: theme.text, fontSize: currentFontSize }]}>
              Editar nombre de usuario
            </Text>

            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={openPasswordModal}
          >
            <MaterialIcons name="lock" size={24} color={theme.text} />

            <Text style={[styles.menuText, { color: theme.text, fontSize: currentFontSize }]}>
              Cambiar contraseña
            </Text>

            <MaterialIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {Platform.OS === 'android' && (
        <PhotoPickerModal
          visible={photoPickerVisible}
          onClose={() => setPhotoPickerVisible(false)}
          onCamera={handleCameraPress}
          onGallery={handleGalleryPress}
        />
      )}

      <EditProfileModal
        visible={editModalVisible}
        displayName={editDisplayName}
        error={nameError}
        onClose={closeEditModal}
        onSave={handleSaveProfile}
        onChangeText={handleDisplayNameChange}
        isSaving={isSaving}
      />

      <ChangePasswordModal
        visible={passwordModalVisible}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmNewPassword={confirmNewPassword}
        errors={passwordErrors}
        isLoading={isChangingPassword}
        onClose={closePasswordModal}
        onSave={handleChangePassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
      />

      <CustomAlert
        visible={profileAlert.visible}
        title={profileAlert.title}
        message={profileAlert.message}
        onClose={hideProfileAlert}
        hideConfirmButton
        cancelText="Cerrar"
      />

      <CustomAlert
        visible={passwordAlert.visible}
        title={passwordAlert.title}
        message={passwordAlert.message}
        onClose={hidePasswordAlert}
        hideConfirmButton
        cancelText="Cerrar"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSpace: {
    width: 40,
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2d5a3d',
  },
  avatarTextLarge: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#2d5a3d',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameLarge: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailLarge: {
    opacity: 0.5,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
});