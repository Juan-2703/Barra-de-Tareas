import React, { createContext, useRef, useState, ReactNode } from 'react';
import { Task } from '../types/Task';
import { mockTasks } from '../data/mockTasks';

interface TaskContextType {
  tareas: Task[];
  addTask: (titulo: string, descripcion?: string, fechaVencimiento?: Date) => boolean;
  deleteTask: (id: string) => void;
  editTask: (id: string, titulo: string, descripcion?: string, fechaVencimiento?: Date) => boolean;
  toggleComplete: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tareasRef = useRef<Task[]>([]);
  const [, forceUpdate] = useState(0);
  const isFirstLoad = useRef(true);

  if (isFirstLoad.current) {
    tareasRef.current = mockTasks;
    isFirstLoad.current = false;
  }

  const refresh = () => forceUpdate((prev) => prev + 1);

  const addTask = (titulo: string, descripcion?: string, fechaVencimiento?: Date) => {
    if (!titulo.trim()) return false;
    const nuevaTarea: Task = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || undefined,
      fechaVencimiento,
      fechaCreacion: new Date(),
      completada: false,
    };
    tareasRef.current = [nuevaTarea, ...tareasRef.current];
    refresh();
    return true;
  };

  const deleteTask = (id: string) => {
    tareasRef.current = tareasRef.current.filter((t) => t.id !== id);
    refresh();
  };

  const editTask = (id: string, titulo: string, descripcion?: string, fechaVencimiento?: Date) => {
    if (!titulo.trim()) return false;
    tareasRef.current = tareasRef.current.map((t) =>
      t.id === id
        ? { ...t, titulo: titulo.trim(), descripcion: descripcion?.trim() || undefined, fechaVencimiento }
        : t
    );
    refresh();
    return true;
  };

  const toggleComplete = (id: string) => {
    tareasRef.current = tareasRef.current.map((t) =>
      t.id === id ? { ...t, completada: !t.completada } : t
    );
    refresh();
  };

  const getTaskById = (id: string) => tareasRef.current.find((t) => t.id === id);

  return (
    <TaskContext.Provider
      value={{
        tareas: tareasRef.current,
        addTask,
        deleteTask,
        editTask,
        toggleComplete,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};