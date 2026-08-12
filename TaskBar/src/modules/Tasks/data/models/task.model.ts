import {
  TaskEntityImpl,
  TaskPriority,
} from '../../domain/entities/task.entity';

import {
  TaskDtoRequest,
  TaskDtoResponse,
} from '../dtos/task.dto';

export class TaskModel {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly descripcion: string,
    public readonly completada: boolean,
    public readonly prioridad: TaskPriority,
    public readonly fechaCreacion: Date,
    public readonly fechaVencimiento?: Date,
    public readonly userId?: string,
    public readonly syncStatus?:
      | 'synced'
      | 'pending'
      | 'failed',
    public readonly firebaseId?: string,
    public readonly deleted: boolean = false
  ) {}

  static fromEntity(entity: TaskEntityImpl): TaskModel {
    return new TaskModel(
      entity.id,
      entity.titulo,
      entity.descripcion || '',
      entity.isCompleted(),
      entity.prioridad || 'media',
      entity.fechaCreacion,
      entity.fechaVencimiento,
      entity.userId,
      entity.syncStatus || 'synced',
      entity.firebaseId,
      entity.deleted
    );
  }

  static fromDTO(dto: TaskDtoResponse): TaskModel {
    return new TaskModel(
      dto.id,
      dto.titulo,
      dto.descripcion || '',
      Boolean(dto.completada),
      dto.prioridad || 'media',
      new Date(dto.fechaCreacion),
      dto.fechaVencimiento
        ? new Date(dto.fechaVencimiento)
        : undefined,
      dto.userId,
      dto.syncStatus || 'synced',
      dto.firebaseId,
      dto.deleted ?? false
    );
  }

  static fromDTOList(
    dtos: TaskDtoResponse[]
  ): TaskModel[] {
    return dtos.map((dto) =>
      TaskModel.fromDTO(dto)
    );
  }

  toEntity(): TaskEntityImpl {
    return new TaskEntityImpl(
      this.id,
      this.titulo,
      this.descripcion,
      this.completada,
      this.prioridad,
      this.fechaCreacion,
      this.fechaVencimiento,
      this.userId,
      this.syncStatus || 'synced',
      this.firebaseId,
      this.deleted
    );
  }

  toRequestDTO(): TaskDtoRequest {
    return {
      titulo: this.titulo,
      descripcion: this.descripcion,
      completada: this.completada,
      prioridad: this.prioridad,
      fechaCreacion:
        this.fechaCreacion.toISOString(),
      fechaVencimiento:
        this.fechaVencimiento?.toISOString(),
    };
  }

  toResponseDTO(): TaskDtoResponse {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      completada: this.completada,
      prioridad: this.prioridad,
      fechaCreacion:
        this.fechaCreacion.toISOString(),
      fechaVencimiento:
        this.fechaVencimiento?.toISOString(),
      userId: this.userId,
      syncStatus: this.syncStatus,
      firebaseId: this.firebaseId,
      deleted: this.deleted,
    };
  }
}