import { useState } from 'react';
import { useCategories } from '../contexts/CategoryContext';
import { CATEGORY_COLORS } from '../types';

export function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0].value);

  const handleAdd = () => {
    if (name.trim()) {
      addCategory(name.trim(), color);
      setName('');
      setColor(CATEGORY_COLORS[0].value);
      setIsAdding(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (name.trim()) {
      updateCategory(id, name.trim(), color);
      setEditingId(null);
      setName('');
    }
  };

  const startEdit = (id: string, currentName: string, currentColor: string) => {
    setEditingId(id);
    setName(currentName);
    setColor(currentColor);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setName('');
    setColor(CATEGORY_COLORS[0].value);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Manage Categories
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Categories</h3>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  {editingId === cat.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-1">
                        {CATEGORY_COLORS.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => setColor(c.value)}
                            className={`w-6 h-6 rounded-full ${color === c.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                            style={{ backgroundColor: c.value }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(cat.id)}
                          className="flex-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-gray-900 dark:text-white text-sm">{cat.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(cat.id, cat.name, cat.color)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              {isAdding ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-1">
                    {CATEGORY_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`w-6 h-6 rounded-full ${color === c.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                        style={{ backgroundColor: c.value }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAdd}
                      disabled={!name.trim()}
                      className="flex-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 disabled:bg-primary-300 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Category
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
