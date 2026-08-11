import { TaskRepository } from '../repositories/task.repository';
import { TaskEntityImpl, TaskPriority } from '../entities/task.entity';

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    id: string,
    titulo: string,
    descripcion: string,
    fechaVencimiento?: Date,
    prioridad: TaskPriority = 'media'
  ): Promise<TaskEntityImpl> {
    if (!titulo.trim()) {
      throw new Error('El título es obligatorio');
    }
    return await this.taskRepository.updateTask(id, titulo, descripcion, fechaVencimiento, prioridad);
  }
}