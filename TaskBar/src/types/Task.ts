export interface Task {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaVencimiento?: Date;
  fechaCreacion: Date;
  completada: boolean;
}