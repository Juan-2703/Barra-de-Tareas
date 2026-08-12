  import { TaskRepository } from '../repositories/task.repository';
  import { TaskEntityImpl } from '../entities/task.entity';

  export class GetTasksUseCase {
    constructor(private taskRepository: TaskRepository) {}

    async execute(): Promise<TaskEntityImpl[]> {
      return await this.taskRepository.getTasks();
    }
  }