import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export const CalendarScreen = () => {
  const { tareas } = useTasks();
  const { theme } = useTheme();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const tareasDelDia = useMemo(() => {
    return tareas.filter((t) => {
      if (!t.fechaVencimiento) return false;
      const ft = new Date(t.fechaVencimiento);
      return (
        ft.getFullYear() === selectedDate.getFullYear() &&
        ft.getMonth() === selectedDate.getMonth() &&
        ft.getDate() === selectedDate.getDate()
      );
    });
  }, [tareas, selectedDate]);

  const formatDate = useCallback((date: Date) => 
    date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={[styles.taskItem, { borderBottomColor: theme.border }]}>
        <Text style={[styles.taskTitle, { color: theme.text }]}>
          {item.completada ? '✅ ' : '⬜ '}
          {item.titulo}
        </Text>
        {item.descripcion && <Text style={[styles.taskDescription, { color: theme.textSecondary }]}>{item.descripcion}</Text>}
      </View>
    ),
    [theme]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>📅 Selecciona una fecha</Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
          <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
      </View>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
      <View style={[styles.taskListContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.taskListTitle, { color: theme.text }]}>Tareas del día</Text>
        <FlatList
          data={tareasDelDia}
          keyExtractor={(item) => item.id}
          extraData={tareas}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay tareas para esta fecha</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  header: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  dateButton: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateText: { fontSize: 16, fontWeight: '500' },
  taskListContainer: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  taskListTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  taskItem: { paddingVertical: 12, borderBottomWidth: 1 },
  taskTitle: { fontSize: 16, fontWeight: '500' },
  taskDescription: { fontSize: 14, marginTop: 2 },
  emptyText: { fontSize: 14, textAlign: 'center', marginTop: 20 },
});
