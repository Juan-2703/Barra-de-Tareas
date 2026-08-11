import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { useUser } from '../../../../core/contexts/UserContext';

const CLOUDINARY_CLOUD_NAME =
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const useProfile = () => {
  const {
    user,
    updateUserProfile,
    updateProfilePhoto,
    refreshUser,
  } = useUser();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPhotoURL, setLocalPhotoURL] = useState('');
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Usuario';

  const photoURL =
    localPhotoURL ||
    user?.photoURL ||
    '';

  useEffect(() => {
    if (user?.photoURL) {
      setLocalPhotoURL(user.photoURL);
    }
  }, [user?.photoURL]);

  useEffect(() => {
    if (editModalVisible && user) {
      setEditDisplayName(user.displayName || '');
      setNameError('');
    }
  }, [editModalVisible, user]);

  const showAlert = (
    title: string,
    message: string
  ) => {
    setAlert({
      visible: true,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlert({
      visible: false,
      title: '',
      message: '',
    });
  };

  const isValidUsername = (
    value: string
  ): boolean => {
    return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]+$/.test(
      value
    );
  };

  const handleDisplayNameChange = (
    value: string
  ) => {
    if (value.length <= 25) {
      setEditDisplayName(value);
    }

    if (nameError) {
      setNameError('');
    }
  };

  const openEditModal = () => {
    if (!user) return;

    setEditDisplayName(
      user.displayName || ''
    );

    setNameError('');
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setNameError('');
  };

  const handleSaveProfile = async () => {
    const name = editDisplayName.trim();

    if (!name) {
      setNameError(
        'El nombre no puede estar vacío'
      );
      return;
    }

    if (name.length < 3) {
      setNameError(
        'Debe tener al menos 3 caracteres'
      );
      return;
    }

    if (name.length > 25) {
      setNameError(
        'Debe tener máximo 25 caracteres'
      );
      return;
    }

    if (!isValidUsername(name)) {
      setNameError(
        'Solo se permiten letras, números, espacios, _ y -'
      );
      return;
    }

    if (name === user?.displayName) {
      setEditModalVisible(false);
      return;
    }

    setIsSaving(true);

    try {
      await updateUserProfile(name);
      await refreshUser();

      setEditModalVisible(false);

      showAlert(
        'Éxito',
        'Perfil actualizado correctamente'
      );
    } catch {
      showAlert(
        'Error',
        'No se pudo actualizar el perfil'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImageToCloudinary = async (
    uri: string
  ): Promise<string> => {
    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_UPLOAD_PRESET
    ) {
      throw new Error(
        'Cloudinary no está configurado'
      );
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append(
        'file',
        {
          uri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any
      );

      formData.append(
        'upload_preset',
        CLOUDINARY_UPLOAD_PRESET
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.secure_url
      ) {
        throw new Error(
          'No se pudo subir la imagen'
        );
      }

      return data.secure_url;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectPhoto = async (
    source: 'camera' | 'gallery'
  ) => {
    try {
      let result:
        ImagePicker.ImagePickerResult;

      if (source === 'camera') {
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (
          permission.status !== 'granted'
        ) {
          showAlert(
            'Permiso denegado',
            'Se necesita acceso a la cámara para tomar una foto.'
          );

          return;
        }

        result =
          await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
      } else {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (
          permission.status !== 'granted'
        ) {
          showAlert(
            'Permiso denegado',
            'Se necesita acceso a la galería para seleccionar una foto.'
          );

          return;
        }

        result =
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
      }

      if (
        result.canceled ||
        !result.assets[0]
      ) {
        return;
      }

      const uploadedUrl =
        await uploadImageToCloudinary(
          result.assets[0].uri
        );

      await updateProfilePhoto(
        uploadedUrl
      );

      setLocalPhotoURL(uploadedUrl);
      await refreshUser();

      showAlert(
        'Éxito',
        'Foto de perfil actualizada correctamente'
      );
    } catch (error) {
      console.error(
        'Error actualizando foto:',
        error
      );

      showAlert(
        'Error',
        'No se pudo actualizar la foto de perfil'
      );
    }
  };

  return {
    displayName,
    photoURL,
    editModalVisible,
    editDisplayName,
    nameError,
    isSaving,
    isUploading,
    alert,
    handleDisplayNameChange,
    openEditModal,
    closeEditModal,
    handleSaveProfile,
    handleSelectPhoto,
    hideAlert,
  };
};