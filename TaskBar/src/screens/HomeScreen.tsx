import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { useFontSize } from '../context/FontSizeContext';
import { getFontSize } from '../utils/fontSizes';
import { MaterialIcons } from '@expo/vector-icons';
import { TaskItem } from '../components/TaskItem';
import { CustomAlert } from '../components/CustomAlert';
import { Task } from '../types/Task';

type HomeScreenNavigationProp = { navigate: (screen: string, params?: any) => void };

export const HomeScreen = () => {
  const { tareas, toggleComplete, deleteTask } = useTasks();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { fontSize } = useFontSize();

  const currentFontSize = getFontSize(fontSize);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#5d8a6e" />
        <Text style={[styles.loadingText, { color: theme.textSecondary, fontSize: currentFontSize }]}>
          Cargando tareas...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.header, paddingTop: 40 }]}>
        <Text style={[styles.headerTitle, { color: '#fff', fontSize: currentFontSize + 10 }]}>
          Mis Tareas
        </Text>
      </View>

      {tareasOrdenadas.length === 0 ? (
        <View style={[styles.emptyStateContainer, { backgroundColor: theme.background }]}>
          <MaterialIcons name="checklist" size={60} color={theme.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: theme.text, fontSize: currentFontSize + 4 }]}>
            ¡Nada por hacer! ✨
          </Text>
          <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary, fontSize: currentFontSize }]}>
            Agrega una tarea tocando el botón verde.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tareasOrdenadas}
          keyExtractor={(item) => item.id}
          extraData={tareasOrdenadas}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { paddingTop: 20, paddingBottom: 100 }]}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#0b6b30' }]}
        onPress={() => navigation.navigate('CreateTask')}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <CustomAlert
        visible={deleteAlert.visible}
        title="Eliminar tarea"
        message={`¿Estás seguro de que quieres eliminar "${deleteAlert.taskTitle}"?`}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <CustomAlert
        visible={detailsAlert.visible}
        title={detailsAlert.tarea?.titulo || 'Detalles'}
        message={
          detailsAlert.tarea
            ? `Descripción:\n${detailsAlert.tarea.descripcion || 'Sin descripción'}\n\nFecha de vencimiento:\n${detailsAlert.tarea.fechaVencimiento ? detailsAlert.tarea.fechaVencimiento.toLocaleDateString() : 'Sin fecha'}`
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
  headerTitle: { fontWeight: 'bold' },
  listContent: { paddingHorizontal: 20 },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
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