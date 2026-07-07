// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Ajustes</Text>
        <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.option, { color: theme.text }]}>Modo Oscuro</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
  option: { fontSize: 18 },
});