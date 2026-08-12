import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth } from '../../../../config/firebase/firebase';
import { TaskRepository } from '../repositories/task.repository';

const MOCK_TASKS = [
  {
    titulo: 'Revisar reportes del mes',
    descripcion: 'Revisar y validar todos los reportes de mantenimiento del mes anterior',
    prioridad: 'alta' as const,
  },
  {
    titulo: 'Programar visitas técnicas',
    descripcion: 'Coordinar visitas con los clientes para la próxima semana',
    prioridad: 'media' as const,
  },
  {
    titulo: 'Actualizar inventario',
    descripcion: 'Registrar herramientas y materiales utilizados en el mes',
    prioridad: 'baja' as const,
  },
];

export class MockTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<void> {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      const userId = currentUser.uid;
      const seedKey = `@taskbar_seed_done_${userId}`;

      const seedDone = await AsyncStorage.getItem(seedKey);

      if (seedDone === 'true') return;

      const existingTasks = await this.taskRepository.getTasks();

      if (existingTasks.length > 0) {
        await AsyncStorage.setItem(seedKey, 'true');
        return;
      }

      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 7);

      for (const mockTask of MOCK_TASKS) {
        await this.taskRepository.createTask(
          mockTask.titulo,
          mockTask.descripcion,
          fechaVencimiento,
          mockTask.prioridad
        );
      }

      await AsyncStorage.setItem(seedKey, 'true');
    } catch (error) {
      console.error('Error creando tareas de prueba:', error);
    }
  }
}