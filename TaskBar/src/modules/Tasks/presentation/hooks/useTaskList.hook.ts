import { useMemo, useState } from 'react';
import { useTasks } from '../../../../core/contexts/TaskContext';
import {
  TaskEntityImpl,
  TaskPriority,
} from '../../domain/entities/task.entity';

export type FilterPriority = TaskPriority | 'todas';
export type FilterStatus = 'todas' | 'pendientes' | 'completadas';

export const useTaskList = () => {
  const {
    tasks,
    isLoading,
    loadTasks,
  } = useTasks();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filterPriority, setFilterPriority] =
    useState<FilterPriority>('todas');
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>('todas');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: TaskEntityImpl) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        task.titulo.toLowerCase().includes(query) ||
        task.descripcion?.toLowerCase().includes(query);

      const matchesPriority =
        filterPriority === 'todas' ||
        task.prioridad === filterPriority;

      const matchesStatus =
        filterStatus === 'todas' ||
        (filterStatus === 'pendientes' && !task.isCompleted()) ||
        (filterStatus === 'completadas' && task.isCompleted());

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    });
  }, [
    tasks,
    searchQuery,
    filterPriority,
    filterStatus,
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await loadTasks();
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible((previous) => {
      if (previous) {
        setSearchQuery('');
      }

      return !previous;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(false);
  };

  const activeFilterCount =
    (filterPriority !== 'todas' ? 1 : 0) +
    (filterStatus !== 'todas' ? 1 : 0);

  return {
    tasks,
    filteredTasks,
    isLoading,
    refreshing,
    searchQuery,
    isSearchVisible,
    filterPriority,
    filterStatus,
    activeFilterCount,
    setSearchQuery,
    setFilterPriority,
    setFilterStatus,
    handleRefresh,
    toggleSearch,
    clearSearch,
  };
};