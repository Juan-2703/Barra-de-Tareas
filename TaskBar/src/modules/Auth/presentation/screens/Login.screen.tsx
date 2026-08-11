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

interface LoginErrors {
  email?: string;
  password?: string;
}

export const LoginScreen = () => {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [errors, setErrors] =
    useState<LoginErrors>({});

  const [alert, setAlert] =
    useState({
      visible: false,
      title: '',
      message: '',
    });

  const { login } = useUser();
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

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: LoginErrors =
      {};

    if (!email.trim()) {
      newErrors.email =
        'El correo es obligatorio';
    } else if (
      !isValidEmail(email)
    ) {
      newErrors.email =
        'Ingresa un correo válido';
    }

    if (!password.trim()) {
      newErrors.password =
        'La contraseña es obligatoria';
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

  const handleLogin =
    async () => {
      if (!validateForm()) return;

      setIsLoading(true);

      try {
        await login(
          email.trim(),
          password
        );
      } catch (error: any) {
        showAlert(
          'Error',
          error.message ||
            'No se pudo iniciar sesión'
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
                Bienvenido
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
                Inicia sesión para continuar
              </Text>
            </View>

            <View
              style={styles.form}
            >
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

              <CustomButton
                title="Iniciar Sesión"
                onPress={handleLogin}
                isLoading={isLoading}
                disabled={isLoading}
              />

              <TouchableOpacity
                disabled={isLoading}
                onPress={() =>
                  router.push(
                    '/register'
                  )
                }
              >
                <Text
                  style={[
                    styles.registerLink,
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
                  ¿No tienes cuenta? Regístrate
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
    registerLink: {
      color: '#5d8a6e',
      textAlign: 'center',
      marginTop: 16,
      fontWeight: 'bold',
    },
  });