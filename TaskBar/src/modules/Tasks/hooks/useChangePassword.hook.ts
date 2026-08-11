import { useState } from 'react';

import { useUser } from '../../../../core/contexts/UserContext';

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export const useChangePassword = () => {
  const { changePassword } = useUser();

  const [modalVisible, setModalVisible] =
    useState(false);

  const [
    currentPassword,
    setCurrentPasswordState,
  ] = useState('');

  const [
    newPassword,
    setNewPasswordState,
  ] = useState('');

  const [
    confirmNewPassword,
    setConfirmNewPasswordState,
  ] = useState('');

  const [errors, setErrors] =
    useState<PasswordErrors>({});

  const [isLoading, setIsLoading] =
    useState(false);

  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
  });

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

  const setCurrentPassword = (
    value: string
  ) => {
    setCurrentPasswordState(value);

    if (errors.currentPassword) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: undefined,
      }));
    }
  };

  const setNewPassword = (
    value: string
  ) => {
    setNewPasswordState(value);

    setErrors((prev) => ({
      ...prev,
      newPassword: undefined,
      confirmNewPassword:
        confirmNewPassword &&
        value !== confirmNewPassword
          ? 'Las contraseñas no coinciden'
          : undefined,
    }));
  };

  const setConfirmNewPassword = (
    value: string
  ) => {
    setConfirmNewPasswordState(value);

    setErrors((prev) => ({
      ...prev,
      confirmNewPassword:
        value &&
        value !== newPassword
          ? 'Las contraseñas no coinciden'
          : undefined,
    }));
  };

  const resetFields = () => {
    setCurrentPasswordState('');
    setNewPasswordState('');
    setConfirmNewPasswordState('');
    setErrors({});
  };

  const openModal = () => {
    resetFields();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetFields();
  };

  const validateForm = (): boolean => {
    const newErrors: PasswordErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword =
        'La contraseña actual es obligatoria';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword =
        'La nueva contraseña es obligatoria';
    } else if (
      newPassword.length < 6
    ) {
      newErrors.newPassword =
        'Debe tener al menos 6 caracteres';
    } else if (
      newPassword === currentPassword
    ) {
      newErrors.newPassword =
        'La nueva contraseña debe ser diferente';
    }

    if (!confirmNewPassword.trim()) {
      newErrors.confirmNewPassword =
        'Confirma tu nueva contraseña';
    } else if (
      newPassword !==
      confirmNewPassword
    ) {
      newErrors.confirmNewPassword =
        'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleChangePassword =
    async () => {
      if (!validateForm()) return;

      setIsLoading(true);

      try {
        await changePassword(
          currentPassword,
          newPassword
        );

        setModalVisible(false);
        resetFields();

        showAlert(
          'Éxito',
          'Contraseña actualizada correctamente'
        );
      } catch (error: any) {
        showAlert(
          'Error',
          error.message ||
            'No se pudo cambiar la contraseña'
        );
      } finally {
        setIsLoading(false);
      }
    };

  return {
    modalVisible,
    currentPassword,
    newPassword,
    confirmNewPassword,
    errors,
    isLoading,
    alert,
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
    openModal,
    closeModal,
    handleChangePassword,
    hideAlert,
  };
};