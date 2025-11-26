import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Plus, Clock, X } from 'lucide-react';

const dayColors = {
  'Lunes': 'from-cyan-900/20 to-transparent',
  'Martes': 'from-blue-900/20 to-transparent',
  'Miércoles': 'from-violet-900/20 to-transparent',
  'Jueves': 'from-purple-900/20 to-transparent',
  'Viernes': 'from-pink-900/20 to-transparent',
  'Sábado': 'from-emerald-900/20 to-transparent',
  'Domingo': 'from-amber-900/20 to-transparent',
};

const dayAccents = {
  'Lunes': 'text-cyan-400 border-cyan-500/30',
  'Martes': 'text-blue-400 border-blue-500/30',
  'Miércoles': 'text-violet-400 border-violet-500/30',
  'Jueves': 'text-purple-400 border-purple-500/30',
  'Viernes': 'text-pink-400 border-pink-500/30',
  'Sábado': 'text-emerald-400 border-emerald-500/30',
  'Domingo': 'text-amber-400 border-amber-500/30',
};

// Agregamos prop 'date'
export default function DayColumn({ day, date, tasks, onToggleComplete, onAddTask, isToday }) {
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
      "flex-shrink-0 w-[85vw] md:w-[300px] flex flex-col h-full rounded-3xl border border-white/5 overflow-hidden relative group",
      "bg-[#0a0a0a]",
      isToday && "ring-1 ring-white/20"
    )}>
      <div className={cn("p-4 border-b border-white/5 bg-gradient-to-b", dayColors[day])}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col">
            <h3 className={cn("font-bold text-lg tracking-tight leading-none", dayAccents[day].split(' ')[0])}>
              {day}
            </h3>
            {/* FECHA REAL AQUI */}
            <span className="text-white/40 text-xs font-mono mt-1">{date}</span>
          </div>
          {isToday && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 rounded-full">
              Hoy
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-white/40 font-medium mt-2">
          <span>{tasks.length} tareas</span>
          <span>{tasks.filter(t => t.completed).length} completadas</span>
        </div>
      </div>
      
      <Droppable droppableId={day}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar relative",
              snapshot.isDraggingOver && "bg-white/5"
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onToggleComplete={onToggleComplete} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && !isAdding && (
              <div className="flex-1 flex flex-col items-center justify-center text-white/10">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-2">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs">Sin tareas</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
      
      <div className="p-3 bg-gradient-to-t from-[#0a0a0a] to-transparent">
        {isAdding ? (
          <div className="flex flex-col gap-2 bg-[#151515] p-3 rounded-2xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-white/30">Nueva Tarea</span>
              <button onClick={() => setIsAdding(false)} className="text-white/30 hover:text-white"><X className="w-3 h-3" /></button>
            </div>
            <Input autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribe aquí..." className="h-9 bg-black/40 border-white/5 text-sm" />
            <div className="flex gap-2">
              <div className="relative w-24">
                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full h-8 pl-7 pr-1 bg-black/40 border border-white/5 rounded-lg text-xs text-white/70 focus:outline-none focus:border-white/20" />
              </div>
              <button onClick={handleAdd} className="flex-1 h-8 bg-white text-black rounded-lg text-xs font-bold hover:bg-white/90 transition-colors">Agregar</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className={cn("w-full py-3 rounded-xl border border-dashed border-white/10 text-white/30 text-xs font-medium hover:border-white/20 hover:text-white/60 hover:bg-white/5 transition-all flex items-center justify-center gap-2", dayAccents[day].split(' ')[1])}>
            <Plus className="w-3 h-3" /> <span>Añadir</span>
          </button>
        )}
      </div>
    </div>
  );
}