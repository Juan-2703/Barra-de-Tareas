// src/screens/EditTaskScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { CustomAlert } from '../components/CustomAlert';

type RouteParams = { taskId: string };

export const EditTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params as RouteParams;
  const { getTaskById, editTask } = useTasks();
  const { theme } = useTheme();

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
            <Text style={[styles.dateLabel, { color: theme.text }]}>Fecha de vencimiento (Opcional)</Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setShowPicker(true)}
            >
              <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
              <Text style={[styles.dateButtonText, { color: theme.text }]}>
                {fecha ? fecha.toLocaleDateString() : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>
          {showPicker && (
            <DateTimePicker
              value={fecha || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowPicker(false);
                if (date) setFecha(date);
              }}
            />
          )}
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
  dateLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  dateButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateButtonText: { fontSize: 16 },
});