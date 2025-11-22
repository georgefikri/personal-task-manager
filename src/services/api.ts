import type { Task, ApiResponse } from '../types';

const BASE_URL = 'https://dummyjson.com';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const taskApi = {
  async getAll(limit = 30, skip = 0): Promise<ApiResponse<Task>> {
    const response = await fetch(`${BASE_URL}/todos?limit=${limit}&skip=${skip}`);
    return handleResponse<ApiResponse<Task>>(response);
  },

  async getById(id: number): Promise<Task> {
    const response = await fetch(`${BASE_URL}/todos/${id}`);
    return handleResponse<Task>(response);
  },

  async create(todo: string, userId = 1): Promise<Task> {
    const response = await fetch(`${BASE_URL}/todos/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo, completed: false, userId }),
    });
    return handleResponse<Task>(response);
  },

  async update(id: number, data: Partial<Pick<Task, 'todo' | 'completed'>>): Promise<Task> {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(response);
  },

  async delete(id: number): Promise<Task & { isDeleted: boolean; deletedOn: string }> {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<Task & { isDeleted: boolean; deletedOn: string }>(response);
  },
};
