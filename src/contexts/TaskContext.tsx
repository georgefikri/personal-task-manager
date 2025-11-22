import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task, TaskFilters } from '../types';
import { taskApi } from '../services/api';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  fetchTasks: () => Promise<void>;
  addTask: (todo: string, categoryId?: string) => Promise<void>;
  updateTask: (id: number, data: Partial<Pick<Task, 'todo' | 'completed'>>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  reorderTasks: (activeId: number, overId: number) => void;
  assignCategory: (taskId: number, categoryId: string | undefined) => void;
  filteredTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASK_CATEGORIES_KEY = 'taskCategories';
const TASK_ORDER_KEY = 'taskOrder';

const isLocalTask = (id: number): boolean => id > 150;

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    search: '',
    categoryId: null,
    sortBy: 'default',
  });

  const loadTaskCategories = (): Record<number, string> => {
    const saved = localStorage.getItem(TASK_CATEGORIES_KEY);
    return saved ? JSON.parse(saved) : {};
  };

  const saveTaskCategories = (categories: Record<number, string>) => {
    localStorage.setItem(TASK_CATEGORIES_KEY, JSON.stringify(categories));
  };

  const loadTaskOrder = (): number[] => {
    const saved = localStorage.getItem(TASK_ORDER_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const saveTaskOrder = (order: number[]) => {
    localStorage.setItem(TASK_ORDER_KEY, JSON.stringify(order));
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskApi.getAll(30);
      const taskCategories = loadTaskCategories();
      const taskOrder = loadTaskOrder();

      const fetchedTasks = response.todos.map(task => ({
        ...task,
        categoryId: taskCategories[task.id],
        createdAt: new Date().toISOString(),
      }));

      if (taskOrder.length > 0) {
        const orderMap = new Map(taskOrder.map((id, index) => [id, index]));
        const sortedTasks = [...fetchedTasks].sort((a, b) => {
          const orderA = orderMap.get(a.id) ?? Infinity;
          const orderB = orderMap.get(b.id) ?? Infinity;
          return orderA - orderB;
        });
        setTasks(sortedTasks);
      } else {
        setTasks(fetchedTasks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [fetchTasks]);

  const addTask = async (todo: string, categoryId?: string) => {
    setError(null);
    try {
      const newTask = await taskApi.create(todo);
      const taskWithMeta: Task = {
        ...newTask,
        categoryId,
        createdAt: new Date().toISOString(),
      };

      setTasks(prev => {
        const updated = [taskWithMeta, ...prev];
        saveTaskOrder(updated.map(t => t.id));
        return updated;
      });

      if (categoryId) {
        const categories = loadTaskCategories();
        categories[newTask.id] = categoryId;
        saveTaskCategories(categories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    }
  };

  const updateTask = async (id: number, data: Partial<Pick<Task, 'todo' | 'completed'>>) => {
    setError(null);
    try {
      if (!isLocalTask(id)) {
        await taskApi.update(id, data);
      }
      setTasks(prev => prev.map(task =>
        task.id === id ? { ...task, ...data } : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);
    try {
      if (!isLocalTask(id)) {
        await taskApi.delete(id);
      }
      setTasks(prev => {
        const updated = prev.filter(task => task.id !== id);
        saveTaskOrder(updated.map(t => t.id));
        return updated;
      });

      const categories = loadTaskCategories();
      delete categories[id];
      saveTaskCategories(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  const reorderTasks = (activeId: number, overId: number) => {
    setTasks(prev => {
      const oldIndex = prev.findIndex(t => t.id === activeId);
      const newIndex = prev.findIndex(t => t.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const updated = [...prev];
      const [removed] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, removed);

      saveTaskOrder(updated.map(t => t.id));
      return updated;
    });
  };

  const assignCategory = (taskId: number, categoryId: string | undefined) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, categoryId } : task
    ));

    const categories = loadTaskCategories();
    if (categoryId) {
      categories[taskId] = categoryId;
    } else {
      delete categories[taskId];
    }
    saveTaskCategories(categories);
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filters.status === 'active' && task.completed) return false;
      if (filters.status === 'completed' && !task.completed) return false;

      if (filters.search && !task.todo.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.categoryId && task.categoryId !== filters.categoryId) return false;

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.todo.localeCompare(b.todo);
        case 'status':
          return Number(a.completed) - Number(b.completed);
        case 'date':
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        default:
          return 0;
      }
    });

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      filters,
      setFilters,
      fetchTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      reorderTasks,
      assignCategory,
      filteredTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
