import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GoalsPanel({ goals, onToggleGoal, onAddGoal, onDeleteGoal }) {
  const [newGoal, setNewGoal] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal);
      setNewGoal('');
    }
  };

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <div key={goal.id} className="group flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button onClick={() => onToggleGoal(goal.id)} className="flex-shrink-0">
               {goal.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-white/30" />}
            </button>
            <span className={`text-sm truncate ${goal.completed ? 'text-white/30 line-through' : 'text-white/80'}`}>
              {goal.text}
            </span>
          </div>
          <button onClick={() => onDeleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      <form onSubmit={handleAdd} className="flex gap-2 mt-2">
        <Input 
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Nuevo objetivo..."
          className="h-8 bg-[#0f0f0f] border-white/10 text-white text-xs"
        />
        <Button type="submit" size="sm" className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20">
          <Plus className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}