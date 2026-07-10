import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontStyles } from '../utils/fontStyles';
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
  const fontStyles = getFontStyles(fontSize);

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
        <Text style={[styles.taskTitle, { color: theme.text, fontSize: fontStyles.body.fontSize }]}>
          {item.completada ? '✅ ' : '⬜ '}
          {item.titulo}
        </Text>
        {item.descripcion && <Text style={[styles.taskDescription, { color: theme.textSecondary, fontSize: fontStyles.body.fontSize - 2 }]}>{item.descripcion}</Text>}
      </View>
    ),
    [theme, fontStyles]
  );

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text, fontSize: fontStyles.title.fontSize }]}>
          Selecciona una fecha
        </Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
          <Text style={[styles.dateText, { color: theme.text, fontSize: fontStyles.input.fontSize }]}>
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <Modal transparent={true} visible={showPicker} animationType="slide" onRequestClose={() => setShowPicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Calendar
                onDayPress={(day) => {
                  setSelectedDate(new Date(day.dateString));
                  setShowPicker(false);
                }}
                markedDates={{
                  [selectedDate ? getDateString(selectedDate) : '']: { selected: true, selectedColor: '#5d8a6e' }
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
                  textDisabledColor: isDark ? '#444444' : '#d0d0d0',
                }}
                style={styles.calendar}
              />
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.border }]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={[styles.closeButtonText, { color: theme.text, fontSize: fontStyles.body.fontSize }]}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={[styles.taskListContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.taskListTitle, { color: theme.text, fontSize: fontStyles.title.fontSize }]}>
          Tareas del día
        </Text>
        <FlatList
          data={tareasDelDia}
          keyExtractor={(item) => item.id}
          extraData={tareas}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary, fontSize: fontStyles.body.fontSize }]}>
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
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', padding: 20, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  calendar: { width: '100%', borderRadius: 12 },
  closeButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  closeButtonText: { fontWeight: 'bold' },
  taskListContainer: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  taskListTitle: { fontWeight: 'bold', marginBottom: 15 },
  taskItem: { paddingVertical: 12, borderBottomWidth: 1 },
  taskTitle: { fontWeight: '500' },
  taskDescription: { marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 20 },
});