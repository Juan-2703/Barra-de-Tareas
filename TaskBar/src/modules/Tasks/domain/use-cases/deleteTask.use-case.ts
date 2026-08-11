import { TaskRepository } from '../repositories/task.repository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID de tarea es obligatorio');
    }
    await this.taskRepository.deleteTask(id);
  }
}