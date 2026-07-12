import { Task } from '../types/Task';

export const mockTasks: Task[] = [
  {
    id: '1',
    titulo: 'Configurar la app Expo',
    descripcion: 'Terminar la app.',
    fechaVencimiento: new Date(2026, 6, 11),
    fechaCreacion: new Date(),
    completada: true, 
  },
  {
    id: '2',
    titulo: 'Entrega del Examen parcial',
    descripcion: 'Explicar el uso de la App.',
    fechaVencimiento: new Date(2026, 6, 11),
    fechaCreacion: new Date(),
    completada: false,
  },
  {
    id: '3',
    titulo: 'Fin de los Examenes',
    descripcion: 'Descanso.',
    fechaVencimiento: new Date(2026, 6, 12),
    fechaCreacion: new Date(),
    completada: false, 
  },
   {
    id: '4',
    titulo: 'Tarea con descripción muy larga',
    descripcion: 'Esta es una tarea de prueba con una descripción extremadamente larga para verificar que el CustomAlert con ScrollView funciona correctamente. Vamos a escribir un texto muy extenso para asegurarnos de que el scroll funcione bien y que el usuario pueda leer toda la información sin que la alerta se salga de la pantalla. Esta descripción debería ser lo suficientemente larga como para que el ScrollView se active y permita desplazarse hacia abajo para ver el texto completo. Si todo funciona bien, esta tarea de prueba confirmará que la solución de scroll es robusta y funcional.',
    fechaVencimiento: new Date(2026, 7, 13),
    fechaCreacion: new Date(),
    completada: false,
  },
];
