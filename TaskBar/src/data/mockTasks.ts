import { Task } from '../types/Task';

export const mockTasks: Task[] = [
  {
    id: '1',
    titulo: 'Configurar la app Expo',
    descripcion: 'Terminar la app.',
    fechaVencimiento: new Date(2026, 6, 1),
    fechaCreacion: new Date(),
    completada: true, 
  },
  {
    id: '2',
    titulo: 'Entregar el Examen parcial',
    descripcion: 'Preguntar por requisitos de la app.',
    fechaCreacion: new Date(),
    completada: false,
  },
];