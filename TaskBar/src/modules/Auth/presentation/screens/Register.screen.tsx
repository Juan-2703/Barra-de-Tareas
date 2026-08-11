import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { useUser } from '../../../../core/contexts/UserContext';

import { textSizes } from '../../../../config/theme/texts';

import { CustomInput } from '../../../../core/components/CustomInput.component';
import { CustomButton } from '../../../../core/components/CustomButton.component';
import { CustomAlert } from '../../../../core/components/CustomAlert.component';

interface RegisterErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterScreen = () => {
  const [username, setUsername] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<RegisterErrors>({});

  const [alert, setAlert] =
    useState({
      visible: false,
      title: '',
      message: '',
    });

  const { register } = useUser();
  const router = useRouter();

  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize =
    textSizes[fontSize];

  const isValidEmail = (
    value: string
  ): boolean => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(
      value.trim()
    );
  };

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

  const handleUsernameChange = (
    value: string
  ) => {
    setUsername(value);

    if (errors.username) {
      setErrors((prev) => ({
        ...prev,
        username: undefined,
      }));
    }
  };

  const handleEmailChange = (
    value: string
  ) => {
    setEmail(value);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
      }));
    }
  };

  const handlePasswordChange = (
    value: string
  ) => {
    setPassword(value);

    setErrors((prev) => ({
      ...prev,
      password: undefined,
      confirmPassword:
        confirmPassword &&
        value !==
          confirmPassword
          ? 'Las contraseñas no coinciden'
          : undefined,
    }));
  };

  const handleConfirmPasswordChange =
    (value: string) => {
      setConfirmPassword(value);

      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value &&
          password !== value
            ? 'Las contraseñas no coinciden'
            : undefined,
      }));
    };

  const validateForm = () => {
    const newErrors: RegisterErrors =
      {};

    if (!username.trim()) {
      newErrors.username =
        'El nombre de usuario es obligatorio';
    } else if (
      username.trim().length < 3
    ) {
      newErrors.username =
        'Debe tener al menos 3 caracteres';
    } else if (
      username.trim().length > 25
    ) {
      newErrors.username =
        'Debe tener máximo 25 caracteres';
    }

    if (!email.trim()) {
      newErrors.email =
        'El correo es obligatorio';
    } else if (
      !isValidEmail(email)
    ) {
      newErrors.email =
        'Ingresa un correo válido';
    }

    if (!password) {
      newErrors.password =
        'La contraseña es obligatoria';
    } else if (
      password.length < 6
    ) {
      newErrors.password =
        'Debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        'Confirma tu contraseña';
    } else if (
      password !==
      confirmPassword
    ) {
      newErrors.confirmPassword =
        'Las contraseñas no coinciden';
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors)
        .length > 0
    ) {
      showAlert(
        'Revisa tus datos',
        'Corrige los campos marcados para continuar.'
      );

      return false;
    }

    return true;
  };

  const handleRegister =
    async () => {
      if (!validateForm()) return;

      setIsLoading(true);

      try {
        await register(
          email.trim(),
          password,
          username.trim()
        );
      } catch (error: any) {
        showAlert(
          'Error',
          error.message ||
            'No se pudo crear la cuenta'
        );
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                theme.background,
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={
              styles.scrollContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >
            <View
              style={styles.header}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                    fontSize:
                      currentFontSize +
                      12,
                  },
                ]}
              >
                Crear cuenta
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color:
                      theme.textSecondary,
                    fontSize:
                      currentFontSize,
                  },
                ]}
              >
                Regístrate para empezar
              </Text>
            </View>

            <View
              style={styles.form}
            >
              <CustomInput
                label="Nombre de usuario"
                value={username}
                onChangeText={
                  handleUsernameChange
                }
                placeholder="usuario"
                autoCapitalize="none"
                maxLength={25}
                error={
                  errors.username
                }
              />

              <View
                style={
                  styles.usernameHintContainer
                }
              >
                <Text
                  style={[
                    styles.usernameHint,
                    {
                      color:
                        theme.textSecondary,
                      fontSize:
                        currentFontSize -
                        4,
                    },
                  ]}
                >
                  Máximo 25 caracteres
                </Text>

                <Text
                  style={[
                    styles.usernameHint,
                    {
                      color:
                        theme.textSecondary,
                      fontSize:
                        currentFontSize -
                        4,
                    },
                  ]}
                >
                  {username.length}/25
                </Text>
              </View>

              <CustomInput
                label="Correo electrónico"
                value={email}
                onChangeText={
                  handleEmailChange
                }
                placeholder="correo@ejemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email}
              />

              <CustomInput
                label="Contraseña"
                value={password}
                onChangeText={
                  handlePasswordChange
                }
                placeholder="Contraseña"
                secureTextEntry
                showPasswordToggle
                autoCapitalize="none"
                error={
                  errors.password
                }
              />

              <CustomInput
                label="Confirmar contraseña"
                value={
                  confirmPassword
                }
                onChangeText={
                  handleConfirmPasswordChange
                }
                placeholder="Confirma tu contraseña"
                secureTextEntry
                showPasswordToggle
                autoCapitalize="none"
                error={
                  errors.confirmPassword
                }
              />

              <Text
                style={[
                  styles.passwordHint,
                  {
                    color:
                      theme.textSecondary,
                    fontSize:
                      currentFontSize -
                      4,
                  },
                ]}
              >
                La contraseña debe tener al menos 6 caracteres
              </Text>

              <CustomButton
                title="Registrarse"
                onPress={
                  handleRegister
                }
                isLoading={isLoading}
                disabled={isLoading}
              />

              <TouchableOpacity
                disabled={isLoading}
                onPress={() =>
                  router.push('/login')
                }
              >
                <Text
                  style={[
                    styles.loginLink,
                    {
                      fontSize:
                        currentFontSize,
                      opacity:
                        isLoading
                          ? 0.5
                          : 1,
                    },
                  ]}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <CustomAlert
            visible={alert.visible}
            title={alert.title}
            message={alert.message}
            onClose={() =>
              setAlert({
                visible: false,
                title: '',
                message: '',
              })
            }
            hideConfirmButton
            cancelText="Cerrar"
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 24,
    },
    header: {
      marginBottom: 40,
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      opacity: 0.7,
      textAlign: 'center',
    },
    form: {
      width: '100%',
    },
    usernameHintContainer: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      marginTop: -12,
      marginBottom: 12,
      paddingHorizontal: 2,
    },
    usernameHint: {
      opacity: 0.7,
    },
    passwordHint: {
      textAlign: 'center',
      marginTop: -8,
      marginBottom: 8,
      opacity: 0.7,
    },
    loginLink: {
      color: '#5d8a6e',
      textAlign: 'center',
      marginTop: 16,
      fontWeight: 'bold',
    },
  });