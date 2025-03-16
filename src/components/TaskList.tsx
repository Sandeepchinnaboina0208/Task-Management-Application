import React from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { Task, supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onTasksUpdated: () => void;
}

export function TaskList({ tasks, onTasksUpdated }: TaskListProps) {
  const toggleTaskStatus = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !task.is_completed })
        .eq('id', task.id);

      if (error) throw error;
      onTasksUpdated();
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      onTasksUpdated();
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 text-gray-500"
      >
        No tasks yet. Start by adding a new task!
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={`card p-4 ${task.is_completed ? 'opacity-75' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-medium transition-all duration-200 ${
                  task.is_completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm text-gray-600 mt-1 transition-all duration-200 ${
                    task.is_completed ? 'line-through' : ''
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleTaskStatus(task)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    task.is_completed
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {task.is_completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}