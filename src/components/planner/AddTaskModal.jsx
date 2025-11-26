import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const CATEGORIES = ['Trabajo', 'Sexualidad', 'Trabajo Extra'];

export default function AddTaskModal({ isOpen, onClose, onAdd }) {
  const [taskType, setTaskType] = useState('day');
  const [task, setTask] = useState('');
  const [day, setDay] = useState('Lunes');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('Trabajo');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      task: task.trim(),
      type: 'custom',
      completed: false,
    };
    if (taskType === 'day') {
      newTask.day = day;
      newTask.time = time || null;
    } else {
      newTask.list = 'floating';
      newTask.category = category;
    }
    
    onAdd(newTask);
    setTask('');
    setTime('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Nueva Tarea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={taskType === 'day' ? 'default' : 'outline'}
              onClick={() => setTaskType('day')}
              className={taskType === 'day' 
                ? 'bg-cyan-500 hover:bg-cyan-600' 
                : 'border-white/10 text-white/60 hover:text-white hover:bg-white/5'}
            >
              Día específico
            </Button>
            <Button
              type="button"
              variant={taskType === 'floating' ? 'default' : 'outline'}
              onClick={() => setTaskType('floating')}
              className={taskType === 'floating' 
                ? 'bg-cyan-500 hover:bg-cyan-600' 
                : 'border-white/10 text-white/60 hover:text-white hover:bg-white/5'}
            >
              Lista flotante
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white/70">Descripción</Label>
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Ej: 🏋️ Ir al gym"
              className="bg-[#0f0f0f] border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          
          {taskType === 'day' ? (
            <>
              <div className="space-y-2">
                <Label className="text-white/70">Día</Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger className="bg-[#0f0f0f] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10">
                    {DAYS.map(d => (
                      <SelectItem key={d} value={d} className="text-white hover:bg-white/10">
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white/70">Hora (opcional)</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-[#0f0f0f] border-white/10 text-white"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label className="text-white/70">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c} className="text-white hover:bg-white/10">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Tarea
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}