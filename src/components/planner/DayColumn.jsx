import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Plus, Clock } from 'lucide-react';

const dayColors = {
  'Lunes': 'from-cyan-500/20 to-cyan-500/5',
  'Martes': 'from-blue-500/20 to-blue-500/5',
  'Miércoles': 'from-violet-500/20 to-violet-500/5',
  'Jueves': 'from-purple-500/20 to-purple-500/5',
  'Viernes': 'from-pink-500/20 to-pink-500/5',
  'Sábado': 'from-emerald-500/20 to-emerald-500/5',
  'Domingo': 'from-amber-500/20 to-amber-500/5',
};

const dayAccents = {
  'Lunes': 'bg-cyan-500',
  'Martes': 'bg-blue-500',
  'Miércoles': 'bg-violet-500',
  'Jueves': 'bg-purple-500',
  'Viernes': 'bg-pink-500',
  'Sábado': 'bg-emerald-500',
  'Domingo': 'bg-amber-500',
};

const dayAccentText = {
  'Lunes': 'text-cyan-400',
  'Martes': 'text-blue-400',
  'Miércoles': 'text-violet-400',
  'Jueves': 'text-purple-400',
  'Viernes': 'text-pink-400',
  'Sábado': 'text-emerald-400',
  'Domingo': 'text-amber-400',
};

export default function DayColumn({ day, tasks, onToggleComplete, onAddTask, isToday }) {
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState(''); // Nuevo estado para la hora
  const [isAdding, setIsAdding] = useState(false);
  
  // ELIMINAMOS EL SORT AUTOMÁTICO PARA QUE EL DRAG & DROP FUNCIONE
  // Usamos 'tasks' directamente en lugar de 'sortedTasks'

  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(day, newTask.trim(), newTime); // Pasamos la hora también
      setNewTask('');
      setNewTime('');
      setIsAdding(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setNewTask('');
      setNewTime('');
      setIsAdding(false);
    }
  };

  return (
    <div className={cn(
      "flex-shrink-0 w-72 md:w-auto md:flex-1 flex flex-col",
      "bg-gradient-to-b rounded-2xl p-4",
      dayColors[day],
      isToday && "ring-2 ring-cyan-500/50"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-2 h-2 rounded-full", dayAccents[day])} />
        <h3 className="text-white font-semibold tracking-wide">
          {day}
        </h3>
        {isToday && (
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-medium">
            Hoy
          </span>
        )}
        <span className="text-white/30 text-xs ml-auto">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={day}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 min-h-[150px] rounded-xl transition-all duration-300 p-1",
              snapshot.isDraggingOver && "bg-white/5"
            )}
          >
            {/* Usamos tasks directo para respetar tu orden manual */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onToggleComplete={onToggleComplete}
              />
            ))}
            {provided.placeholder}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-white/20 text-sm">
                Arrastra tareas aquí
              </div>
            )}
          </div>
        )}
      </Droppable>
      
      {/* Quick Add Task MEJORADO */}
      <div className="mt-3 pt-3 border-t border-white/5">
        {isAdding ? (
          <div className="flex flex-col gap-2">
            <Input
              autoFocus
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nueva tarea..."
              className="h-8 bg-[#0f0f0f] border-white/10 text-white text-sm placeholder:text-white/30"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40" />
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 pl-7 bg-[#0f0f0f] border-white/10 text-white text-xs"
                />
              </div>
              <button
                onClick={handleAdd}
                className={cn(
                  "px-3 rounded-lg transition-all bg-white/5 hover:bg-white/10 flex items-center justify-center",
                  dayAccentText[day]
                )}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/60 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Agregar tarea
          </button>
        )}
      </div>
    </div>
  );
}