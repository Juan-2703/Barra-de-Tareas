import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { TaskItem } from '../components/TaskItem';
import { CustomAlert } from '../components/CustomAlert';
import { Task } from '../types/Task';

type HomeScreenNavigationProp = { navigate: (screen: string, params?: any) => void };

export const HomeScreen = () => {
  const { tareas, toggleComplete, deleteTask } = useTasks();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();

  const [deleteAlert, setDeleteAlert] = useState<{
    visible: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({ visible: false, taskId: null, taskTitle: '' });

  const [detailsAlert, setDetailsAlert] = useState<{
    visible: boolean;
    tarea: Task | null;
  }>({ visible: false, tarea: null });

  const tareasOrdenadas = useMemo(() => {
    return [...tareas].sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
  }, [tareas]);

  const handleDeleteRequest = useCallback((id: string) => {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      setDeleteAlert({
        visible: true,
        taskId: id,
        taskTitle: tarea.titulo,
      });
    }
  }, [tareas]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteAlert.taskId) {
      deleteTask(deleteAlert.taskId);
    }
    setDeleteAlert({ visible: false, taskId: null, taskTitle: '' });
  }, [deleteAlert.taskId, deleteTask]);

  const handleCancelDelete = useCallback(() => {
    setDeleteAlert({ visible: false, taskId: null, taskTitle: '' });
  }, []);

  const handleOpenDetails = useCallback((tarea: Task) => {
    setDetailsAlert({ visible: true, tarea });
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsAlert({ visible: false, tarea: null });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TaskItem
        tarea={item}
        onToggleComplete={toggleComplete}
        onEdit={(id) => navigation.navigate('EditTask', { taskId: id })}
        onDeleteRequest={handleDeleteRequest}
        onPress={handleOpenDetails}
      />
    ),
    [toggleComplete, handleDeleteRequest, handleOpenDetails, navigation]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, paddingTop: 40 }]}>
        <Text style={[styles.headerTitle, { color: '#fff' }]}>Mis Tareas</Text>
      </View>
      <FlatList
        data={tareasOrdenadas}
        keyExtractor={(item) => item.id}
        extraData={tareasOrdenadas}
        renderItem={renderItem}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
        contentContainerStyle={[styles.listContent, { paddingTop: 20 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>¡No hay tareas aún! Crea una nueva.</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.fab }]}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <MaterialIcons name="add" size={30} color={theme.fabText} />
      </TouchableOpacity>

      <CustomAlert
        visible={deleteAlert.visible}
        title="Eliminar tarea"
        message={`¿Estás seguro de que quieres eliminar "${deleteAlert.taskTitle}" ?`}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <CustomAlert
        visible={detailsAlert.visible}
        title={detailsAlert.tarea?.titulo || 'Detalles'}
        message={
          detailsAlert.tarea
            ? `Descripción:\n${detailsAlert.tarea.descripcion || 'Sin descripción'}\n\nFecha Limite:\n${detailsAlert.tarea.fechaVencimiento ? detailsAlert.tarea.fechaVencimiento.toLocaleDateString() : 'Sin fecha'}`
            : ''
        }
        onClose={handleCloseDetails}
        hideConfirmButton
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
