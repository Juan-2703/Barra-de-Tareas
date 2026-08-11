import { useEffect, useState } from 'react';

import { useTasks } from '../../../../core/contexts/TaskContext';
import { TaskPriority } from '../../domain/entities/task.entity';

export const useEditTask = (id?: string) => {
  const { tasks, updateTask } = useTasks();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState<Date | undefined>();
  const [prioridad, setPrioridad] = useState<TaskPriority>('media');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const task = tasks.find((item) => item.id === id);

    if (!task) {
      if (tasks.length > 0) {
        setAlert({
          visible: true,
          title: 'Error',
          message: 'No se encontró la tarea a editar',
        });
        setIsLoading(false);
      }

      return;
    }

    setTitulo(task.titulo);
    setDescripcion(task.descripcion || '');
    setFecha(task.fechaVencimiento);
    setPrioridad(task.prioridad || 'media');
    setIsLoading(false);
  }, [id, tasks]);

  const handleSave = async () => {
    if (!id) return;

    if (!titulo.trim()) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'El título no puede estar vacío',
      });
      return;
    }

    setIsSaving(true);

    try {
      await updateTask(id, titulo, descripcion, fecha, prioridad);
      setIsSuccess(true);
      setAlert({
        visible: true,
        title: 'Éxito',
        message: 'Tarea actualizada correctamente',
      });
    } catch (error: any) {
      setAlert({
        visible: true,
        title: 'Error',
        message: error.message || 'No se pudo actualizar la tarea',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetAlert = () => {
    setAlert({ visible: false, title: '', message: '' });
  };

  return {
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
  };
};