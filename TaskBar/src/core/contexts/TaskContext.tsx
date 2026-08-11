import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import NetInfo from '@react-native-community/netinfo';

import {
  TaskEntityImpl,
  TaskPriority,
} from '../../modules/Tasks/domain/entities/task.entity';

import { getTasksDependencies } from '../../modules/Tasks/di/tasks.dependencies';
import { useUser } from './UserContext';

interface TaskContextType {
  tasks: TaskEntityImpl[];
  isLoading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<TaskEntityImpl[]>>;
  loadTasks: () => Promise<void>;
  addTask: (
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad?: TaskPriority
  ) => Promise<void>;
  updateTask: (
    id: string,
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad?: TaskPriority
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  getTaskById: (id: string) => TaskEntityImpl | undefined;
  syncPendingTasks: () => Promise<void>;
}

const TaskContext =
  createContext<TaskContextType | undefined>(
    undefined
  );

const sortTasks = (
  tasks: TaskEntityImpl[]
): TaskEntityImpl[] => {
  return [...tasks].sort(
    (a, b) =>
      b.fechaCreacion.getTime() -
      a.fechaCreacion.getTime()
  );
};

export const TaskProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const {
    user,
    isNewUser,
    clearNewUser,
  } = useUser();

  const dependencies =
    useRef(getTasksDependencies()).current;

  const [tasks, setTasks] =
    useState<TaskEntityImpl[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const syncInProgress = useRef(false);
  const syncRequested = useRef(false);
  const onlineRef = useRef(false);

  const currentUserIdRef =
    useRef<string | null>(
      user?.uid ?? null
    );

  useEffect(() => {
    currentUserIdRef.current =
      user?.uid ?? null;

    if (!user?.uid) {
      syncRequested.current = false;
      setTasks([]);
      setIsLoading(false);
    }
  }, [user?.uid]);

  const refreshLocalTasks =
    useCallback(async () => {
      const currentUserId =
        currentUserIdRef.current;

      if (!currentUserId) return;

      try {
        const localTasks =
          await dependencies
            .getTasksUseCase
            .execute();

        if (
          currentUserIdRef.current !==
          currentUserId
        ) {
          return;
        }

        setTasks(
          sortTasks(localTasks)
        );
      } catch (error: any) {
        if (
          currentUserIdRef.current !==
            currentUserId ||
          error?.message ===
            'Usuario no autenticado'
        ) {
          return;
        }

        console.error(
          'Error leyendo tareas locales:',
          error
        );
      }
    }, [dependencies]);

  const loadTasks =
    useCallback(async (): Promise<void> => {
      const currentUserId =
        currentUserIdRef.current;

      if (!currentUserId) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        await refreshLocalTasks();
      } catch (error: any) {
        if (
          currentUserIdRef.current !==
            currentUserId ||
          error?.message ===
            'Usuario no autenticado'
        ) {
          return;
        }

        console.error(
          'Error cargando tareas:',
          error
        );
      } finally {
        if (
          currentUserIdRef.current ===
          currentUserId
        ) {
          setIsLoading(false);
        }
      }
    }, [refreshLocalTasks]);

  const syncPendingTasks =
    useCallback(async (): Promise<void> => {
      const syncUserId =
        currentUserIdRef.current;

      if (
        !syncUserId ||
        !onlineRef.current
      ) {
        return;
      }

      if (syncInProgress.current) {
        syncRequested.current = true;
        return;
      }

      syncInProgress.current = true;

      try {
        do {
          syncRequested.current = false;

          if (
            currentUserIdRef.current !==
            syncUserId
          ) {
            return;
          }

          await dependencies
            .syncPendingTasksUseCase
            .execute();

          if (
            currentUserIdRef.current !==
            syncUserId
          ) {
            return;
          }

          await refreshLocalTasks();
        } while (
          syncRequested.current &&
          onlineRef.current &&
          currentUserIdRef.current ===
            syncUserId
        );
      } catch (error: any) {
        if (
          currentUserIdRef.current !==
            syncUserId ||
          error?.message ===
            'Usuario no autenticado'
        ) {
          return;
        }

        console.error(
          'Error sincronizando tareas:',
          error
        );

        if (
          currentUserIdRef.current ===
          syncUserId
        ) {
          await refreshLocalTasks();
        }
      } finally {
        syncInProgress.current = false;
      }
    }, [
      dependencies,
      refreshLocalTasks,
    ]);

