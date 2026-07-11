import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';
import { MaterialIcons } from '@expo/vector-icons';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export const CalendarScreen = () => {
  const { tareas } = useTasks();
  const { theme, isDark } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        <Text style={[styles.taskTitle, { color: theme.text, fontSize: currentFontSize }]}>
          {item.completada ? '✅ ' : '⬜ '}
          {item.titulo}
        </Text>
        {item.descripcion && <Text style={[styles.taskDescription, { color: theme.textSecondary, fontSize: currentFontSize - 2 }]}>{item.descripcion}</Text>}
      </View>
    ),
    [theme, currentFontSize]
  );

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#5d8a6e" />
        <Text style={[styles.loadingText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
          Cargando calendario...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: currentFontSize + 4 }]}>
          Selecciona una fecha
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
          <Text style={[styles.dateText, { color: theme.text, fontSize: currentFontSize }]}>
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(new Date(day.dateString + 'T00:00:00'));
            setShowPicker(false);
          }}
          markedDates={{
            [selectedDate ? getDateString(selectedDate) : '']: { selected: true, selectedColor: '#007AFF' }
          }}
          theme={{
            backgroundColor: theme.background,
            calendarBackground: theme.card,
            textSectionTitleColor: theme.text,
            dayTextColor: theme.text,
            todayTextColor: '#5d8a6e',
            selectedDayBackgroundColor: '#5d8a6e',
            selectedDayTextColor: '#ffffff',
            arrowColor: '#5d8a6e',
            monthTextColor: theme.text,
          }}
          style={styles.calendar}
        />
      )}

      <View style={[styles.taskListContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.taskListTitle, { color: theme.text, fontSize: currentFontSize + 4 }]}>
          Tareas del día
        </Text>
        <FlatList
          data={tareasDelDia}
          keyExtractor={(item) => item.id}
          extraData={tareas}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
              No hay tareas para esta fecha
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  header: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20, alignItems: 'center' },
  headerTitle: { fontWeight: 'bold', marginBottom: 15 },
  dateButton: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateText: { fontWeight: '500' },
  taskListContainer: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  taskListTitle: { fontWeight: 'bold', marginBottom: 15 },
  taskItem: { paddingVertical: 12, borderBottomWidth: 1 },
  taskTitle: { fontWeight: '500' },
  taskDescription: { marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
  calendar: { borderRadius: 12, marginBottom: 20 },
});