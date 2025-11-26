import React from 'react';
import { Menu, X, Layers, Bell, BellOff } from 'lucide-react';
import FloatingList from './FloatingList';
import GoalsPanel from './GoalsPanel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar({ 
  floatingTasks, 
  personalGoals,
  isOpen, 
  onToggle,
  notificationsEnabled,
  onToggleNotifications,
  onAddFloatingTask,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
  userEmail
}) {
  const trabajoTasks = floatingTasks.filter(t => t.category === 'Trabajo Extra');
  const sexualidadTasks = floatingTasks.filter(t => t.category === 'Sexualidad');
  
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1a1a] p-3 rounded-xl border border-white/10"
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
      
      <aside className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 w-80 bg-[#0a0a0a] border-r border-white/5",
        "transform transition-transform duration-300 ease-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Life Planner</h1>
              <p className="text-white/40 text-xs">Organiza tu semana</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="mb-2">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
              🎯 Objetivos
            </h3>
            <GoalsPanel 
              goals={personalGoals}
              onToggleGoal={onToggleGoal}
              onAddGoal={onAddGoal}
              onDeleteGoal={onDeleteGoal}
            />
          </div>
          
          <div>
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
              📋 Listas Flotantes
            </h3>
            <div className="space-y-4">
              <FloatingList 
                category="Trabajo Extra" 
                tasks={trabajoTasks} 
                onAddTask={onAddFloatingTask}
              />
              <FloatingList 
                category="Sexualidad" 
                tasks={sexualidadTasks} 
                onAddTask={onAddFloatingTask}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-white/5 space-y-2">
          <Button
            variant="ghost"
            onClick={onToggleNotifications}
            className={cn(
              "w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5",
              notificationsEnabled && "text-cyan-400"
            )}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4" />
                Notificaciones activas
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                Activar notificaciones
              </>
            )}
          </Button>
          
          {userEmail && (
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-medium truncate">
                    {userEmail}
                  </p>
                  <p className="text-white/40 text-[10px]">Conectado</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}