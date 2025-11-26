import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Flame, GripVertical, Plus, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const categoryConfig = {
  'Trabajo Extra': {
    icon: Briefcase,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    accent: 'text-blue-400',
    border: 'border-blue-500/30',
    inputBorder: 'focus:border-blue-500',
  },
  'Sexualidad': {
    icon: Flame,
    gradient: 'from-red-500/20 to-rose-500/20',
    accent: 'text-red-400',
    border: 'border-red-500/30',
    inputBorder: 'focus:border-red-500',
  },
};

export default function FloatingList({ category, tasks, onAddTask }) {
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const config = categoryConfig[category] || categoryConfig['Trabajo Extra'];
  const Icon = config.icon;

  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(category, newTask.trim());
      setNewTask('');
      setIsAdding(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setNewTask('');
      setIsAdding(false);
    }
  };

  return (
    <div className={cn(
      "bg-gradient-to-br rounded-2xl p-4 border",
      config.gradient,
      config.border
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("w-5 h-5", config.accent)} />
        <h4 className="text-white font-semibold text-sm">{category}</h4>
        <span className="text-white/30 text-xs ml-auto">{tasks.length}</span>
      </div>
      
      <Droppable droppableId={`floating-${category}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "min-h-[60px] rounded-xl transition-all",
              snapshot.isDraggingOver && "bg-white/5"
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "group flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-3 mb-2 border transition-all",
                      snapshot.isDragging
                        ? "border-white/20 shadow-xl scale-105"
                        : "border-white/5 hover:border-white/10"
                    )}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                    >
                      <GripVertical className="w-4 h-4 text-white/30" />
                    </div>
                    <span className="text-sm text-white/80">{task.task}</span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !isAdding && (
              <div className="text-center text-white/20 text-xs py-2">
                Sin tareas pendientes
              </div>
            )}
          </div>
        )}
      </Droppable>
      
      {/* Add Task Input */}
      {isAdding ? (
        <div className="flex items-center gap-2 mt-2">
          <Input
            autoFocus
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={category === 'Sexualidad' ? '🔥 Nueva fantasía...' : '💼 Nueva tarea...'}
            className={cn(
              "flex-1 bg-[#0f0f0f] border-white/10 text-white text-sm placeholder:text-white/30",
              config.inputBorder
            )}
          />
          <button
            onClick={handleAdd}
            className={cn(
              "p-2 rounded-lg transition-all",
              config.accent,
              "bg-white/5 hover:bg-white/10"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/60 transition-all flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Agregar
        </button>
      )}
    </div>
  );
}