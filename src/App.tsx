import React, { useEffect, useState } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Auth } from './components/Auth';
import { Task, supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { ClipboardList, LogOut } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      } else {
        setTasks([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return <Auth onAuthSuccess={() => setLoading(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
        
        <div className="space-y-8">
          <TaskForm onTaskAdded={fetchTasks} />
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onTasksUpdated={fetchTasks} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;