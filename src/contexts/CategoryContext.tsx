import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Category } from '../types';

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string | undefined) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Personal', color: '#3b82f6' },
  { id: '2', name: 'Work', color: '#22c55e' },
  { id: '3', name: 'Shopping', color: '#f97316' },
];

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, name: string, color: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, name, color } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const getCategoryById = (id: string | undefined) => {
    if (!id) return undefined;
    return categories.find(cat => cat.id === id);
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, getCategoryById }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within CategoryProvider');
  return context;
}
