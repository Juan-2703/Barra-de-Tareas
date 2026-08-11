import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';

import { CustomAlert } from '../../../../core/components/CustomAlert.component';

import { TaskForm } from '../components/TaskForm.component';
import { useCreateTask } from '../hooks/useCreateTask.hook';

export const CreateTaskScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const insets = useSafeAreaInsets();
  const currentFontSize = textSizes[fontSize];

  const {
    titulo,
    descripcion,
    fechaVencimiento,
    prioridad,
    isLoading,
    error,
    success,
    setTitulo,
    setDescripcion,
    setFechaVencimiento,
    setPrioridad,
    handleCreate,
    resetAlert,
  } = useCreateTask();

  const handleCloseAlert = () => {
    resetAlert();
    if (success) router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: '#fff', fontSize: currentFontSize + 4 }]}>
            Crear Tarea
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.content} pointerEvents={!!error || success ? 'none' : 'auto'}>
          <TaskForm
            titulo={titulo}
            descripcion={descripcion}
            prioridad={prioridad}
            fecha={fechaVencimiento}
            isLoading={isLoading}
            submitText="Crear Tarea"
            onTituloChange={setTitulo}
            onDescripcionChange={setDescripcion}
            onPrioridadChange={setPrioridad}
            onFechaChange={setFechaVencimiento}
            onSubmit={handleCreate}
            onCancel={() => router.back()}
          />
        </View>

        <CustomAlert
          visible={!!error || success}
          title={error ? 'Error' : 'Éxito'}
          message={error || 'Tarea creada correctamente'}
          onClose={handleCloseAlert}
          hideConfirmButton
          cancelText="Cerrar"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 60,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSpace: {
    width: 40,
  },
});