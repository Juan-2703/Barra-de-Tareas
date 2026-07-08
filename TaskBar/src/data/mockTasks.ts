import { Task } from '../types/Task';

export const mockTasks: Task[] = [
  {
    id: '1',
    titulo: 'Configurar la app Expo',
    descripcion: 'Terminar la app.',
    fechaVencimiento: new Date(2026, 6, 9),
    fechaCreacion: new Date(),
    completada: true, 
  },
  {
    id: '2',
    titulo: 'Entrega del Examen parcial',
    descripcion: 'Explicar el uso de la App.',
    fechaVencimiento: new Date(2026, 6, 9),
    fechaCreacion: new Date(),
    completada: false,
  },
  {
    id: '3',
    titulo: 'Fin de los Examenes',
    descripcion: 'Descanso.',
    fechaVencimiento: new Date(2026, 6, 20),
    fechaCreacion: new Date(),
    completada: false, 
  },
];
