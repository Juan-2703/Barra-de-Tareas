import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  DocumentData,
} from 'firebase/firestore';

import { auth, firebaseDB } from '../../../../../config/firebase/firebase';
import { TaskEntityImpl, TaskPriority } from '../../../domain/entities/task.entity';
import { TaskModel } from '../../models/task.model';

export interface TaskRemoteDataSource {
  getTasks(): Promise<TaskModel[]>;
  createTask(task: TaskEntityImpl): Promise<TaskModel>;
  updateTask(task: TaskEntityImpl): Promise<TaskModel>;
  deleteTask(id: string): Promise<void>;
  listenTasks(callback: (tasks: TaskModel[]) => void): () => void;
}

export class TaskRemoteDataSourceImpl implements TaskRemoteDataSource {
  private get currentUser(): string | undefined {
    return auth.currentUser?.uid;
  }

  private getUserId(): string {
    const userId = this.currentUser;
    if (!userId) throw new Error('Usuario no autenticado');
    return userId;
  }

  private getTasksRef() {
    const userId = this.getUserId();
    return collection(firebaseDB, `users/${userId}/tasks`);
  }

  private cleanUndefined(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined)
    );
  }

  private toModel(id: string, data: DocumentData, userId: string): TaskModel {
    return TaskModel.fromDTO({
      id,
      titulo: data.titulo ?? '',
      descripcion: data.descripcion ?? '',
      completada: Boolean(data.completada),
      prioridad: (data.prioridad as TaskPriority) ?? 'media',
      fechaCreacion: data.fechaCreacion ?? new Date().toISOString(),
      fechaVencimiento: data.fechaVencimiento ?? undefined,
      userId,
      syncStatus: 'synced',
      firebaseId: id,
      deleted: false,
    });
  }

  private toSyncedModel(task: TaskEntityImpl, userId: string): TaskModel {
    return TaskModel.fromDTO({
      id: task.id,
      titulo: task.titulo,
      descripcion: task.descripcion,
      completada: task.completada,
      prioridad: task.prioridad,
      fechaCreacion: task.fechaCreacion.toISOString(),
      fechaVencimiento: task.fechaVencimiento?.toISOString(),
      userId,
      syncStatus: 'synced',
      firebaseId: task.id,
      deleted: false,
    });
  }

  private getFirebaseData(task: TaskEntityImpl, userId: string) {
    return this.cleanUndefined({
      titulo: task.titulo,
      descripcion: task.descripcion,
      completada: task.completada,
      prioridad: task.prioridad,
      fechaCreacion: task.fechaCreacion.toISOString(),
      fechaVencimiento: task.fechaVencimiento?.toISOString(),
      userId,
      updatedAt: new Date().toISOString(),
    });
  }

  async getTasks(): Promise<TaskModel[]> {
    const userId = this.getUserId();
    const tasksQuery = query(this.getTasksRef(), orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(tasksQuery);

    return snapshot.docs.map((document) =>
      this.toModel(document.id, document.data(), userId)
    );
  }

  async createTask(task: TaskEntityImpl): Promise<TaskModel> {
    const userId = this.getUserId();
    const taskRef = doc(firebaseDB, `users/${userId}/tasks`, task.id);

    await setDoc(taskRef, {
      ...this.getFirebaseData(task, userId),
      createdAt: new Date().toISOString(),
    });

    return this.toSyncedModel(task, userId);
  }

  async updateTask(task: TaskEntityImpl): Promise<TaskModel> {
    const userId = this.getUserId();
    const firebaseId = task.firebaseId ?? task.id;
    const taskRef = doc(firebaseDB, `users/${userId}/tasks`, firebaseId);

    await updateDoc(taskRef, this.getFirebaseData(task, userId));

    return TaskModel.fromDTO({
      id: task.id,
      titulo: task.titulo,
      descripcion: task.descripcion,
      completada: task.completada,
      prioridad: task.prioridad,
      fechaCreacion: task.fechaCreacion.toISOString(),
      fechaVencimiento: task.fechaVencimiento?.toISOString(),
      userId,
      syncStatus: 'synced',
      firebaseId,
      deleted: false,
    });
  }

  async deleteTask(id: string): Promise<void> {
    const userId = this.getUserId();
    const taskRef = doc(firebaseDB, `users/${userId}/tasks`, id);
    await deleteDoc(taskRef);
  }

  listenTasks(callback: (tasks: TaskModel[]) => void): () => void {
    const userId = this.currentUser;
    if (!userId) return () => {};

    const tasksQuery = query(this.getTasksRef(), orderBy('fechaCreacion', 'desc'));

    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks = snapshot.docs.map((document) =>
          this.toModel(document.id, document.data(), userId)
        );

        callback(tasks);
      },
      (error) => {
        console.error('Error en listenTasks:', error);
      }
    );
  }
}