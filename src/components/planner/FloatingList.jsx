import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Flame, GripVertical, Plus, Briefcase, ChevronDown, ChevronUp, Trash2, Eye, Star, Save, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const categoryConfig = {
  'Trabajo Extra': { 
    icon: Briefcase, 
    gradient: 'from-blue-500/20 to-indigo-500/20', 
    accent: 'text-blue-400', 
    border: 'border-blue-500/30', 
    inputBorder: 'focus:border-blue-500' 
  },
  'Sexualidad': { 
    icon: Flame, 
    gradient: 'from-red-500/20 to-rose-500/20', 
    accent: 'text-red-400', 
    border: 'border-red-500/30', 
    inputBorder: 'focus:border-red-500' 
  },
};

// Subcategorías para Sexualidad
const SEXUALITY_SUBCATEGORIES = {
  'Tríos': { emoji: '🔥', description: 'Experiencias de tríos' },
  'Orgías': { emoji: '⚡', description: 'Experiencias grupales' },
  'Saunas': { emoji: '🧖', description: 'Visitas a saunas' },
  'Cruising': { emoji: '🚶', description: 'Experiencias de cruising' }
};

export default function FloatingList({ category, tasks, onAddTask, onDeleteTask, onUpdateTask }) {
  const [newTask, setNewTask] = useState('');
  const [newTaskSubcategory, setNewTaskSubcategory] = useState('Tríos');
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [expandedSubcategories, setExpandedSubcategories] = useState({
    'Tríos': true, 'Orgías': true, 'Saunas': true, 'Cruising': true
  });

  const config = categoryConfig[category] || categoryConfig['Trabajo Extra'];
  const Icon = config.icon;
  const isSexualidad = category === 'Sexualidad';

  useEffect(() => {
    if (selectedTask) {
      setEditDescription(selectedTask.description || '');
      setEditRating(selectedTask.rating || 0);
    }
  }, [selectedTask]);

  // Agrupar tareas por subcategoría para Sexualidad
  const tasksBySubcategory = tasks.reduce((acc, task) => {
    const subcategory = task.subcategory || 'Tríos';
    if (!acc[subcategory]) {
      acc[subcategory] = [];
    }
    acc[subcategory].push(task);
    return acc;
  }, {});

  const toggleSubcategory = (subcategory) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategory]: !prev[subcategory]
    }));
  };

  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(category, newTask.trim(), '', 0, newTaskSubcategory);
      setNewTask('');
      setNewTaskSubcategory('Tríos');
      setIsAdding(false);
    }
  };

  const handleSaveChanges = () => {
    if (selectedTask) {
      onUpdateTask(selectedTask.id, {
        description: editDescription,
        rating: editRating
      });
      setSelectedTask(null);
    }
  };

  const toggleRatingCard = (taskId, currentRating, starIndex) => {
    const newRating = currentRating === starIndex ? 0 : starIndex;
    onUpdateTask(taskId, { rating: newRating });
  };

  const getSubcategoryStats = (subcategory) => {
    const subcategoryTasks = tasksBySubcategory[subcategory] || [];
    const total = subcategoryTasks.length;
    const avgRating = total > 0 
      ? subcategoryTasks.reduce((sum, task) => sum + (task.rating || 0), 0) / total 
      : 0;
    
    return { total, avgRating: Math.round(avgRating * 10) / 10 };
  };

  // Renderizado para Sexualidad con subcategorías
  if (isSexualidad) {
    return (
      <div className={cn("bg-gradient-to-br rounded-2xl border transition-all duration-300 overflow-hidden", config.gradient, config.border)}>
        {/* Header del Acordeón */}
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-2 p-4 hover:bg-white/5 transition-colors">
          <Icon className={cn("w-5 h-5", config.accent)} />
          <h4 className="text-white font-semibold text-sm flex-1 text-left">{category}</h4>
          <span className="text-white/30 text-xs mr-2">{tasks.length}</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </button>
        
        {/* Contenido Ocultable */}
        {isOpen && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Lista agrupada por subcategorías */}
            <div className="space-y-3">
              {Object.keys(SEXUALITY_SUBCATEGORIES).map(subcategory => {
                const tasksInSubcategory = tasksBySubcategory[subcategory] || [];
                const stats = getSubcategoryStats(subcategory);
                const isExpanded = expandedSubcategories[subcategory];
                const subcategoryConfig = SEXUALITY_SUBCATEGORIES[subcategory];

                return (
                  <div
                    key={subcategory}
                    className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl border border-red-500/20 transition-all duration-300 overflow-hidden"
                  >
                    {/* Header del grupo de subcategoría */}
                    <button
                      onClick={() => toggleSubcategory(subcategory)}
                      className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{subcategoryConfig.emoji}</span>
                        <div>
                          <span className="text-white font-semibold text-sm text-left block">{subcategory}</span>
                          <span className="text-white/40 text-xs block">{subcategoryConfig.description}</span>
                        </div>
                        <span className="text-white/30 text-xs">
                          ({stats.total})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Rating promedio */}
                        {stats.total > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-xs font-medium">{stats.avgRating}</span>
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                        
                        {isExpanded ? 
                          <ChevronUp className="w-4 h-4 text-white/30" /> : 
                          <ChevronDown className="w-4 h-4 text-white/30" />
                        }
                      </div>
                    </button>

                    {/* Contenido del grupo de subcategoría */}
                    {isExpanded && (
                      <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <Droppable droppableId={`floating-${category}-${subcategory}`}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={cn("min-h-[60px] rounded-xl transition-all", snapshot.isDraggingOver && "bg-white/5")}>
                              {tasksInSubcategory.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} className={cn("group flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-3 border transition-all", snapshot.isDragging ? "border-white/20 shadow-xl scale-105" : "border-white/5 hover:border-white/10")}>
                                      {/* Handle de drag */}
                                      <div {...provided.dragHandleProps} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex-shrink-0">
                                        <GripVertical className="w-4 h-4 text-white/30" />
                                      </div>

                                      {/* Estrellas de rating */}
                                      <div className="flex gap-0.5 flex-shrink-0">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button 
                                            key={star} 
                                            onClick={() => toggleRatingCard(task.id, task.rating || 0, star)} 
                                            className="focus:outline-none transition-transform hover:scale-110"
                                          >
                                            <Star className={cn("w-4 h-4", star <= (task.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-white/20")} />
                                          </button>
                                        ))}
                                      </div>

                                      {/* Texto de la tarea */}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/80 font-medium">{task.task}</p>
                                        {task.description && (
                                          <p className="text-xs text-white/40 mt-1 line-clamp-1">{task.description}</p>
                                        )}
                                      </div>

                                      {/* Acciones */}
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button 
                                          onClick={() => setSelectedTask(task)} 
                                          className="p-1 text-white/20 hover:text-cyan-400 transition-colors"
                                          title="Ver/Editar"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => onDeleteTask(task.id)} 
                                          className="p-1 text-white/20 hover:text-red-400 transition-colors"
                                          title="Eliminar"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              
                              {tasksInSubcategory.length === 0 && !isAdding && (
                                <div className="text-center text-white/20 text-xs py-4 border border-dashed border-white/10 rounded-lg">
                                  Sin experiencias en {subcategory}
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>

                        {/* Botón Agregar específico para esta subcategoría */}
                        {isAdding && newTaskSubcategory === subcategory ? (
                          <div className="flex flex-col gap-2 mt-2 bg-black/20 p-3 rounded-lg border border-white/10">
                            <Input 
                              autoFocus 
                              value={newTask} 
                              onChange={(e) => setNewTask(e.target.value)} 
                              placeholder={`Nueva experiencia en ${subcategory}...`} 
                              className={cn("bg-[#0f0f0f] border-white/10 text-white text-sm", config.inputBorder)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                            />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7 text-xs">
                                Cancelar
                              </Button>
                              <button onClick={handleAdd} className={cn("px-3 py-1 rounded-md text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all")}>
                                Crear
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setIsAdding(true);
                              setNewTaskSubcategory(subcategory);
                            }} 
                            className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/60 transition-all flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Agregar a {subcategory}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal de edición */}
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className={cn("text-xl", config.accent)}>
                {selectedTask?.task}
                {selectedTask?.subcategory && (
                  <span className="text-white/60 text-sm block mt-1">
                    {SEXUALITY_SUBCATEGORIES[selectedTask.subcategory]?.emoji} {selectedTask.subcategory}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-white/40 uppercase mb-2">Calificación</h5>
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

                <div>
                  <h5 className="text-xs font-bold text-white/40 uppercase mb-2">Descripción / Detalles</h5>
                  <textarea 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)} 
                    placeholder="Escribe aquí los detalles, experiencias, sensaciones, personas involucradas..." 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-sm text-white/90 min-h-[120px] focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-between">
              <Button variant="ghost" onClick={() => { onDeleteTask(selectedTask?.id); setSelectedTask(null); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
              </Button>
              <Button onClick={handleSaveChanges} className="bg-white text-black hover:bg-white/90">
                <Save className="w-4 h-4 mr-2" /> Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Renderizado original para Trabajo Extra (sin cambios)
  return (
    <div className={cn("bg-gradient-to-br rounded-2xl border transition-all duration-300 overflow-hidden", config.gradient, config.border)}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-2 p-4 hover:bg-white/5 transition-colors">
        <Icon className={cn("w-5 h-5", config.accent)} />
        <h4 className="text-white font-semibold text-sm flex-1 text-left">{category}</h4>
        <span className="text-white/30 text-xs mr-2">{tasks.length}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <Droppable droppableId={`floating-${category}`}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={cn("min-h-[60px] rounded-xl transition-all", snapshot.isDraggingOver && "bg-white/5")}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className={cn("group flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-3 mb-2 border transition-all", snapshot.isDragging ? "border-white/20 shadow-xl scale-105" : "border-white/5 hover:border-white/10")}>
                        <div {...provided.dragHandleProps} className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                          <GripVertical className="w-4 h-4 text-white/30" />
                        </div>
                        <span className="text-sm text-white/80 flex-1 font-medium">{task.task}</span>
                        
                        <div className="flex items-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedTask(task)} className="p-1 text-white/20 hover:text-cyan-400" title="Ver/Editar">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onDeleteTask(task.id)} className="p-1 text-white/20 hover:text-red-400" title="Eliminar">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {tasks.length === 0 && !isAdding && <div className="text-center text-white/20 text-xs py-2">Sin ítems</div>}
              </div>
            )}
          </Droppable>
          
          {isAdding ? (
            <div className="flex flex-col gap-2 mt-2 bg-black/20 p-2 rounded-lg">
              <Input autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nuevo título..." className={cn("bg-[#0f0f0f] border-white/10 text-white text-sm", config.inputBorder)} />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7 text-xs">Cancelar</Button>
                <button onClick={handleAdd} className={cn("px-3 py-1 rounded-md text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all")}>Crear</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)} className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/60 transition-all flex items-center justify-center gap-1">
              <Plus className="w-3 h-3" /> Agregar
            </button>
          )}
        </div>
      )}

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={cn("text-xl", config.accent)}>{selectedTask?.task}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-white/60 italic text-sm">Puedes mover esta tarea al día que corresponda.</p>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between">
            <Button variant="ghost" onClick={() => { onDeleteTask(selectedTask.id); setSelectedTask(null); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
            </Button>
            <Button onClick={handleSaveChanges} className="bg-white text-black hover:bg-white/90">
              <Save className="w-4 h-4 mr-2" /> Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}