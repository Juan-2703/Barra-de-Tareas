import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTasks } from '../../../../core/contexts/TaskContext';
import { TaskEntityImpl } from '../../domain/entities/task.entity';

export const useTaskActions = () => {
  const router = useRouter();

  const {
    tasks,
    deleteTask,
  } = useTasks();

  const [deleteAlert, setDeleteAlert] = useState<{
    visible: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    visible: false,
    taskId: null,
    taskTitle: '',
  });

  const [detailsAlert, setDetailsAlert] = useState<{
    visible: boolean;
    task: TaskEntityImpl | null;
  }>({
    visible: false,
    task: null,
  });

  const [errorAlert, setErrorAlert] = useState<{
    visible: boolean;
    message: string;
  }>({
    visible: false,
    message: '',
  });

  const handleDeleteRequest = (id: string) => {
    const task = tasks.find(
      (currentTask) => currentTask.id === id
    );

    if (!task) {
      return;
    }

    setDeleteAlert({
      visible: true,
      taskId: id,
      taskTitle: task.titulo,
    });
  };

  const handleConfirmDelete = async () => {
    const taskId = deleteAlert.taskId;

    setDeleteAlert({
      visible: false,
      taskId: null,
      taskTitle: '',
    });

    if (!taskId) {
      return;
    }

    try {
      await deleteTask(taskId);
    } catch (error) {
      setErrorAlert({
        visible: true,
        message: 'No se pudo eliminar la tarea',
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteAlert({
      visible: false,
      taskId: null,
      taskTitle: '',
    });
  };

  const handleOpenDetails = (
    task: TaskEntityImpl
  ) => {
    setDetailsAlert({
      visible: true,
      task,
    });
  };

  const handleCloseDetails = () => {
    setDetailsAlert({
      visible: false,
      task: null,
    });
  };

  const handleEdit = (id: string) => {
    router.push(`/(tabs)/tasks/${id}`);
  };

  const closeErrorAlert = () => {
    setErrorAlert({
      visible: false,
      message: '',
    });
  };

  return {
    deleteAlert,
    detailsAlert,
    errorAlert,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCancelDelete,
    handleOpenDetails,
    handleCloseDetails,
    handleEdit,
    closeErrorAlert,
  };
};