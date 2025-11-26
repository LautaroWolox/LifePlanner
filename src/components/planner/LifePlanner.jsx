import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, RotateCcw, Loader2 } from 'lucide-react';
import Sidebar from '@/components/planner/Sidebar';
import DayColumn from '@/components/planner/DayColumn';
import AddTaskModal from '@/components/planner/AddTaskModal';
import AccessDenied from '@/components/planner/AccessDenied';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const ALLOWED_EMAILS = [
  'busonlautaro@gmail.com',
  'mlautarobuson@gmail.com'
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const STORAGE_KEY = 'life-planner-data';
const LAST_RESET_KEY = 'life-planner-last-reset';

const DEFAULT_DATA = {
  weekTasks: [
    { id: "1", day: "Lunes", time: "08:00", task: "🧴 Skin Care", category: "Salud", type: "fixed" },
    { id: "2", day: "Lunes", time: "09:00", task: "💼 INICIO TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "3", day: "Lunes", time: "10:30", task: "❤️ Escribir a mi amor carpincho", category: "Personal", type: "fixed" },
    { id: "4", day: "Lunes", time: "13:00", task: "🥗 Almorzar", category: "Salud", type: "fixed" },
    { id: "5", day: "Lunes", time: "17:00", task: "🏁 FIN TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "6", day: "Lunes", time: "20:00", task: "📅 Planear salidas", category: "Personal", type: "fixed" },
    { id: "7", day: "Martes", time: "08:00", task: "🧴 Skin Care", category: "Salud", type: "fixed" },
    { id: "8", day: "Martes", time: "09:00", task: "💼 INICIO TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "9", day: "Martes", time: "10:30", task: "❤️ Escribir a mi amor carpincho", category: "Personal", type: "fixed" },
    { id: "10", day: "Martes", time: "13:00", task: "🥗 Almorzar", category: "Salud", type: "fixed" },
    { id: "11", day: "Martes", time: "17:00", task: "🏁 FIN TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "12", day: "Martes", time: "19:00", task: "🏋️ Gym", category: "Salud", type: "fixed" },
    { id: "13", day: "Miércoles", time: "08:00", task: "🧴 Skin Care", category: "Salud", type: "fixed" },
    { id: "14", day: "Miércoles", time: "09:00", task: "💼 INICIO TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "15", day: "Miércoles", time: "10:30", task: "❤️ Escribir a mi amor carpincho", category: "Personal", type: "fixed" },
    { id: "16", day: "Miércoles", time: "13:00", task: "🥗 Almorzar", category: "Salud", type: "fixed" },
    { id: "17", day: "Miércoles", time: "17:00", task: "🏁 FIN TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "18", day: "Miércoles", time: "21:00", task: "🎮 Gaming night", category: "Personal", type: "fixed" },
    { id: "19", day: "Jueves", time: "08:00", task: "🧴 Skin Care", category: "Salud", type: "fixed" },
    { id: "20", day: "Jueves", time: "09:00", task: "💼 INICIO TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "21", day: "Jueves", time: "10:30", task: "❤️ Escribir a mi amor carpincho", category: "Personal", type: "fixed" },
    { id: "22", day: "Jueves", time: "13:00", task: "🥗 Almorzar", category: "Salud", type: "fixed" },
    { id: "23", day: "Jueves", time: "17:00", task: "🏁 FIN TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "24", day: "Jueves", time: "19:00", task: "🏋️ Gym", category: "Salud", type: "fixed" },
    { id: "25", day: "Viernes", time: "08:00", task: "🧴 Skin Care", category: "Salud", type: "fixed" },
    { id: "26", day: "Viernes", time: "09:00", task: "💼 INICIO TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "27", day: "Viernes", time: "10:30", task: "❤️ Escribir a mi amor carpincho", category: "Personal", type: "fixed" },
    { id: "28", day: "Viernes", time: "13:00", task: "🥗 Almorzar", category: "Salud", type: "fixed" },
    { id: "29", day: "Viernes", time: "17:00", task: "🏁 FIN TRABAJO", category: "Trabajo", type: "fixed" },
    { id: "30", day: "Viernes", time: "21:00", task: "🍺 Juntada con amigos", category: "Personal", type: "fixed" },
    { id: "31", day: "Sábado", time: "10:00", task: "😴 Despertar tarde", category: "Personal", type: "fixed" },
    { id: "32", day: "Sábado", time: "12:00", task: "🧹 Limpieza del hogar", category: "Personal", type: "fixed" },
    { id: "33", day: "Sábado", time: "18:00", task: "🎾 PÁDEL con los chicos", category: "Salud", type: "fixed" },
    { id: "34", day: "Sábado", time: "22:00", task: "🎉 Salir de fiesta", category: "Personal", type: "fixed" },
    { id: "35", day: "Domingo", time: "11:00", task: "😴 Despertar tarde", category: "Personal", type: "fixed" },
    { id: "36", day: "Domingo", time: "13:00", task: "👨‍👩‍👧 Almuerzo familiar", category: "Personal", type: "fixed" },
    { id: "37", day: "Domingo", time: "17:00", task: "📺 Maratón de series", category: "Personal", type: "fixed" },
    { id: "38", day: "Domingo", time: "21:00", task: "📋 Preparar semana", category: "Personal", type: "fixed" },
  ],
  floatingTasks: [
    { id: "f1", task: "💻 Pasaje a PROD (22:00-03:00)", category: "Trabajo Extra" },
    { id: "f2", task: "🔥 Tríos", category: "Sexualidad" },
    { id: "f3", task: "🔥 Orgías", category: "Sexualidad" },
    { id: "f4", task: "🔥 Saunas", category: "Sexualidad" },
    { id: "f5", task: "🔥 Cruising", category: "Sexualidad" },
  ],
  personalGoals: [
    { id: "g1", text: "💰 Ahorrar para vacaciones", completed: false },
    { id: "g2", text: "📚 Leer 1 libro por mes", completed: false },
    { id: "g3", text: "🏃 Correr 5km sin parar", completed: false },
  ]
};

const getTodayName = () => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[new Date().getDay()];
};

const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 604800000;
  return Math.floor(diff / oneWeek);
};

export default function LifePlanner() {
  const [data, setData] = useState({ weekTasks: [], floatingTasks: [], personalGoals: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser && ALLOWED_EMAILS.includes(currentUser.email.toLowerCase())) {
          setIsAuthorized(true);
          localStorage.setItem('life-planner-user', currentUser.email);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        base44.auth.redirectToLogin();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    const savedData = localStorage.getItem(STORAGE_KEY);
    const lastReset = localStorage.getItem(LAST_RESET_KEY);
    const currentWeek = getWeekNumber();
    const today = new Date().getDay();
    
    if (today === 1 && lastReset !== String(currentWeek)) {
      const resetData = {
        ...DEFAULT_DATA,
        weekTasks: DEFAULT_DATA.weekTasks.map(t => ({ ...t, completed: false })),
        personalGoals: savedData ? JSON.parse(savedData).personalGoals : DEFAULT_DATA.personalGoals,
      };
      setData(resetData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
      localStorage.setItem(LAST_RESET_KEY, String(currentWeek));
      toast.success('¡Nueva semana! Tareas reiniciadas');
    } else if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      setData(DEFAULT_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    }
  }, [isAuthorized]);
  
  useEffect(() => {
    if (data.weekTasks.length > 0 || data.floatingTasks.length > 0 || data.personalGoals.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('Tu navegador no soporta notificaciones');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      toast.success('Notificaciones activadas');
    } else {
      toast.error('Permiso de notificaciones denegado');
    }
  };

  useEffect(() => {
    if (!notificationsEnabled) return;
    const checkNotifications = () => {
      const now = new Date();
      const currentDay = getTodayName();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      data.weekTasks.forEach(task => {
        if (task.day === currentDay && task.time === currentTime && !task.completed) {
          new Notification('Life Planner', {
            body: task.task,
            icon: '/favicon.ico',
          });
        }
      });
    };
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [data.weekTasks, notificationsEnabled]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    let newWeekTasks = [...data.weekTasks];
    let newFloatingTasks = [...data.floatingTasks];
    
    let sourceList;
    if (source.droppableId.startsWith('floating-')) {
        const category = source.droppableId.replace('floating-', '');
        sourceList = newFloatingTasks.filter(t => t.category === category);
    } else {
        sourceList = newWeekTasks.filter(t => t.day === source.droppableId);
    }
    
    const taskToMove = sourceList[source.index];
    
    if (!taskToMove) return;

    // 1. ELIMINAR DEL ORIGEN
    if (source.droppableId.startsWith('floating-')) {
        newFloatingTasks = newFloatingTasks.filter(t => t.id !== taskToMove.id);
    } else {
        newWeekTasks = newWeekTasks.filter(t => t.id !== taskToMove.id);
    }

    // 2. PREPARAR TAREA ACTUALIZADA
    let updatedTask = { ...taskToMove };

    // 3. INSERTAR EN DESTINO
    if (destination.droppableId.startsWith('floating-')) {
        const category = destination.droppableId.replace('floating-', '');
        updatedTask.category = category;
        delete updatedTask.day;
        delete updatedTask.time;
        updatedTask.type = 'custom';
        
        const destinationCategoryTasks = newFloatingTasks.filter(t => t.category === category);
        const otherFloatingTasks = newFloatingTasks.filter(t => t.category !== category);
        
        destinationCategoryTasks.splice(destination.index, 0, updatedTask);
        newFloatingTasks = [...otherFloatingTasks, ...destinationCategoryTasks];

    } else if (DAYS.includes(destination.droppableId)) {
        const destinationDay = destination.droppableId;
        updatedTask.day = destinationDay;
        updatedTask.type = updatedTask.type || 'custom';
        delete updatedTask.category;

        const destinationDayTasks = newWeekTasks.filter(t => t.day === destinationDay);
        const otherDayTasks = newWeekTasks.filter(t => t.day !== destinationDay);
        
        destinationDayTasks.splice(destination.index, 0, updatedTask);
        newWeekTasks = [...otherDayTasks, ...destinationDayTasks];
    }
    
    setData(prev => ({
      ...prev,
      weekTasks: newWeekTasks,
      floatingTasks: newFloatingTasks,
    }));
  };
  
  const toggleComplete = useCallback((taskId) => {
    setData(prev => ({
      ...prev,
      weekTasks: prev.weekTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  }, []);

  // --- FUNCIÓN QUE ACEPTA HORA (TimeVal) ---
  const addDayTask = useCallback((day, taskText, timeVal) => {
    const newTask = {
      id: `task-${Date.now()}`,
      day,
      task: taskText,
      time: timeVal || null, 
      type: 'custom',
      completed: false,
    };
    setData(prev => ({
      ...prev,
      weekTasks: [...prev.weekTasks, newTask],
    }));
    toast.success('Tarea agregada');
  }, []);

  const addFloatingTask = useCallback((category, taskText) => {
    const emoji = category === 'Sexualidad' ? '🔥' : '💼';
    const newTask = {
      id: `float-${Date.now()}`,
      task: `${emoji} ${taskText}`,
      category,
    };
    setData(prev => ({
      ...prev,
      floatingTasks: [...prev.floatingTasks, newTask],
    }));
    toast.success('Agregado a lista flotante');
  }, []);

  const toggleGoal = useCallback((goalId) => {
    setData(prev => ({
      ...prev,
      personalGoals: prev.personalGoals.map(g =>
        g.id === goalId ? { ...g, completed: !g.completed } : g
      ),
    }));
  }, []);

  const addGoal = useCallback((text) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      text: `🎯 ${text}`,
      completed: false,
    };
    setData(prev => ({
      ...prev,
      personalGoals: [...prev.personalGoals, newGoal],
    }));
    toast.success('Objetivo agregado');
  }, []);

  const deleteGoal = useCallback((goalId) => {
    setData(prev => ({
      ...prev,
      personalGoals: prev.personalGoals.filter(g => g.id !== goalId),
    }));
    toast.success('Objetivo eliminado');
  }, []);

  const addTask = (newTask) => {
    if (newTask.day) {
      setData(prev => ({
        ...prev,
        weekTasks: [...prev.weekTasks, newTask],
      }));
    } else {
      setData(prev => ({
        ...prev,
        floatingTasks: [...prev.floatingTasks, newTask],
      }));
    }
    toast.success('Tarea agregada');
  };
  
  const resetWeek = () => {
    const resetData = {
      ...DEFAULT_DATA,
      weekTasks: DEFAULT_DATA.weekTasks.map(t => ({ ...t, completed: false })),
      personalGoals: data.personalGoals,
    };
    setData(resetData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    toast.success('Semana reiniciada');
  };
  
  const todayName = getTodayName();
  const dayTasks = (day) => data.weekTasks.filter(t => t.day === day);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized && user) {
    return <AccessDenied email={user.email} />;
  }
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">
        <Sidebar
          floatingTasks={data.floatingTasks}
          personalGoals={data.personalGoals}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={requestNotifications}
          onAddFloatingTask={addFloatingTask}
          onToggleGoal={toggleGoal}
          onAddGoal={addGoal}
          onDeleteGoal={deleteGoal}
          userEmail={user?.email}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex-shrink-0 p-4 md:p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="ml-12 md:ml-0">
                <h2 className="text-white text-xl md:text-2xl font-bold">Mi Semana</h2>
                <p className="text-white/40 text-sm mt-1">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetWeek}
                  className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </Button>
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Nueva Tarea</span>
                </Button>
              </div>
            </div>
          </header>
          
          {/* AQUÍ ESTÁ EL CAMBIO PARA EL SCROLL HORIZONTAL EN MÓVIL */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6 bg-[#0f0f0f]">
            <div className="flex h-full gap-4 px-2 pb-2">
              {DAYS.map(day => (
                <DayColumn
                  key={day}
                  day={day}
                  tasks={dayTasks(day)}
                  onToggleComplete={toggleComplete}
                  onAddTask={addDayTask}
                  isToday={day === todayName}
                />
              ))}
              <div className="w-4 flex-shrink-0" />
            </div>
          </div>
        </main>
        
        <AddTaskModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={addTask}
        />
      </div>
    </DragDropContext>
  );
}