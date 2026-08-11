import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';

import { CustomInput } from '../../../../core/components/CustomInput.component';
import { CustomButton } from '../../../../core/components/CustomButton.component';

import { TaskPriority } from '../../domain/entities/task.entity';

interface TaskFormProps {
  titulo: string;
  descripcion: string;
  prioridad: TaskPriority;
  fecha?: Date;
  isLoading: boolean;
  submitText: string;
  onTituloChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onPrioridadChange: (value: TaskPriority) => void;
  onFechaChange: (value: Date) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const PRIORITIES: { label: string; value: TaskPriority; color: string }[] = [
  { label: 'Alta', value: 'alta', color: '#e74c3c' },
  { label: 'Media', value: 'media', color: '#f39c12' },
  { label: 'Baja', value: 'baja', color: '#2ecc71' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  titulo,
  descripcion,
  prioridad,
  fecha,
  isLoading,
  submitText,
  onTituloChange,
  onDescripcionChange,
  onPrioridadChange,
  onFechaChange,
  onSubmit,
  onCancel,
}) => {
  const { theme, isDark } = useTheme();
  const { fontSize } = useFontSize();
  const currentFontSize = textSizes[fontSize];

  const [showPicker, setShowPicker] = useState(false);

  const getDateString = (date: Date) => date.toISOString().split('T')[0];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <CustomInput
        label="Título *"
        value={titulo}
        onChangeText={onTituloChange}
        placeholder="Escribe el título..."
      />

      <CustomInput
        label="Descripción (Opcional)"
        value={descripcion}
        onChangeText={onDescripcionChange}
        placeholder="Añade detalles..."
        multiline
        numberOfLines={5}
        style={styles.descriptionInput}
      />

      <View style={styles.priorityContainer}>
        <Text style={[styles.label, { color: theme.text, fontSize: currentFontSize }]}>
          Prioridad
        </Text>

        <View style={styles.priorityOptions}>
          {PRIORITIES.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.priorityOption,
                {
                  borderColor: theme.border,
                  backgroundColor: prioridad === item.value ? `${item.color}20` : 'transparent',
                },
              ]}
              onPress={() => onPrioridadChange(item.value)}
            >
              <View style={[styles.priorityDot, { backgroundColor: item.color }]} />
              <Text style={[styles.priorityText, { color: theme.text, fontSize: currentFontSize - 2 }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={[styles.label, { color: theme.text, fontSize: currentFontSize }]}>
          fecha Límite (Opcional)
        </Text>

        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
          <Text style={[styles.dateText, { color: theme.text, fontSize: currentFontSize }]}>
            {fecha ? fecha.toLocaleDateString() : 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={showPicker}
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Calendar
                  minDate={new Date().toISOString().split('T')[0]}
                  onDayPress={(day) => {
                    onFechaChange(new Date(`${day.dateString}T00:00:00`));
                    setShowPicker(false);
                  }}
                  markedDates={{
                    [fecha ? getDateString(fecha) : '']: {
                      selected: true,
                      selectedColor: '#007AFF',
                    },
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
                    textDisabledColor: isDark ? '#4d4d4d' : '#d0d0d0',
                  }}
                  style={styles.calendar}
                />

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: theme.border }]}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={[styles.closeButtonText, { color: theme.text, fontSize: currentFontSize }]}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {isLoading ? (
        <ActivityIndicator size="large" color="#5d8a6e" style={styles.loader} />
      ) : (
        <CustomButton title={submitText} onPress={onSubmit} />
      )}

      <CustomButton title="Cancelar" variant="secondary" onPress={onCancel} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  descriptionInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
    marginBottom: 8,
  },
  priorityContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityText: {
    fontWeight: '500',
  },
  dateContainer: {
    marginBottom: 25,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  calendar: {
    width: '100%',
    borderRadius: 12,
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
  loader: {
    marginTop: 20,
  },
});