import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onTaskAdded: () => void;
}

export function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tasks')
        .insert([{ 
          title, 
          description,
          user_id: user.id
        }]);

      if (error) throw error;

      setTitle('');
      setDescription('');
      toast.success('Task created successfully!');
      onTaskAdded();
    } catch (error) {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card p-6"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="Enter task title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="form-label">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="Enter task description"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {isLoading ? 'Creating...' : 'Add Task'}
        </motion.button>
      </div>
    </motion.form>
  );
}