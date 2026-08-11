import * as SQLite from 'expo-sqlite';

import {
  TaskLocalDataSource,
  TaskLocalDataSourceImpl,
} from '../data/data-sources/local/task.local.ds';

import {
  TaskRemoteDataSource,
  TaskRemoteDataSourceImpl,
} from '../data/data-sources/remote/task.remote.ds';

import { TaskRepositoryImpl } from '../data/repositories/task.repository.impl';

import { CreateTaskUseCase } from '../domain/use-cases/createTask.use-case';
import { DeleteTaskUseCase } from '../domain/use-cases/deleteTask.use-case';
import { GetTasksUseCase } from '../domain/use-cases/getTasks.use-case';
import { UpdateTaskUseCase } from '../domain/use-cases/updateTask.use-case';
import { ToggleCompleteUseCase } from '../domain/use-cases/toggleComplete.use-case';
import { MockTasksUseCase } from '../domain/use-cases/mockTasks.use-case';
import { SyncPendingTasksUseCase } from '../domain/use-cases/syncPendingTasks.use-case';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let dependenciesInstance: ReturnType<typeof createDependencies> | null = null;

const getDB = (): SQLite.SQLiteDatabase => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = SQLite.openDatabaseSync('taskbar.db');

  dbInstance.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      completada INTEGER DEFAULT 0,
      prioridad TEXT DEFAULT 'media',
      fechaCreacion TEXT NOT NULL,
      fechaVencimiento TEXT,
      userId TEXT,
      syncStatus TEXT DEFAULT 'synced',
      firebaseId TEXT,
      deleted INTEGER DEFAULT 0
    );
  `);

  const columns = dbInstance.getAllSync<{ name: string }>(
    'PRAGMA table_info(tasks);'
  );

  const hasDeletedColumn = columns.some(
    (column) => column.name === 'deleted'
  );

  if (!hasDeletedColumn) {
    dbInstance.execSync(`
      ALTER TABLE tasks
      ADD COLUMN deleted INTEGER DEFAULT 0;
    `);
  }

  return dbInstance;
};

const createDependencies = () => {
  const db = getDB();

  const localDataSource: TaskLocalDataSource =
    new TaskLocalDataSourceImpl(db);

  const remoteDataSource: TaskRemoteDataSource =
    new TaskRemoteDataSourceImpl();

  const repository = new TaskRepositoryImpl(
    localDataSource,
    remoteDataSource
  );

  return {
    repository,
    getTasksUseCase: new GetTasksUseCase(repository),
    createTaskUseCase: new CreateTaskUseCase(repository),
    updateTaskUseCase: new UpdateTaskUseCase(repository),
    deleteTaskUseCase: new DeleteTaskUseCase(repository),
    toggleCompleteUseCase: new ToggleCompleteUseCase(repository),
    mockTasksUseCase: new MockTasksUseCase(repository),
    syncPendingTasksUseCase: new SyncPendingTasksUseCase(repository),
  };
};

export const getTasksDependencies = () => {
  if (!dependenciesInstance) {
    dependenciesInstance = createDependencies();
  }

  return dependenciesInstance;
};

export const resetDatabase = (): void => {};