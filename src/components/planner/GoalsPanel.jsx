import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle, ArrowUp, Minus, ArrowDown, Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG = {
  'Super Alta': { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, order: 4 },
  'Alta': { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: ArrowUp, order: 3 },
  'Media': { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Minus, order: 2 },
  'Baja': { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: ArrowDown, order: 1 },
};

export default function GoalsPanel({ goals, onToggleGoal, onAddGoal, onDeleteGoal, onEditGoal }) {
  const [newGoal, setNewGoal] = useState('');
  const [priority, setPriority] = useState('Media');
  
  // Estado para Edición y Detalle
  const [selectedGoal, setSelectedGoal] = useState(null); // Para ver detalle
  const [editingId, setEditingId] = useState(null); // ID del objetivo que se edita
  const [editText, setEditText] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal, priority);
      setNewGoal('');
      setPriority('Media');
    }
  };

  const startEditing = (goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      onEditGoal(id, editText);
      setEditingId(null);
    }
  };

  const sortedGoals = [...goals].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pA = PRIORITY_CONFIG[a.priority || 'Media'].order;
    const pB = PRIORITY_CONFIG[b.priority || 'Media'].order;
    return pB - pA;
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {sortedGoals.length === 0 && <p className="text-white/20 text-xs text-center italic py-2">No hay objetivos aún</p>}
        
        {sortedGoals.map((goal) => {
          const config = PRIORITY_CONFIG[goal.priority || 'Media'];
          const Icon = config.icon;
          const isEditing = editingId === goal.id;
          
          return (
            <div key={goal.id} className={cn("group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200", goal.completed ? "bg-white/5 border-transparent opacity-50" : `bg-[#151515] ${config.border}`)}>
              <button onClick={() => onToggleGoal(goal.id)} className="flex-shrink-0 transition-transform active:scale-90">
                 {goal.completed ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-white/20 group-hover:text-white/50" />}
              </button>
              
              <div className="flex-1 min-w-0 flex flex-col">
                {isEditing ? (
                  <Input 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)} 
                    onBlur={() => saveEdit(goal.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(goal.id)}
                    autoFocus
                    className="h-6 text-sm bg-black/50 border-white/20"
                  />
                ) : (
                  <span className={cn("text-sm font-medium truncate transition-colors", goal.completed ? 'text-white/30 line-through' : 'text-white/90')}>
                    {goal.text}
                  </span>
                )}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Icon className={cn("w-3 h-3", config.color)} />
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color)}>{goal.priority || 'Media'}</span>
                </div>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setSelectedGoal(goal)} className="p-1.5 text-white/20 hover:text-cyan-400" title="Ver detalle"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => startEditing(goal)} className="p-1.5 text-white/20 hover:text-yellow-400" title="Editar"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => onDeleteGoal(goal.id)} className="p-1.5 text-white/20 hover:text-red-400" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>
      
      <form onSubmit={handleAdd} className="bg-[#151515] p-3 rounded-xl border border-white/5 space-y-2">
        <Input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Nuevo objetivo..." className="h-9 bg-black/20 border-white/10 text-white text-sm focus:border-cyan-500/50" />
        <div className="flex gap-2">
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-8 flex-1 bg-black/20 border-white/10 text-xs text-white"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10">
              {Object.keys(PRIORITY_CONFIG).map(p => <SelectItem key={p} value={p} className="text-white hover:bg-white/10 text-xs">{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button type="submit" size="sm" className="h-8 w-8 p-0 bg-cyan-500 hover:bg-cyan-600 text-black"><Plus className="w-4 h-4" /></Button>
        </div>
      </form>

      {/* Modal Ver Detalle */}
      <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Detalle del Objetivo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg text-white/90 mb-4">{selectedGoal?.text}</p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 w-fit">
              <span className="text-xs text-white/50">Prioridad:</span>
              <span className={cn("text-xs font-bold uppercase", selectedGoal && PRIORITY_CONFIG[selectedGoal.priority || 'Media'].color)}>
                {selectedGoal?.priority}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}