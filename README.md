# Personal Task Manager

A modern, responsive Personal Task Manager built with React, TypeScript, and Tailwind CSS. Manage your daily tasks efficiently with drag-and-drop reordering, color-coded categories, and seamless dark/light theme support.

## Key Features

- **Task Management**: Add, edit, delete, and toggle completion status of tasks
- **API Integration**: Full CRUD operations via DummyJSON API
- **Drag & Drop**: Reorder tasks by dragging them to new positions
- **Categories**: Create and assign color-coded categories to tasks
- **Filtering & Search**: Filter by status (All/Active/Completed), search, and sort tasks
- **Theme Toggle**: Switch between dark and light modes with persistence
- **Responsive Design**: Mobile-first approach with support for all screen sizes
- **Error Handling**: React ErrorBoundary for rendering errors + graceful API error handling with loading states

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd 14-paymob
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Technology Stack

- **React 19** - UI library with functional components and hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **@dnd-kit** - Drag and drop toolkit for React
- **DummyJSON API** - Backend API for task CRUD operations

## Project Structure

```
src/
├── components/       # React components
│   ├── Header.tsx
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── TaskFilters.tsx
│   ├── AddTaskForm.tsx
│   ├── CategoryManager.tsx
│   ├── EmptyState.tsx
│   ├── TaskSkeleton.tsx
│   └── ErrorBoundary.tsx
├── contexts/         # React context providers
│   ├── ThemeContext.tsx
│   ├── TaskContext.tsx
│   └── CategoryContext.tsx
├── services/         # API service layer
│   └── api.ts
├── types/            # TypeScript types
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## API Endpoints Used

Base URL: `https://dummyjson.com`

- `GET /todos` - Fetch all tasks
- `GET /todos/{id}` - Fetch specific task
- `POST /todos/add` - Create new task
- `PUT /todos/{id}` - Update existing task
- `DELETE /todos/{id}` - Delete task
