import { useState } from 'react';
import { useTasks } from '../../../../core/contexts/TaskContext';

export const useToggleComplete = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    toggleComplete: toggleTaskComplete,
  } = useTasks();

  const toggleComplete = async (id: string) => {
    setIsLoading(true);

    try {
      await toggleTaskComplete(id);
    } catch (error) {
      console.error(
        'Error al cambiar estado:',
        error
      );

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    toggleComplete,
    isLoading,
  };
};