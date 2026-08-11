import { TaskRepository } from '../repositories/task.repository';
import { TaskEntityImpl } from '../entities/task.entity';

export class ToggleCompleteUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<TaskEntityImpl> {
    if (!id) {
      throw new Error('ID de tarea es obligatorio');
    }
    return await this.taskRepository.toggleComplete(id);
  }
}