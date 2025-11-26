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
  const [newTime, setNewTime] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(day, newTask.trim(), newTime);
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
      // CAMBIO CLAVE AQUÍ: w-[85vw] md:w-[320px]
      // En celular ocupa el 85% de la pantalla (se ve un poquito del siguiente día para incitar al scroll)
      // En PC ocupa 320px fijo.
      "flex-shrink-0 w-[85vw] md:w-[320px] flex flex-col h-full", 
      "bg-gradient-to-b rounded-2xl p-4 border border-white/5",
      dayColors[day],
      isToday && "ring-2 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
    )}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]", dayAccents[day])} />
        <h3 className="text-white font-bold tracking-wide text-lg shadow-black drop-shadow-md">
          {day}
        </h3>
        {isToday && (
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
            Hoy
          </span>
        )}
        <span className="text-white/40 text-xs ml-auto font-mono">
          {tasks.length}
        </span>
      </div>
      
      <Droppable droppableId={day}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 min-h-[150px] rounded-xl transition-all duration-300 p-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar",
              snapshot.isDraggingOver && "bg-white/5 ring-1 ring-white/20"
            )}
          >
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
              <div className="flex flex-col items-center justify-center h-32 text-white/10 text-sm border-2 border-dashed border-white/5 rounded-lg m-2">
                <span>Vacío</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
      
      {/* Quick Add Task */}
      <div className="mt-auto pt-3 border-t border-white/10">
        {isAdding ? (
          <div className="flex flex-col gap-2 bg-black/20 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            <Input
              autoFocus
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nueva tarea..."
              className="h-9 bg-[#0f0f0f] border-white/10 text-white text-sm placeholder:text-white/30 focus:border-white/30"
            />
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 group-hover:text-cyan-400 transition-colors" />
                <Input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-9 pl-8 bg-[#0f0f0f] border-white/10 text-white text-xs font-mono focus:border-white/30"
                />
              </div>
              <button
                onClick={handleAdd}
                className={cn(
                  "px-4 rounded-md transition-all shadow-lg active:scale-95 flex items-center justify-center",
                  dayAccents[day],
                  "text-white hover:brightness-110"
                )}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 rounded-lg border border-dashed border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Agregar tarea
          </button>
        )}
      </div>
    </div>
  );
}