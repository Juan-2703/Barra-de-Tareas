import { TaskEntityImpl, TaskPriority } from '../entities/task.entity';

export interface TaskRepository {
  getTasks(): Promise<TaskEntityImpl[]>;
  getTaskById(id: string): Promise<TaskEntityImpl | null>;
  createTask(
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad?: TaskPriority
  ): Promise<TaskEntityImpl>;
  updateTask(
    id: string,
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad?: TaskPriority
  ): Promise<TaskEntityImpl>;
  deleteTask(id: string): Promise<void>;
  toggleComplete(id: string): Promise<TaskEntityImpl>;
  listenToChanges(callback: (tasks: TaskEntityImpl[]) => void): () => void;
  syncPendingTasks(): Promise<void>;
}