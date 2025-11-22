import { ThemeProvider } from './contexts/ThemeContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { TaskProvider } from './contexts/TaskContext';
import { Header, TaskList, AddTaskForm, TaskFilters, CategoryManager, ErrorBoundary } from './components';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CategoryProvider>
          <TaskProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header />
              <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                <AddTaskForm />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <TaskFilters />
                  </div>
                  <CategoryManager />
                </div>

                <TaskList />
              </main>
            </div>
          </TaskProvider>
        </CategoryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
