import { TaskRepository } from '../repositories/task.repository';

export class SyncPendingTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<void> {
    await this.taskRepository.syncPendingTasks();
  }
}