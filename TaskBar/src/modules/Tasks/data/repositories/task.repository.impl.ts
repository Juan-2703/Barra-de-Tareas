import { auth } from '../../../../config/firebase/firebase';

import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskEntityImpl, TaskPriority } from '../../domain/entities/task.entity';

import { TaskLocalDataSource } from '../data-sources/local/task.local.ds';
import { TaskRemoteDataSource } from '../data-sources/remote/task.remote.ds';
import { TaskModel } from '../models/task.model';

export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    private localDataSource: TaskLocalDataSource,
    private remoteDataSource: TaskRemoteDataSource
  ) {}

  private getCurrentUserId(): string {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return userId;
  }

  async getTasks(): Promise<TaskEntityImpl[]> {
    try {
      const userId = this.getCurrentUserId();
      const tasks = await this.localDataSource.getTasks(userId);

      return tasks.map((task) => task.toEntity());
    } catch (error) {
      console.error('Error obteniendo tareas locales:', error);
      return [];
    }
  }

  async getTaskById(id: string): Promise<TaskEntityImpl | null> {
    try {
      const userId = this.getCurrentUserId();
      const task = await this.localDataSource.getTaskById(id, userId);

      if (!task || task.deleted) {
        return null;
      }

      return task.toEntity();
    } catch (error) {
      console.error(`Error obteniendo tarea ${id}:`, error);
      return null;
    }
  }

  async createTask(
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad: TaskPriority = 'media'
  ): Promise<TaskEntityImpl> {
    const userId = this.getCurrentUserId();
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const task = new TaskEntityImpl(
      id,
      titulo.trim(),
      descripcion.trim(),
      false,
      prioridad,
      new Date(),
      fechaVencimiento,
      userId,
      'pending',
      undefined,
      false
    );

    await this.localDataSource.saveTask(TaskModel.fromEntity(task));

    return task;
  }

  async updateTask(
    id: string,
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad: TaskPriority = 'media'
  ): Promise<TaskEntityImpl> {
    const userId = this.getCurrentUserId();
    const existing = await this.localDataSource.getTaskById(id, userId);

    if (!existing) {
      throw new Error('Tarea no encontrada');
    }

    const task = new TaskEntityImpl(
      existing.id,
      titulo.trim(),
      descripcion.trim(),
      existing.completada,
      prioridad,
      existing.fechaCreacion,
      fechaVencimiento ?? existing.fechaVencimiento,
      userId,
      'pending',
      existing.firebaseId,
      false
    );

    await this.localDataSource.updateTask(TaskModel.fromEntity(task));

    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const userId = this.getCurrentUserId();
    const task = await this.localDataSource.getTaskById(id, userId);

    if (!task) {
      return;
    }

    if (!task.firebaseId) {
      await this.localDataSource.deleteTask(id, userId);
      return;
    }

    await this.localDataSource.markTaskAsDeleted(id, userId);
  }

  async toggleComplete(id: string): Promise<TaskEntityImpl> {
    const userId = this.getCurrentUserId();
    const existing = await this.localDataSource.getTaskById(id, userId);

    if (!existing) {
      throw new Error(`Tarea ${id} no encontrada`);
    }

    const task = new TaskEntityImpl(
      existing.id,
      existing.titulo,
      existing.descripcion,
      !existing.completada,
      existing.prioridad,
      existing.fechaCreacion,
      existing.fechaVencimiento,
      userId,
      'pending',
      existing.firebaseId,
      false
    );

    await this.localDataSource.updateTask(TaskModel.fromEntity(task));

    return task;
  }

  listenToChanges(
    callback: (tasks: TaskEntityImpl[]) => void
  ): () => void {
    return this.remoteDataSource.listenTasks(async (remoteTasks) => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        return;
      }

      for (const remoteTask of remoteTasks) {
        try {
          const localTask = await this.localDataSource.getTaskById(
            remoteTask.id,
            userId
          );

          if (!localTask || localTask.syncStatus === 'synced') {
            await this.localDataSource.saveTask(remoteTask);
          }
        } catch (error) {
          console.warn('Error actualizando tarea remota:', error);
        }
      }

      try {
        const localTasks = await this.localDataSource.getTasks(userId);

        callback(
          localTasks.map((task) => task.toEntity())
        );
      } catch (error) {
        console.warn('Error leyendo tareas locales:', error);
      }
    });
  }

  async syncPendingTasks(): Promise<void> {
    const userId = this.getCurrentUserId();
    const pendingTasks = await this.localDataSource.getPendingTasks(userId);

    for (const task of pendingTasks) {
      try {
        if (task.deleted) {
          if (task.firebaseId) {
            await this.remoteDataSource.deleteTask(task.firebaseId);
          }

          await this.localDataSource.deleteTask(task.id, userId);
          continue;
        }

        const remoteTask = task.firebaseId
          ? await this.remoteDataSource.updateTask(task.toEntity())
          : await this.remoteDataSource.createTask(task.toEntity());

        await this.localDataSource.updateTask(remoteTask);
      } catch (error) {
        console.warn(`Error sincronizando tarea ${task.id}:`, error);

        const failedTask = new TaskEntityImpl(
          task.id,
          task.titulo,
          task.descripcion,
          task.completada,
          task.prioridad,
          task.fechaCreacion,
          task.fechaVencimiento,
          task.userId,
          'failed',
          task.firebaseId,
          task.deleted
        );

        await this.localDataSource.updateTask(
          TaskModel.fromEntity(failedTask)
        );
      }
    }
  }
}