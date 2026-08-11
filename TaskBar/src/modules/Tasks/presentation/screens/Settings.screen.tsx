import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { useUser } from '../../../../core/contexts/UserContext';
import { useTaskList } from '../hooks/useTaskList.hook';

import { textSizes } from '../../../../config/theme/texts';
import { fontLabels } from '../../../../core/contexts/fontsize.context';

import { CustomAlert } from '../../../../core/components/CustomAlert.component';
import { TaskEntityImpl } from '../../domain/entities/task.entity';

export const SettingsScreen = () => {
  const router = useRouter();
  const { user, logout, refreshUser } = useUser();
  const { tasks } = useTaskList();
  const { theme, isDark, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  const currentFontSize = textSizes[fontSize];

  const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: '' });
  const [forceUpdate, setForceUpdate] = useState(0);

  useFocusEffect(
    useCallback(() => {
      refreshUser().then(() => setForceUpdate((prev) => prev + 1));
    }, [])
  );

  const totalTareas = tasks.length;
  const completadas = tasks.filter((task: TaskEntityImpl) => task.completada).length;
  const pendientes = totalTareas - completadas;

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  const email = user?.email || 'usuario@email.com';
  const photoURL = user?.photoURL || '';

  const confirmLogout = async () => {
    setLogoutAlertVisible(false);

    try {
      await logout();
      router.replace('/login');
    } catch {
      setErrorAlert({
        visible: true,
        message: 'No se pudo cerrar sesión',
      });
    }
  };

  const handleFontSizePress = () => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const nextIndex = (sizes.indexOf(fontSize) + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        key={forceUpdate}
      >
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <Text style={[styles.headerTitle, { color: '#fff', fontSize: currentFontSize + 8 }]}>
            Ajustes
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.accountCard, { backgroundColor: theme.card }]}
          onPress={() => router.push('/account')}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#2d5a3d' }]}>
                <Text style={[styles.avatarText, { fontSize: currentFontSize + 12 }]}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.accountInfo}>
            <Text style={[styles.accountName, { color: theme.text, fontSize: currentFontSize + 2 }]}>
              {displayName}
            </Text>

            <Text style={[styles.accountEmail, { color: theme.textSecondary, fontSize: currentFontSize - 2 }]}>
              {email}
            </Text>
          </View>

          <MaterialIcons name="chevron-right" size={28} color={theme.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
            ESTADÍSTICAS
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text, fontSize: currentFontSize + 8 }]}>
                {totalTareas}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
                Total
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#4CAF50', fontSize: currentFontSize + 8 }]}>
                {completadas}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
                Completadas
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#FF6B6B', fontSize: currentFontSize + 8 }]}>
                {pendientes}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
                Pendientes
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: currentFontSize - 4 }]}>
            PREFERENCIAS
          </Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={theme.text} />
              <Text style={[styles.preferenceText, { color: theme.text, fontSize: currentFontSize }]}>
                {isDark ? 'Modo claro' : 'Modo oscuro'}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#2d5a3d' }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.preferenceItem} onPress={handleFontSizePress} activeOpacity={0.7}>
            <View style={styles.preferenceLeft}>
              <MaterialIcons name="text-increase" size={24} color={theme.text} />
              <Text style={[styles.preferenceText, { color: theme.text, fontSize: currentFontSize }]}>
                Tamaño de fuente
              </Text>
            </View>

            <View style={styles.fontSizeBadge}>
              <Text style={[styles.fontSizeText, { fontSize: currentFontSize - 4 }]}>
                {fontLabels[fontSize]}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.card }]}
          onPress={() => setLogoutAlertVisible(true)}
        >
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text style={[styles.logoutText, { fontSize: currentFontSize }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        visible={logoutAlertVisible}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        onClose={() => setLogoutAlertVisible(false)}
        onConfirm={confirmLogout}
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
      />

      <CustomAlert
        visible={errorAlert.visible}
        title="Error"
        message={errorAlert.message}
        onClose={() => setErrorAlert({ visible: false, message: '' })}
        hideConfirmButton
        cancelText="Cerrar"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 15 },
  headerTitle: { fontWeight: 'bold', fontSize: 24 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarContainer: { marginRight: 16 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  accountInfo: { flex: 1 },
  accountName: { fontWeight: 'bold' },
  accountEmail: { opacity: 0.6 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceText: {
    fontSize: 16,
  },
  fontSizeBadge: {
    backgroundColor: '#2d5a3d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fontSizeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFCDCD',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});