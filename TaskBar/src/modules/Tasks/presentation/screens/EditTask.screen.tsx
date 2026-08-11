import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../../../core/hooks/useTheme.hook';
import { useFontSize } from '../../../../core/hooks/useFontSize.hook';
import { textSizes } from '../../../../config/theme/texts';

import { CustomAlert } from '../../../../core/components/CustomAlert.component';

import { TaskForm } from '../components/TaskForm.component';
import { useEditTask } from '../hooks/useEditTask.hook';

export const EditTaskScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const insets = useSafeAreaInsets();
  const currentFontSize = textSizes[fontSize];

  const {
    titulo,
    descripcion,
    fecha,
    prioridad,
    isLoading,
    isSaving,
    alert,
    isSuccess,
    setTitulo,
    setDescripcion,
    setFecha,
    setPrioridad,
    handleSave,
    resetAlert,
  } = useEditTask(id);

  const handleCloseAlert = () => {
    resetAlert();
    if (isSuccess) router.back();
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#5d8a6e" />
        <Text style={[styles.loadingText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
          Cargando tarea...
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: theme.header }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: '#fff', fontSize: currentFontSize + 4 }]}>
            Editar Tarea
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.content} pointerEvents={alert.visible ? 'none' : 'auto'}>
          <TaskForm
            titulo={titulo}
            descripcion={descripcion}
            prioridad={prioridad}
            fecha={fecha}
            isLoading={isSaving}
            submitText="Guardar Cambios"
            onTituloChange={setTitulo}
            onDescripcionChange={setDescripcion}
            onPrioridadChange={setPrioridad}
            onFechaChange={setFecha}
            onSubmit={handleSave}
            onCancel={() => router.back()}
          />
        </View>

        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
});