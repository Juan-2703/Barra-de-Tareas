import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { CustomAlert } from '../components/CustomAlert';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

type RouteParams = { taskId: string };

export const EditTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params as RouteParams;
  const { getTaskById, editTask } = useTasks();
  const { theme, isDark } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);

  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const showAlert = (title: string, message: string, success: boolean = false) => {
    setAlert({ visible: true, title, message });
    setIsSuccess(success);
  };

  useEffect(() => {
    const tarea = getTaskById(taskId);
    if (tarea) {
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion || '');
      setFecha(tarea.fechaVencimiento);
    } else {
      showAlert('Error', 'No se encontró la tarea a editar', false);
    }
  }, [taskId]);

  const handleSave = () => {
    const success = editTask(taskId, titulo, descripcion, fecha);
    if (success) {
      showAlert('Éxito', 'Tarea actualizada correctamente', true);
    } else {
      showAlert('Error', 'El título no puede estar vacío', false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ visible: false, title: '', message: '' });
    if (isSuccess) {
      navigation.goBack();
    }
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#5d8a6e" />
        <Text style={[styles.loadingText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
          Cargando formulario...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background, flex: 1 }]}>
      <View style={{ flex: 1 }} pointerEvents={alert.visible ? 'none' : 'auto'}>
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
        >
          <CustomInput label="Título *" value={titulo} onChangeText={setTitulo} placeholder="Escribe el título..." />
          <CustomInput
            label="Descripción (Opcional)"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Añade detalles..."
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, { color: theme.text, fontSize: currentFontSize }]}>
              Fecha Limite (Opcional)
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setShowPicker(true)}
            >
              <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
              <Text style={[styles.dateButtonText, { color: theme.text, fontSize: currentFontSize }]}>
                {fecha ? fecha.toLocaleDateString() : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            transparent={true}
            visible={showPicker}
            animationType="fade"
            onRequestClose={() => setShowPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Calendar
                  minDate={new Date().toISOString().split('T')[0]}
                  onDayPress={(day) => {
                    const selectedDate = new Date(day.dateString + 'T00:00:00');
                    setFecha(selectedDate);
                    setShowPicker(false);
                  }}
                  markedDates={{
                    [fecha ? getDateString(fecha) : '']: { selected: true, selectedColor: '#007AFF' }
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
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: theme.border }]}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={[styles.closeButtonText, { color: theme.text, fontSize: currentFontSize }]}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <CustomButton title="Guardar Cambios" onPress={handleSave} />
          <CustomButton title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} />
        </ScrollView>
      </View>

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  dateContainer: { marginBottom: 25 },
  dateLabel: { fontWeight: '600', marginBottom: 8 },
  dateButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateButtonText: { fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  calendar: { width: '100%', borderRadius: 12 },
  closeButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  closeButtonText: { fontWeight: 'bold' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
  },
});