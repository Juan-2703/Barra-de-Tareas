import { TaskPriority } from '../../domain/entities/task.entity';

export interface TaskDtoRequest {
  titulo: string;
  descripcion: string;
  completada: boolean;
  prioridad: TaskPriority;
  fechaCreacion: string;
  fechaVencimiento?: string | null;
}

export interface TaskDtoResponse {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  prioridad: TaskPriority;
  fechaCreacion: string;
  fechaVencimiento?: string | null;
  userId?: string;
  syncStatus?: 'synced' | 'pending' | 'failed';
  firebaseId?: string;
  deleted?: boolean;
}