  const requestSync =
    useCallback(() => {
      if (
        onlineRef.current &&
        currentUserIdRef.current
      ) {
        void syncPendingTasks();
      }
    }, [syncPendingTasks]);

  const initializeTasks =
    useCallback(async (): Promise<void> => {
      const initUserId =
        currentUserIdRef.current;

      if (!initUserId) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        let localTasks =
          await dependencies
            .getTasksUseCase
            .execute();

        if (
          currentUserIdRef.current !==
          initUserId
        ) {
          return;
        }

        if (
          isNewUser &&
          localTasks.length === 0
        ) {
          await dependencies
            .mockTasksUseCase
            .execute();

          if (
            currentUserIdRef.current !==
            initUserId
          ) {
            return;
          }

          localTasks =
            await dependencies
              .getTasksUseCase
              .execute();

          if (
            currentUserIdRef.current !==
            initUserId
          ) {
            return;
          }

          clearNewUser();
        }

        setTasks(
          sortTasks(localTasks)
        );

        requestSync();
      } catch (error: any) {
        if (
          currentUserIdRef.current !==
            initUserId ||
          error?.message ===
            'Usuario no autenticado'
        ) {
          return;
        }

        console.error(
          'Error inicializando tareas:',
          error
        );
      } finally {
        if (
          currentUserIdRef.current ===
          initUserId
        ) {
          setIsLoading(false);
        }
      }
    }, [
      isNewUser,
      clearNewUser,
      dependencies,
      requestSync,
    ]);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    void initializeTasks();
  }, [
    user?.uid,
    initializeTasks,
  ]);

  useEffect(() => {
    if (!user?.uid) return;

    const listenerUserId =
      user.uid;

    const unsubscribe =
      dependencies.repository
        .listenToChanges(() => {
          if (
            currentUserIdRef.current !==
            listenerUserId
          ) {
            return;
          }

          void refreshLocalTasks();
        });

    return unsubscribe;
  }, [
    user?.uid,
    dependencies,
    refreshLocalTasks,
  ]);

  useEffect(() => {
    let mounted = true;

    const updateNetworkState = (
      state: Awaited<
        ReturnType<typeof NetInfo.fetch>
      >
    ) => {
      if (!mounted) return;

      const hasInternet =
        state.isConnected === true &&
        state.isInternetReachable !== false;

      const wasOffline =
        !onlineRef.current;

      onlineRef.current =
        hasInternet;

      if (
        hasInternet &&
        wasOffline &&
        currentUserIdRef.current
      ) {
        void syncPendingTasks();
      }
    };

    void NetInfo
      .fetch()
      .then(updateNetworkState);

    const unsubscribe =
      NetInfo.addEventListener(
        updateNetworkState
      );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [syncPendingTasks]);

  const addTask = async (
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad: TaskPriority = 'media'
  ): Promise<void> => {
    const actionUserId =
      currentUserIdRef.current;

    if (!actionUserId) return;

    try {
      const createdTask =
        await dependencies
          .createTaskUseCase
          .execute(
            titulo,
            descripcion,
            fechaVencimiento,
            prioridad
          );

      if (
        currentUserIdRef.current !==
        actionUserId
      ) {
        return;
      }

      setTasks((current) =>
        sortTasks([
          createdTask,
          ...current.filter(
            (task) =>
              task.id !==
              createdTask.id
          ),
        ])
      );

      requestSync();
    } catch (error: any) {
      if (
        currentUserIdRef.current !==
          actionUserId ||
        error?.message ===
          'Usuario no autenticado'
      ) {
        return;
      }

      console.error(
        'Error creando tarea:',
        error
      );

      throw error;
    }
  };

  const updateTask = async (
    id: string,
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad: TaskPriority = 'media'
  ): Promise<void> => {
    const actionUserId =
      currentUserIdRef.current;

    if (!actionUserId) return;

    const previousTask =
      tasks.find(
        (task) => task.id === id
      );

    if (!previousTask) return;

    const optimisticTask =
      new TaskEntityImpl(
        previousTask.id,
        titulo.trim(),
        descripcion.trim(),
        previousTask.completada,
        prioridad,
        previousTask.fechaCreacion,
        fechaVencimiento ??
          previousTask.fechaVencimiento,
        previousTask.userId,
        'pending',
        previousTask.firebaseId,
        false
      );

    setTasks((current) =>
      sortTasks(
        current.map((task) =>
          task.id === id
            ? optimisticTask
            : task
        )
      )
    );

    try {
      const updatedTask =
        await dependencies
          .updateTaskUseCase
          .execute(
            id,
            titulo,
            descripcion,
            fechaVencimiento,
            prioridad
          );

      if (
        currentUserIdRef.current !==
        actionUserId
      ) {
        return;
      }

      setTasks((current) =>
        sortTasks(
          current.map((task) =>
            task.id === id
              ? updatedTask
              : task
          )
        )
      );

      requestSync();
    } catch (error: any) {
      if (
        currentUserIdRef.current !==
          actionUserId ||
        error?.message ===
          'Usuario no autenticado'
      ) {
        return;
      }

      setTasks((current) =>
        sortTasks(
          current.map((task) =>
            task.id === id
              ? previousTask
              : task
          )
        )
      );

      console.error(
        'Error actualizando tarea:',
        error
      );

      throw error;
    }
  };

  const deleteTask = async (
    id: string
  ): Promise<void> => {
    const actionUserId =
      currentUserIdRef.current;

    if (!actionUserId) return;

    const previousTasks =
      tasks;

    setTasks((current) =>
      current.filter(
        (task) =>
          task.id !== id
      )
    );

    try {
      await dependencies
        .deleteTaskUseCase
        .execute(id);

      if (
        currentUserIdRef.current !==
        actionUserId
      ) {
        return;
      }

      requestSync();
    } catch (error: any) {
      if (
        currentUserIdRef.current !==
          actionUserId ||
        error?.message ===
          'Usuario no autenticado'
      ) {
        return;
      }

      setTasks(previousTasks);

      console.error(
        'Error eliminando tarea:',
        error
      );

      throw error;
    }
  };

  const toggleComplete = async (
    id: string
  ): Promise<void> => {
    const actionUserId =
      currentUserIdRef.current;

    if (!actionUserId) return;

    const previousTask =
      tasks.find(
        (task) => task.id === id
      );

    if (!previousTask) return;

    const optimisticTask =
      new TaskEntityImpl(
        previousTask.id,
        previousTask.titulo,
        previousTask.descripcion,
        !previousTask.completada,
        previousTask.prioridad,
        previousTask.fechaCreacion,
        previousTask.fechaVencimiento,
        previousTask.userId,
        'pending',
        previousTask.firebaseId,
        previousTask.deleted
      );

    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? optimisticTask
          : task
      )
    );

    try {
      const updatedTask =
        await dependencies
          .toggleCompleteUseCase
          .execute(id);

      if (
        currentUserIdRef.current !==
        actionUserId
      ) {
        return;
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === id
            ? updatedTask
            : task
        )
      );

      requestSync();
    } catch (error: any) {
      if (
        currentUserIdRef.current !==
          actionUserId ||
        error?.message ===
          'Usuario no autenticado'
      ) {
        return;
      }

      setTasks((current) =>
        current.map((task) =>
          task.id === id
            ? previousTask
            : task
        )
      );

      console.error(
        'Error cambiando estado:',
        error
      );

      throw error;
    }
  };

  const getTaskById = (
    id: string
  ): TaskEntityImpl | undefined => {
    return tasks.find(
      (task) =>
        task.id === id
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        setTasks,
        loadTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        getTaskById,
        syncPendingTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks =
  (): TaskContextType => {
    const context =
      useContext(TaskContext);

    if (!context) {
      throw new Error(
        'useTasks debe usarse dentro de TaskProvider'
      );
    }

    return context;
  };