import { useTasks } from '../contexts/TaskContext';
import { useCategories } from '../contexts/CategoryContext';
import type { FilterStatus, SortOption } from '../types';

export function TaskFilters() {
  const { filters, setFilters, tasks, filteredTasks } = useTasks();
  const { categories } = useCategories();

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const handleStatusChange = (status: FilterStatus) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleSortChange = (sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {filters.search && (
          <button
            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusChange('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filters.status === 'all'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => handleStatusChange('active')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filters.status === 'active'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => handleStatusChange('completed')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filters.status === 'completed'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Category and Sort Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.categoryId || ''}
          onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value || null }))}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="default">Sort: Default</option>
          <option value="name">Sort: Name</option>
          <option value="status">Sort: Status</option>
          <option value="date">Sort: Date</option>
        </select>

        {filteredTasks.length !== tasks.length && (
          <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
        )}
      </div>
    </div>
  );
}
