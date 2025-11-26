import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Plus, Clock, X } from 'lucide-react';

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
      
      {/* Quick Add Task MEJORADO */}
      <div className="mt-auto pt-3 border-t border-white/10">
        {isAdding ? (
          <div className="flex flex-col gap-2 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            
            {/* Título y botón cerrar */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Nueva Tarea</span>
              <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Texto */}
            <Input
              autoFocus
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe aquí..."
              className="h-10 bg-black/40 border-white/10 text-white text-base placeholder:text-white/20 focus:border-cyan-500/50 transition-all"
            />
            
            {/* Input Hora y Botón */}
            <div className="flex gap-2">
              <div className="relative w-28 group">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors pointer-events-none" />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full h-10 pl-9 pr-2 bg-black/40 border border-white/10 rounded-md text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 transition-all appearance-none"
                />
              </div>
              
              <button
                onClick={handleAdd}
                className={cn(
                  "flex-1 h-10 rounded-md transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 font-medium text-white text-sm",
                  dayAccents[day],
                  "hover:brightness-110"
                )}
              >
                <span>Agregar</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/40 text-sm font-medium hover:border-white/20 hover:text-white/80 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Agregar tarea
          </button>
        )}
      </div>
    </div>
  );
}