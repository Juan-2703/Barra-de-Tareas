import { SQLiteDatabase } from 'expo-sqlite';

import { TaskModel } from '../../models/task.model';
import { TaskPriority } from '../../../domain/entities/task.entity';

type SyncStatus = 'synced' | 'pending' | 'failed';

interface TaskRow {
  id: string;
  titulo: string;
  descripcion: string | null;
  completada: number;
  prioridad: string | null;
  fechaCreacion: string;
  fechaVencimiento: string | null;
  userId: string | null;
  syncStatus: string | null;
  firebaseId: string | null;
  deleted: number;
}

export interface TaskLocalDataSource {
  getTasks(userId: string): Promise<TaskModel[]>;
  getTaskById(id: string, userId: string): Promise<TaskModel | null>;
  saveTask(task: TaskModel): Promise<void>;
  updateTask(task: TaskModel): Promise<void>;
  deleteTask(id: string, userId: string): Promise<void>;
  markTaskAsDeleted(id: string, userId: string): Promise<void>;
  getPendingTasks(userId: string): Promise<TaskModel[]>;
}

export class TaskLocalDataSourceImpl implements TaskLocalDataSource {
  constructor(private db: SQLiteDatabase) {}

  private toModel(row: TaskRow): TaskModel {
    return TaskModel.fromDTO({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion ?? '',
      completada: row.completada === 1,
      prioridad: (row.prioridad as TaskPriority) ?? 'media',
      fechaCreacion: row.fechaCreacion,
      fechaVencimiento: row.fechaVencimiento ?? undefined,
      userId: row.userId ?? undefined,
      syncStatus: (row.syncStatus as SyncStatus) ?? 'synced',
      firebaseId: row.firebaseId ?? undefined,
      deleted: row.deleted === 1,
    });
  }

  async getTasks(userId: string): Promise<TaskModel[]> {
    try {
      const rows = await this.db.getAllAsync<TaskRow>(
        `
        SELECT *
        FROM tasks
        WHERE userId = ?
          AND deleted = 0
        ORDER BY fechaCreacion DESC
        `,
        userId
      );

      return rows.map((row) => this.toModel(row));
    } catch (error) {
      console.error('Error en getTasks SQLite:', error);
      return [];
    }
  }

  async getTaskById(id: string, userId: string): Promise<TaskModel | null> {
    try {
      const row = await this.db.getFirstAsync<TaskRow>(
        `
        SELECT *
        FROM tasks
        WHERE id = ?
          AND userId = ?
        `,
        id,
        userId
      );

      return row ? this.toModel(row) : null;
    } catch (error) {
      console.error(`Error en getTaskById ${id}:`, error);
      return null;
    }
  }

  async saveTask(task: TaskModel): Promise<void> {
    try {
      const dto = task.toResponseDTO();

      await this.db.runAsync(
        `
        INSERT OR REPLACE INTO tasks (
          id,
          titulo,
          descripcion,
          completada,
          prioridad,
          fechaCreacion,
          fechaVencimiento,
          userId,
          syncStatus,
          firebaseId,
          deleted
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        dto.id,
        dto.titulo,
        dto.descripcion ?? '',
        dto.completada ? 1 : 0,
        dto.prioridad ?? 'media',
        dto.fechaCreacion,
        dto.fechaVencimiento ?? null,
        dto.userId ?? null,
        dto.syncStatus ?? 'synced',
        dto.firebaseId ?? null,
        dto.deleted ? 1 : 0
      );
    } catch (error) {
      console.error('Error en saveTask SQLite:', error);
      throw error;
    }
  }

  async updateTask(task: TaskModel): Promise<void> {
    try {
      const dto = task.toResponseDTO();

      await this.db.runAsync(
        `
        UPDATE tasks
        SET
          titulo = ?,
          descripcion = ?,
          completada = ?,
          prioridad = ?,
          fechaVencimiento = ?,
          userId = ?,
          syncStatus = ?,
          firebaseId = ?,
          deleted = ?
        WHERE id = ?
        `,
        dto.titulo,
        dto.descripcion ?? '',
        dto.completada ? 1 : 0,
        dto.prioridad ?? 'media',
        dto.fechaVencimiento ?? null,
        dto.userId ?? null,
        dto.syncStatus ?? 'synced',
        dto.firebaseId ?? null,
        dto.deleted ? 1 : 0,
        dto.id
      );
    } catch (error) {
      console.error(`Error en updateTask ${task.id}:`, error);
      throw error;
    }
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    try {
      await this.db.runAsync(
        `
        DELETE FROM tasks
        WHERE id = ?
          AND userId = ?
        `,
        id,
        userId
      );
    } catch (error) {
      console.error(`Error eliminando tarea ${id}:`, error);
      throw error;
    }
  }

  async markTaskAsDeleted(id: string, userId: string): Promise<void> {
    try {
      await this.db.runAsync(
        `
        UPDATE tasks
        SET
          deleted = 1,
          syncStatus = 'pending'
        WHERE id = ?
          AND userId = ?
        `,
        id,
        userId
      );
    } catch (error) {
      console.error(`Error marcando tarea como eliminada ${id}:`, error);
      throw error;
    }
  }

  async getPendingTasks(userId: string): Promise<TaskModel[]> {
    try {
      const rows = await this.db.getAllAsync<TaskRow>(
        `
        SELECT *
        FROM tasks
        WHERE userId = ?
          AND syncStatus IN ('pending', 'failed')
        ORDER BY fechaCreacion ASC
        `,
        userId
      );

      return rows.map((row) => this.toModel(row));
    } catch (error) {
      console.error('Error en getPendingTasks:', error);
      return [];
    }
  }
}