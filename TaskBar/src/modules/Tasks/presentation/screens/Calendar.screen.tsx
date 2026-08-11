import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { useTasks } from '../../../../core/contexts/TaskContext';
import { textSizes } from '../../../../config/theme/texts';
import {
  TaskEntityImpl,
  TaskPriority,
} from '../../domain/entities/task.entity';

LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  dayNamesShort: [
    'Dom',
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
  ],
  today: 'Hoy',
};

LocaleConfig.defaultLocale = 'es';

const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const createDateFromString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const priorityColors: Record<TaskPriority, string> = {
  alta: '#e74c3c',
  media: '#f39c12',
  baja: '#2ecc71',
};

export const CalendarScreen = () => {
  const { tasks, isLoading } = useTasks();
  const { theme, isDark } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = textSizes[fontSize];
  const todayString = getDateString(new Date());

  const [selectedDate, setSelectedDate] = useState(todayString);
  const [showPicker, setShowPicker] = useState(false);

  const dayTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.fechaVencimiento) return false;

      return (
        getDateString(task.fechaVencimiento) === selectedDate
      );
    });
  }, [tasks, selectedDate]);

  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};

    tasks.forEach((task) => {
      if (!task.fechaVencimiento) return;

      const date = getDateString(task.fechaVencimiento);

      if (!marked[date]) {
        marked[date] = {
          marked: true,
          dotColor: task.completada
            ? '#4CAF50'
            : '#FF6B6B',
        };
      }
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#5d8a6e',
    };

    return marked;
  }, [tasks, selectedDate]);

  const formatDate = useCallback((dateString: string) => {
    return createDateFromString(dateString).toLocaleDateString(
      'es-ES',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setShowPicker(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: TaskEntityImpl }) => {
      const priorityColor =
        priorityColors[item.prioridad];

      return (
        <View
          style={[
            styles.taskItem,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
              borderLeftColor: priorityColor,
            },
          ]}
        >
          <View style={styles.taskHeader}>
            <MaterialIcons
              name={
                item.completada
                  ? 'check-circle'
                  : 'radio-button-unchecked'
              }
              size={20}
              color={
                item.completada
                  ? '#4CAF50'
                  : theme.textSecondary
              }
            />

            <Text
              style={[
                styles.taskTitle,
                {
                  color: item.completada
                    ? theme.textSecondary
                    : theme.text,
                  fontSize: currentFontSize,
                  textDecorationLine: item.completada
                    ? 'line-through'
                    : 'none',
                },
              ]}
            >
              {item.titulo}
            </Text>
          </View>

          {!!item.descripcion && (
            <Text
              style={[
                styles.taskDescription,
                {
                  color: theme.textSecondary,
                  fontSize: currentFontSize - 2,
                },
              ]}
            >
              {item.descripcion}
            </Text>
          )}
        </View>
      );
    },
    [theme, currentFontSize]
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color="#5d8a6e"
        />

        <Text
          style={[
            styles.loadingText,
            {
              color: theme.textSecondary,
              fontSize: currentFontSize,
            },
          ]}
        >
          Cargando calendario...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.text,
              fontSize: currentFontSize + 4,
            },
          ]}
        >
          Selecciona una fecha
        </Text>

        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons
            name="calendar-today"
            size={20}
            color="#5d8a6e"
          />

          <Text
            style={[
              styles.dateText,
              {
                color: theme.text,
                fontSize: currentFontSize,
              },
            ]}
          >
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        key={isDark ? 'dark' : 'light'}
        transparent
        visible={showPicker}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
          >
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Calendar
                current={selectedDate}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                theme={{
                  backgroundColor: theme.background,
                  calendarBackground: theme.card,
                  textSectionTitleColor: theme.text,
                  dayTextColor: theme.text,
                  todayTextColor: '#5d8a6e',
                  arrowColor: '#5d8a6e',
                  monthTextColor: theme.text,
                  textDisabledColor: isDark
                    ? '#4d4d4d'
                    : '#d0d0d0',
                }}
                style={styles.calendar}
              />

              <TouchableOpacity
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: theme.border,
                  },
                ]}
                onPress={() => setShowPicker(false)}
              >
                <Text
                  style={[
                    styles.closeButtonText,
                    {
                      color: theme.text,
                      fontSize: currentFontSize,
                    },
                  ]}
                >
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <View
        style={[
          styles.taskListContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.taskListTitle,
            {
              color: theme.text,
              fontSize: currentFontSize + 4,
            },
          ]}
        >
          Tareas del día
        </Text>

        <FlatList
          data={dayTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={false}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.textSecondary,
                  fontSize: currentFontSize,
                },
              ]}
            >
              No hay tareas para esta fecha
            </Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dateText: {
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'center',
  },
  taskListContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  taskListTitle: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taskItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderLeftWidth: 5,
    borderBottomWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskTitle: {
    flex: 1,
    fontWeight: '500',
  },
  taskDescription: {
    marginTop: 4,
    marginLeft: 28,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  calendar: {
    width: '100%',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeButtonText: {
    fontWeight: 'bold',
  },
});