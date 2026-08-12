import { useState } from 'react';

import { useTasks } from '../../../../core/contexts/TaskContext';
import { TaskPriority } from '../../domain/entities/task.entity';

export const useCreateTask = () => {
  const { addTask } = useTasks();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>();
  const [prioridad, setPrioridad] = useState<TaskPriority>('media');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    if (!titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await addTask(titulo, descripcion, fechaVencimiento, prioridad);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'No se pudo crear la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAlert = () => {
    setError(null);
    setSuccess(false);
  };

  return {
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
  };
};