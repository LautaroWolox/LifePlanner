import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Check, Clock, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TaskCard({ task, index, onToggleComplete }) {
  const isCompleted = task.completed;
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group relative bg-[#1e1e1e] rounded-xl p-3 mb-2 border transition-all duration-300",
            snapshot.isDragging 
              ? "border-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-105" 
              : "border-white/5 hover:border-white/10",
            isCompleted && "opacity-50"
          )}
        >
          <div className="flex items-start gap-3">
            <div
              {...provided.dragHandleProps}
              className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-white/30" />
            </div>
            
            <button
              onClick={() => onToggleComplete(task.id)}
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-0.5",
                isCompleted 
                  ? "bg-emerald-500 border-emerald-500" 
                  : "border-white/20 hover:border-cyan-400"
              )}
            >
              {isCompleted && <Check className="w-3 h-3 text-white" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm text-white/90 leading-relaxed transition-all",
                isCompleted && "line-through text-white/40"
              )}>
                {task.task}
              </p>
              
              {task.time && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium">{task.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}