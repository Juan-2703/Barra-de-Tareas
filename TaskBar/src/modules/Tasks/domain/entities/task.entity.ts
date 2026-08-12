export type TaskPriority = 'baja' | 'media' | 'alta';

export interface TaskEntity {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  prioridad: TaskPriority;
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  userId?: string;

  syncStatus?: 'synced' | 'pending' | 'failed';

  firebaseId?: string;

  deleted?: boolean;
}

export class TaskEntityImpl implements TaskEntity {
  constructor(
    public id: string,
    public titulo: string,
    public descripcion: string = '',
    public completada: boolean = false,
    public prioridad: TaskPriority = 'media',
    public fechaCreacion: Date = new Date(),
    public fechaVencimiento?: Date,
    public userId?: string,
    public syncStatus: 'synced' | 'pending' | 'failed' = 'synced',
    public firebaseId?: string,
    public deleted: boolean = false
  ) {}

  toMap(): Record<string, any> {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      completada: this.completada,
      prioridad: this.prioridad,
      fechaCreacion: this.fechaCreacion.toISOString(),
      fechaVencimiento:
        this.fechaVencimiento?.toISOString() || null,
      userId: this.userId,
      syncStatus: this.syncStatus,
      firebaseId: this.firebaseId,
      deleted: this.deleted,
    };
  }

  toggleComplete(): TaskEntityImpl {
    return new TaskEntityImpl(
      this.id,
      this.titulo,
      this.descripcion,
      !this.completada,
      this.prioridad,
      this.fechaCreacion,
      this.fechaVencimiento,
      this.userId,
      'pending',
      this.firebaseId,
      this.deleted
    );
  }

  getPriorityColor(): string {
    switch (this.prioridad) {
      case 'alta':
        return '#e74c3c';

      case 'media':
        return '#f39c12';

      case 'baja':
        return '#2ecc71';

      default:
        return '#95a5a6';
    }
  }

  getPriorityLabel(): string {
    switch (this.prioridad) {
      case 'alta':
        return 'Alta';

      case 'media':
        return 'Media';

      case 'baja':
        return 'Baja';

      default:
        return 'Media';
    }
  }

  isCompleted(): boolean {
    return Boolean(this.completada);
  }
}