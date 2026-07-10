import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';

export const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text, fontSize: 28 }]}>Ajustes</Text>

        {/* TARJETA 1: Modo Oscuro */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textSecondary, fontSize: 14 }]}>
            APARIENCIA
          </Text>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Modo Oscuro</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#5d8a6e' }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* TARJETA 2: Tamaño de texto */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textSecondary, fontSize: 14 }]}>
            TAMAÑO DE TEXTO
          </Text>
          <View style={styles.sizeContainer}>
            <TouchableOpacity
              style={[styles.sizeButton, fontSize === 'small' && styles.sizeActive]}
              onPress={() => setFontSize('small')}
            >
              <Text style={[styles.sizeText, { color: theme.text }]}>Pequeño</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sizeButton, fontSize === 'medium' && styles.sizeActive]}
              onPress={() => setFontSize('medium')}
            >
              <Text style={[styles.sizeText, { color: theme.text }]}>Mediano</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sizeButton, fontSize === 'large' && styles.sizeActive]}
              onPress={() => setFontSize('large')}
            >
              <Text style={[styles.sizeText, { color: theme.text }]}>Grande</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, paddingTop: 10 },
  title: { fontWeight: 'bold', marginBottom: 30 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 18, fontWeight: '500' },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  sizeActive: {
    backgroundColor: '#5d8a6e',
  },
  sizeText: { fontSize: 16, fontWeight: '500' },
});