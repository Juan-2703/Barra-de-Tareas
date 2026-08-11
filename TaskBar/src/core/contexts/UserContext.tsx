import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  User,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../../config/firebase/firebase';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isNewUser: boolean;
  clearNewUser: () => void;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (
    displayName: string
  ) => Promise<void>;
  updateProfilePhoto: (
    photoURL: string
  ) => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const UserContext =
  createContext<UserContextType | undefined>(
    undefined
  );

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isNewUser, setIsNewUser] =
    useState(false);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser);
          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  const clearNewUser = () => {
    setIsNewUser(false);
  };

  const refreshUser =
    async (): Promise<void> => {
      const currentUser =
        auth.currentUser;

      if (!currentUser) return;

      try {
        await currentUser.reload();
        setUser(auth.currentUser);
      } catch (error) {
        console.error(
          'Error recargando usuario:',
          error
        );
      }
    };

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    setIsNewUser(false);

    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      setUser(result.user);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error(
            'El correo electrónico no es válido'
          );

        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          throw new Error(
            'Correo o contraseña incorrectos'
          );

        case 'auth/too-many-requests':
          throw new Error(
            'Demasiados intentos. Intenta nuevamente más tarde'
          );

        case 'auth/network-request-failed':
          throw new Error(
            'No se pudo conectar a Internet'
          );

        default:
          throw new Error(
            'No se pudo iniciar sesión'
          );
      }
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ): Promise<void> => {
    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await updateProfile(
        result.user,
        {
          displayName:
            username.trim(),
        }
      );

      await result.user.reload();

      setIsNewUser(true);
      setUser(auth.currentUser);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error(
            'Este correo ya está registrado'
          );

        case 'auth/invalid-email':
          throw new Error(
            'El correo electrónico no es válido'
          );

        case 'auth/weak-password':
          throw new Error(
            'La contraseña es demasiado débil'
          );

        case 'auth/network-request-failed':
          throw new Error(
            'No se pudo conectar a Internet'
          );

        case 'auth/too-many-requests':
          throw new Error(
            'Demasiados intentos. Intenta nuevamente más tarde'
          );

        default:
          throw new Error(
            'No se pudo crear la cuenta'
          );
      }
    }
  };

  const logout =
    async (): Promise<void> => {
      try {
        await signOut(auth);

        setUser(null);
        setIsNewUser(false);
      } catch {
        throw new Error(
          'No se pudo cerrar sesión'
        );
      }
    };

  const updateUserProfile = async (
    displayName: string
  ): Promise<void> => {
    const currentUser =
      auth.currentUser;

    if (!currentUser) {
      throw new Error(
        'Usuario no autenticado'
      );
    }

    try {
      await updateProfile(
        currentUser,
        {
          displayName:
            displayName.trim(),
        }
      );

      await refreshUser();
    } catch {
      throw new Error(
        'No se pudo actualizar el perfil'
      );
    }
  };

  const updateProfilePhoto = async (
    photoURL: string
  ): Promise<void> => {
    const currentUser =
      auth.currentUser;

    if (!currentUser) {
      throw new Error(
        'Usuario no autenticado'
      );
    }

    try {
      await updateProfile(
        currentUser,
        {
          photoURL,
        }
      );

      await refreshUser();
    } catch {
      throw new Error(
        'No se pudo actualizar la foto de perfil'
      );
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    const currentUser =
      auth.currentUser;

    if (!currentUser?.email) {
      throw new Error(
        'Usuario no autenticado'
      );
    }

    try {
      const credential =
        EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        currentUser,
        credential
      );

      await updatePassword(
        currentUser,
        newPassword
      );
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          throw new Error(
            'La contraseña actual es incorrecta'
          );

        case 'auth/weak-password':
          throw new Error(
            'La nueva contraseña es demasiado débil'
          );

        case 'auth/too-many-requests':
          throw new Error(
            'Demasiados intentos. Intenta nuevamente más tarde'
          );

        case 'auth/network-request-failed':
          throw new Error(
            'No se pudo conectar a Internet'
          );

        case 'auth/requires-recent-login':
          throw new Error(
            'Por seguridad, inicia sesión nuevamente'
          );

        default:
          throw new Error(
            'No se pudo cambiar la contraseña'
          );
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isNewUser,
        clearNewUser,
        login,
        register,
        logout,
        updateUserProfile,
        updateProfilePhoto,
        refreshUser,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser =
  (): UserContextType => {
    const context =
      useContext(UserContext);

    if (!context) {
      throw new Error(
        'useUser debe usarse dentro de UserProvider'
      );
    }

    return context;
  };

export { UserContext };