import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit, Trash2, Check, X, GripVertical, Star, Eye, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const PRIORITY_ORDER = {
  'Super Alta': 1,
  'Alta': 2,
  'Media': 3,
  'Baja': 4
};

const PRIORITY_COLORS = {
  'Super Alta': 'from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400',
  'Alta': 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400',
  'Media': 'from-yellow-500/20 to-yellow-400/20 border-yellow-500/30 text-yellow-400',
  'Baja': 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400'
};

const STATUS_OPTIONS = ['Inicio', 'En Progreso', 'Detenido', 'Completado'];

export default function GoalsPanel({ 
  goals, 
  onToggleGoal, 
  onAddGoal, 
  onEditGoal, 
  onUpdateGoalStatus, 
  onDeleteGoal,
  onUpdateGoalRating 
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState('Media');
  const [editingGoal, setEditingGoal] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Media');
  const [editStatus, setEditStatus] = useState('Inicio');
  const [editRating, setEditRating] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [expandedPriorities, setExpandedPriorities] = useState({
    'Super Alta': true,
    'Alta': true,
    'Media': true,
    'Baja': true
  });

  // Agrupar objetivos por prioridad
  const goalsByPriority = goals.reduce((acc, goal) => {
    const priority = goal.priority || 'Media';
    if (!acc[priority]) {
      acc[priority] = [];
    }
    acc[priority].push(goal);
    return acc;
  }, {});

  // Ordenar las prioridades según el orden definido
  const sortedPriorities = Object.keys(goalsByPriority).sort((a, b) => {
    return (PRIORITY_ORDER[a] || 5) - (PRIORITY_ORDER[b] || 5);
  });

  const togglePriority = (priority) => {
    setExpandedPriorities(prev => ({
      ...prev,
      [priority]: !prev[priority]
    }));
  };

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      onAddGoal(newGoalText.trim(), newGoalPriority);
      setNewGoalText('');
      setNewGoalPriority('Media');
      setIsAdding(false);
    }
  };

  const startEdit = (goal) => {
    setEditingGoal(goal);
    setEditText(goal.text);
    setEditPriority(goal.priority || 'Media');
    setEditStatus(goal.status || 'Inicio');
    setEditRating(goal.rating || 0);
    setEditDescription(goal.description || '');
  };

  const saveEdit = () => {
    if (editingGoal && editText.trim()) {
      onEditGoal(editingGoal.id, editText.trim());
      onUpdateGoalStatus(editingGoal.id, editStatus);
      // Actualizar rating y descripción si existen las funciones
      if (onUpdateGoalRating) {
        onUpdateGoalRating(editingGoal.id, editRating);
      }
      setEditingGoal(null);
    }
  };

  const toggleRating = (goalId, currentRating, starIndex) => {
    const newRating = currentRating === starIndex ? 0 : starIndex;
    if (onUpdateGoalRating) {
      onUpdateGoalRating(goalId, newRating);
    }
  };

  const getPriorityStats = (priority) => {
    const priorityGoals = goalsByPriority[priority] || [];
    const total = priorityGoals.length;
    const completed = priorityGoals.filter(g => g.completed).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, progress };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'text-green-400 bg-green-500/20';
      case 'En Progreso': return 'text-blue-400 bg-blue-500/20';
      case 'Detenido': return 'text-red-400 bg-red-500/20';
      case 'Inicio': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-3">
      {/* Header y Botón Agregar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider">
            OBJETIVOS
          </h3>
          <span className="text-white/30 text-xs">({goals.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-6 w-6 p-0 hover:bg-white/10"
        >
          <Plus className="w-3 h-3 text-white/60 hover:text-white" />
        </Button>
      </div>

      {/* Formulario para agregar nuevo objetivo */}
      {isAdding && (
        <div className="bg-black/20 p-3 rounded-lg border border-white/10 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
          <Input
            autoFocus
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Nuevo objetivo..."
            className="bg-[#0f0f0f] border-white/10 text-white text-sm focus:border-cyan-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
          />
          <div className="flex gap-2">
            <select
              value={newGoalPriority}
              onChange={(e) => setNewGoalPriority(e.target.value)}
              className="flex-1 bg-[#0f0f0f] border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Super Alta">Super Alta</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="h-7 px-2 text-xs text-white/60 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
              <Button
                onClick={handleAddGoal}
                className="h-7 px-2 text-xs bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
              >
                <Check className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de objetivos agrupados por prioridad */}
      <div className="space-y-2">
        {sortedPriorities.map(priority => {
          const goalsInPriority = goalsByPriority[priority];
          const stats = getPriorityStats(priority);
          const isExpanded = expandedPriorities[priority];
          
          if (!goalsInPriority || goalsInPriority.length === 0) return null;

          return (
            <div
              key={priority}
              className={cn(
                "bg-gradient-to-br rounded-xl border transition-all duration-300 overflow-hidden",
                PRIORITY_COLORS[priority]
              )}
            >
              {/* Header de la prioridad */}
              <button
                onClick={() => togglePriority(priority)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className={cn("w-2 h-2 rounded-full", PRIORITY_COLORS[priority].split(' ')[0])} />
                  <span className="text-white font-semibold text-sm text-left">{priority}</span>
                  <span className="text-white/30 text-xs">
                    ({stats.completed}/{stats.total})
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Barra de progreso */}
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", PRIORITY_COLORS[priority].split(' ')[0])}
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                  
                  {isExpanded ? 
                    <ChevronUp className="w-4 h-4 text-white/30" /> : 
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  }
                </div>
              </button>

              {/* Contenido de la prioridad */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                  {goalsInPriority.map(goal => (
                    <div
                      key={goal.id}
                      className={cn(
                        "group flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-3 border transition-all",
                        goal.completed ? "border-green-500/20" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => onToggleGoal(goal.id)}
                        className={cn(
                          "w-4 h-4 rounded border-2 transition-all flex items-center justify-center flex-shrink-0",
                          goal.completed 
                            ? "bg-green-500 border-green-500" 
                            : "border-white/20 hover:border-white/40"
                        )}
                      >
                        {goal.completed && <Check className="w-3 h-3 text-white" />}
                      </button>

                      {/* Texto del objetivo */}
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-medium transition-all",
                          goal.completed ? "text-white/40 line-through" : "text-white/80"
                        )}>
                          {goal.text}
                        </p>
                        
                        {/* Estado y Rating */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-xs font-medium",
                            getStatusColor(goal.status || 'Inicio')
                          )}>
                            {goal.status || 'Inicio'}
                          </span>
                          
                          {/* Rating con estrellas */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => toggleRating(goal.id, goal.rating || 0, star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                              >
                                <Star
                                  className={cn(
                                    "w-3 h-3",
                                    star <= (goal.rating || 0) 
                                      ? "text-yellow-500 fill-yellow-500" 
                                      : "text-white/10"
                                  )}
                                />
                              </button>
                            ))}
                          </div>

                          {/* Prioridad con estrellas */}
                          <div className="flex gap-0.5 ml-1">
                            {[1, 2, 3, 4].map(star => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-2.5 h-2.5",
                                  star <= (PRIORITY_ORDER[goal.priority] || 3) 
                                    ? "text-cyan-500 fill-cyan-500" 
                                    : "text-white/10"
                                )}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Descripción (si existe) */}
                        {goal.description && (
                          <p className="text-xs text-white/40 mt-1 line-clamp-1">
                            {goal.description}
                          </p>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => startEdit(goal)}
                          className="p-1 text-white/20 hover:text-cyan-400 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            // Aquí podrías agregar una función para ver detalles si la necesitas
                            startEdit(goal);
                          }}
                          className="p-1 text-white/20 hover:text-blue-400 transition-colors"
                          title="Ver Detalles"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="p-1 text-white/20 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de edición */}
      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-cyan-400">
              Editar Objetivo
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Texto del objetivo */}
            <div>
              <label className="text-xs font-bold text-white/40 uppercase mb-2 block">
                Objetivo
              </label>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Describe tu objetivo..."
                className="bg-[#0a0a0a] border-white/10 text-white focus:border-cyan-500"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-xs font-bold text-white/40 uppercase mb-2 block">
                Descripción / Notas
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Detalles adicionales, progreso, notas..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 min-h-[80px] resize-none"
              />
            </div>

            {/* Calificación */}
            <div>
              <label className="text-xs font-bold text-white/40 uppercase mb-2 block">
                Calificación (Importancia)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setEditRating(star === editRating ? 0 : star)}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                  >
                    <Star className={cn("w-6 h-6", star <= editRating ? "text-yellow-500 fill-yellow-500" : "text-white/20")} />
                  </button>
                ))}
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="text-xs font-bold text-white/40 uppercase mb-2 block">
                Prioridad
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Super Alta">Super Alta</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="text-xs font-bold text-white/40 uppercase mb-2 block">
                Estado
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button 
              variant="ghost" 
              onClick={() => { onDeleteGoal(editingGoal?.id); setEditingGoal(null); }} 
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setEditingGoal(null)}
                className="text-white/60 hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                onClick={saveEdit}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium"
              >
                <Save className="w-4 h-4 mr-2" /> Guardar Cambios
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Estado vacío */}
      {goals.length === 0 && !isAdding && (
        <div className="text-center py-8 text-white/20 text-sm border border-white/5 rounded-xl">
          No hay objetivos aún
          <br />
          <button 
            onClick={() => setIsAdding(true)}
            className="text-cyan-400 hover:text-cyan-300 text-xs mt-2"
          >
            Crear primer objetivo
          </button>
        </div>
      )}
    </div>
  );
}