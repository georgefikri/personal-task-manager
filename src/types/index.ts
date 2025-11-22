export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  categoryId?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface ApiResponse<T> {
  todos: T[];
  total: number;
  skip: number;
  limit: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';
export type SortOption = 'default' | 'name' | 'date' | 'status';

export interface TaskFilters {
  status: FilterStatus;
  search: string;
  categoryId: string | null;
  sortBy: SortOption;
}

export const CATEGORY_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
] as const;
