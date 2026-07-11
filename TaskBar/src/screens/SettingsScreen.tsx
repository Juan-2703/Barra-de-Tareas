import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';

export const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);

  const fontSizeLabel = 
    fontSize === 'small' ? 'Pequeño' :
    fontSize === 'large' ? 'Grande' : 'Mediano';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text, fontSize: 28 }]}>Ajustes</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Modo Oscuro</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#5d8a6e' }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.separator} />

          <Text style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: 16 }]}>
            Tamaño de letra
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


          <View style={styles.exampleContainer}>
            <Text style={[styles.exampleTitle, { color: theme.text, fontSize: currentFontSize + 6 }]}>
              Texto de Ejemplo
            </Text>
            <Text style={[styles.exampleText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
              Este texto cambia de tamaño segun tu elección.
            </Text>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: { fontSize: 18, fontWeight: '500' },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
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
  exampleContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  exampleTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exampleText: {
    textAlign: 'center',
  },
});
