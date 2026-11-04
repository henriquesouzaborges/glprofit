import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Star, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  User, 
  AlertCircle, 
  X, 
  Filter, 
  Sparkles, 
  Clock, 
  MoreVertical, 
  ArrowRight, 
  ListPlus, 
  Flag,
  Share2
} from 'lucide-react';
import { 
  GoogleTask, 
  TaskUserColumn, 
  TASK_COLUMNS, 
  getStoredTasks, 
  saveStoredTasks, 
  TaskPriority, 
  TaskCategory, 
  CATEGORY_LABELS, 
  PRIORITY_CONFIG,
  SubTask
} from '../../../services/tasksService';
import { SystemUser } from '../../../types';
import { dispatchPushNotification } from '../../../services/notificationService';

interface GoogleTasksViewProps {
  currentUser?: SystemUser | null;
}

export const GoogleTasksView: React.FC<GoogleTasksViewProps> = ({ currentUser }) => {
  const [tasks, setTasks] = useState<GoogleTask[]>(() => getStoredTasks());
  const [columns] = useState<TaskUserColumn[]>(TASK_COLUMNS);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'starred'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');

  // Inline Quick Add State per column { [columnId]: { title: string, isOpen: boolean, dueDate: string, priority: TaskPriority, category: TaskCategory } }
  const [quickAddState, setQuickAddState] = useState<Record<string, { title: string; isOpen: boolean; dueDate: string; priority: TaskPriority; category: TaskCategory }>>({});

  // Collapsed state for "Concluídas" per column
  const [collapsedCompleted, setCollapsedCompleted] = useState<Record<string, boolean>>({});

  // Task Details / Edit Modal State
  const [editingTask, setEditingTask] = useState<GoogleTask | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Global New Task Modal State
  const [isGlobalNewTaskModalOpen, setIsGlobalNewTaskModalOpen] = useState(false);
  const [globalFormData, setGlobalFormData] = useState({
    title: '',
    notes: '',
    assignedUserId: columns[0]?.id || 'prof-1',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    priority: 'media' as TaskPriority,
    category: 'rotina' as TaskCategory,
    starred: false
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateTasksList = (newTasks: GoogleTask[]) => {
    setTasks(newTasks);
    saveStoredTasks(newTasks);
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    const next = tasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    });

    updateTasksList(next);
    const target = next.find(t => t.id === taskId);
    if (target?.completed) {
      showToast(`Tarefa "${target.title}" concluída!`);
      dispatchPushNotification({
        title: 'Tarefa Concluída',
        message: `"${target.title}" foi concluída por ${target.assignedUserName}.`,
        type: 'success',
        module: 'tarefas',
        eventType: 'tarefa_concluida',
        linkTab: 'professores',
        actionLabel: 'Ver Tarefas'
      });
    }
  };

  // Toggle Star / Favorite
  const handleToggleStar = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = tasks.map(t => t.id === taskId ? { ...t, starred: !t.starred } : t);
    updateTasksList(next);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string, taskTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`Deseja remover a tarefa "${taskTitle}"?`)) {
      const next = tasks.filter(t => t.id !== taskId);
      updateTasksList(next);
      if (editingTask?.id === taskId) {
        setIsDetailModalOpen(false);
        setEditingTask(null);
      }
      showToast('Tarefa removida com sucesso.');
    }
  };

  // Inline Quick Add Handler
  const handleQuickAdd = (column: TaskUserColumn) => {
    const state = quickAddState[column.id];
    if (!state || !state.title.trim()) return;

    const newTask: GoogleTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      assignedUserId: column.id,
      assignedUserName: column.name,
      creatorUserId: currentUser ? (currentUser.id || 'admin') : 'admin',
      creatorUserName: currentUser ? currentUser.name : 'Administrador',
      title: state.title.trim(),
      notes: '',
      dueDate: state.dueDate || new Date().toISOString().split('T')[0],
      priority: state.priority || 'media',
      category: state.category || 'rotina',
      starred: false,
      completed: false,
      createdAt: new Date().toISOString()
    };

    updateTasksList([newTask, ...tasks]);
    showToast(`Tarefa atribuída a ${column.name}!`);
    dispatchPushNotification({
      title: 'Nova Tarefa Delegada',
      message: `"${state.title.trim()}" atribuída a ${column.name}.`,
      type: 'info',
      module: 'tarefas',
      eventType: 'tarefa_delegada',
      linkTab: 'professores',
      actionLabel: 'Ver Tarefas'
    });

    // Reset inline input
    setQuickAddState(prev => ({
      ...prev,
      [column.id]: {
        title: '',
        isOpen: false,
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'media',
        category: 'rotina'
      }
    }));
  };

  // Global New Task Submit
  const handleCreateGlobalTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalFormData.title.trim()) return;

    const targetUser = columns.find(c => c.id === globalFormData.assignedUserId) || columns[0];

    const newTask: GoogleTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      assignedUserId: targetUser.id,
      assignedUserName: targetUser.name,
      creatorUserId: currentUser ? (currentUser.id || 'admin') : 'admin',
      creatorUserName: currentUser ? currentUser.name : 'Administrador',
      title: globalFormData.title.trim(),
      notes: globalFormData.notes.trim(),
      dueDate: globalFormData.dueDate,
      dueTime: globalFormData.dueTime,
      priority: globalFormData.priority,
      category: globalFormData.category,
      starred: globalFormData.starred,
      completed: false,
      createdAt: new Date().toISOString()
    };

    updateTasksList([newTask, ...tasks]);
    showToast(`Tarefa criada na coluna de ${targetUser.name}!`);
    dispatchPushNotification({
      title: 'Nova Tarefa Criada',
      message: `"${globalFormData.title.trim()}" atribuída para ${targetUser.name}.`,
      type: 'info',
      module: 'tarefas',
      eventType: 'tarefa_delegada',
      linkTab: 'professores',
      actionLabel: 'Ver Tarefas'
    });
    setIsGlobalNewTaskModalOpen(false);
    setGlobalFormData({
      title: '',
      notes: '',
      assignedUserId: columns[0]?.id || 'prof-1',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '12:00',
      priority: 'media',
      category: 'rotina',
      starred: false
    });
  };

  // Edit Task Submit
  const handleSaveEditedTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const targetUser = columns.find(c => c.id === editingTask.assignedUserId);
    const updated = {
      ...editingTask,
      assignedUserName: targetUser?.name || editingTask.assignedUserName
    };

    const next = tasks.map(t => t.id === updated.id ? updated : t);
    updateTasksList(next);
    setIsDetailModalOpen(false);
    setEditingTask(null);
    showToast('Tarefa atualizada com sucesso!');
  };

  // Add Subtask
  const handleAddSubtask = () => {
    if (!editingTask || !newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    const subtasks = [...(editingTask.subtasks || []), newSub];
    const updated = { ...editingTask, subtasks };
    setEditingTask(updated);
    setNewSubtaskTitle('');

    const next = tasks.map(t => t.id === updated.id ? updated : t);
    updateTasksList(next);
  };

  // Toggle Subtask
  const handleToggleSubtask = (subId: string) => {
    if (!editingTask) return;
    const subtasks = (editingTask.subtasks || []).map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
    const updated = { ...editingTask, subtasks };
    setEditingTask(updated);

    const next = tasks.map(t => t.id === updated.id ? updated : t);
    updateTasksList(next);
  };

  // Clear completed tasks for a column
  const handleClearCompleted = (columnId: string, columnName: string) => {
    if (confirm(`Deseja limpar todas as tarefas concluídas da coluna de ${columnName}?`)) {
      const next = tasks.filter(t => !(t.assignedUserId === columnId && t.completed));
      updateTasksList(next);
      showToast(`Tarefas concluídas de ${columnName} foram limpas.`);
    }
  };

  // Filter tasks based on search & filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesNotes = t.notes?.toLowerCase().includes(q);
        const matchesUser = t.assignedUserName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNotes && !matchesUser) return false;
      }

      // Status
      if (statusFilter === 'pending' && t.completed) return false;
      if (statusFilter === 'completed' && !t.completed) return false;
      if (statusFilter === 'starred' && !t.starred) return false;

      // Category
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

      // Column
      if (selectedColumnFilter !== 'all' && t.assignedUserId !== selectedColumnFilter) return false;

      return true;
    });
  }, [tasks, searchTerm, statusFilter, categoryFilter, selectedColumnFilter]);

  // Overall statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const starredTasks = tasks.filter(t => t.starred && !t.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header Card - Google Tasks Styling */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tarefas & Rotinas da Equipe
                </h2>
                <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Google Tasks
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quadro colaborativo de afazeres: administradores e professores podem delegar e registrar tarefas em cada coluna
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsGlobalNewTaskModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Search & Quick Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Todas ({totalTasks})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Pendentes ({pendingTasks})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('starred')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'starred' ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Estreladas ({starredTasks})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'completed' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Concluídas ({completedTasks})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tarefa..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GOOGLE TASKS COLUMNS BOARD (One Column per User) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(t => t.assignedUserId === column.id);
          const pendingColumnTasks = columnTasks.filter(t => !t.completed);
          const completedColumnTasks = columnTasks.filter(t => t.completed);
          const isCompletedCollapsed = !!collapsedCompleted[column.id];

          const quickAdd = quickAddState[column.id] || {
            title: '',
            isOpen: false,
            dueDate: new Date().toISOString().split('T')[0],
            priority: 'media' as TaskPriority,
            category: 'rotina' as TaskCategory
          };

          return (
            <div
              key={column.id}
              className="bg-slate-100/90 rounded-3xl border border-slate-200 shadow-2xs p-4 flex flex-col max-h-[calc(100vh-250px)] overflow-hidden"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 px-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  {column.avatar ? (
                    <img
                      src={column.avatar}
                      alt={column.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                      {column.name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      {column.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {column.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    pendingColumnTasks.length > 0 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {pendingColumnTasks.length}
                  </span>

                  {completedColumnTasks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleClearCompleted(column.id, column.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                      title="Limpar tarefas concluídas desta coluna"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Quick Add Bar (Google Tasks style: "+ Adicionar uma tarefa") */}
              <div className="pt-3 pb-2 px-1">
                {!quickAdd.isOpen ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAddState(prev => ({
                        ...prev,
                        [column.id]: {
                          title: '',
                          isOpen: true,
                          dueDate: new Date().toISOString().split('T')[0],
                          priority: 'media',
                          category: 'rotina'
                        }
                      }));
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
                  >
                    <Plus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>Adicionar uma tarefa...</span>
                  </button>
                ) : (
                  <div className="p-3 bg-white rounded-2xl border border-blue-400 shadow-md space-y-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Título da tarefa..."
                      value={quickAdd.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuickAddState(prev => ({
                          ...prev,
                          [column.id]: { ...prev[column.id], title: val }
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickAdd(column);
                        if (e.key === 'Escape') {
                          setQuickAddState(prev => ({
                            ...prev,
                            [column.id]: { ...prev[column.id], isOpen: false }
                          }));
                        }
                      }}
                      className="w-full text-xs font-bold text-slate-900 border-none focus:outline-hidden"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        {/* Due Date */}
                        <input
                          type="date"
                          value={quickAdd.dueDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuickAddState(prev => ({
                              ...prev,
                              [column.id]: { ...prev[column.id], dueDate: val }
                            }));
                          }}
                          className="text-[10px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 cursor-pointer"
                        />

                        {/* Priority Selector */}
                        <select
                          value={quickAdd.priority}
                          onChange={(e) => {
                            const val = e.target.value as TaskPriority;
                            setQuickAddState(prev => ({
                              ...prev,
                              [column.id]: { ...prev[column.id], priority: val }
                            }));
                          }}
                          className="text-[10px] text-slate-600 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 cursor-pointer"
                        >
                          <option value="alta">Alta</option>
                          <option value="media">Média</option>
                          <option value="baixa">Normal</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setQuickAddState(prev => ({
                              ...prev,
                              [column.id]: { ...prev[column.id], isOpen: false }
                            }));
                          }}
                          className="px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-600"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(column)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Task Items Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2 p-1 custom-scrollbar">
                {/* Pending Tasks */}
                {pendingColumnTasks.length === 0 && !quickAdd.isOpen && completedColumnTasks.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Nenhuma tarefa atribuída a esta coluna.
                  </div>
                )}

                {pendingColumnTasks.map((task) => {
                  const cat = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.geral;
                  const prio = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.media;
                  const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setEditingTask(task);
                        setIsDetailModalOpen(true);
                      }}
                      className={`p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-2 border-l-4 ${prio.border}`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Circular Google Tasks Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTask(task.id);
                          }}
                          className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                          title="Concluir tarefa"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-30 transition-opacity" />
                        </button>

                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-900 block leading-tight">
                            {task.title}
                          </span>

                          {task.notes && (
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {task.notes}
                            </p>
                          )}
                        </div>

                        {/* Star Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleStar(task.id, e)}
                          className={`p-1 rounded-lg transition-colors shrink-0 ${
                            task.starred ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                          }`}
                          title={task.starred ? 'Desmarcar estrela' : 'Marcar como importante'}
                        >
                          <Star className={`w-3.5 h-3.5 ${task.starred ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Subtasks Progress if present */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium pl-7">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>
                            {task.subtasks.filter(s => s.completed).length} de {task.subtasks.length} itens
                          </span>
                        </div>
                      )}

                      {/* Badges / Due Date */}
                      <div className="flex flex-wrap items-center gap-1.5 pl-7 pt-0.5">
                        {task.dueDate && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isOverdue
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            <CalendarIcon className="w-2.5 h-2.5" />
                            <span>{task.dueDate}</span>
                          </span>
                        )}

                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${cat.bg} ${cat.text}`}>
                          {cat.label}
                        </span>

                        {task.creatorUserName && task.creatorUserName !== task.assignedUserName && (
                          <span className="text-[9px] text-slate-400 ml-auto truncate" title={`Criada por ${task.creatorUserName}`}>
                            Por: {task.creatorUserName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Collapsible Completed Section (Google Tasks signature) */}
                {completedColumnTasks.length > 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCollapsedCompleted(prev => ({
                          ...prev,
                          [column.id]: !prev[column.id]
                        }));
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-200/60 text-slate-500 text-xs font-bold transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        {isCompletedCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        <span>Concluídas ({completedColumnTasks.length})</span>
                      </div>
                    </button>

                    {!isCompletedCollapsed && (
                      <div className="space-y-1.5 pt-1.5">
                        {completedColumnTasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              setEditingTask(task);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-3 rounded-2xl bg-white/70 border border-slate-200/50 hover:bg-white text-slate-400 flex items-start gap-2.5 transition-all cursor-pointer opacity-75 hover:opacity-100"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTask(task.id);
                              }}
                              className="mt-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
                              title="Reabrir tarefa"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </button>

                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium line-through block truncate">
                                {task.title}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleDeleteTask(task.id, task.title, e)}
                              className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                              title="Excluir"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: EDITAR TAREFA / DETALHES (Google Tasks Style) */}
      {isDetailModalOpen && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleTask(editingTask.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    editingTask.completed
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 hover:border-blue-600'
                  }`}
                  title={editingTask.completed ? 'Reabrir' : 'Concluir'}
                >
                  {editingTask.completed && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {editingTask.completed ? 'Tarefa Concluída' : 'Em Andamento'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleStar(editingTask.id, e)}
                  className={`p-1.5 rounded-xl transition-colors ${
                    editingTask.starred ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title="Estrela"
                >
                  <Star className={`w-4 h-4 ${editingTask.starred ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(editingTask.id, editingTask.title)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Excluir Tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setEditingTask(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEditedTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Tarefa</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-sm text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detalhes e Observações</label>
                <textarea
                  rows={3}
                  value={editingTask.notes || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                  placeholder="Adicione detalhes, instruções operacionais ou notas..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-slate-700 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coluna / Responsável</label>
                  <select
                    value={editingTask.assignedUserId}
                    onChange={(e) => setEditingTask({ ...editingTask, assignedUserId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    <option value="alta">Prioridade Alta</option>
                    <option value="media">Prioridade Média</option>
                    <option value="baixa">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoria de Trabalho</label>
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value as TaskCategory })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800 bg-white"
                >
                  <option value="rotina">Rotina de Treinos</option>
                  <option value="manutencao">Manutenção de Equipamentos</option>
                  <option value="aula">Aula / Grade Esportiva</option>
                  <option value="avaliacao">Avaliação Biomecânica</option>
                  <option value="administrativo">Administrativo / Recepção</option>
                  <option value="geral">Geral</option>
                </select>
              </div>

              {/* Subtasks Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Sub-tarefas / Checklist</label>
                  <span className="text-[11px] text-slate-400">
                    {(editingTask.subtasks || []).filter(s => s.completed).length} de {(editingTask.subtasks || []).length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {(editingTask.subtasks || []).map((sub) => (
                    <div key={sub.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-xs flex-1 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Subtask Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Adicionar sub-tarefa..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR NOVA TAREFA GLOBAL */}
      {isGlobalNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-blue-600" />
                <span>Nova Tarefa para a Equipe</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsGlobalNewTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGlobalTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Tarefa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Verificar calibragem das bolas do campo 1"
                  value={globalFormData.title}
                  onChange={(e) => setGlobalFormData({ ...globalFormData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Atribuir à Coluna do Usuário</label>
                <select
                  value={globalFormData.assignedUserId}
                  onChange={(e) => setGlobalFormData({ ...globalFormData, assignedUserId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-800 bg-white"
                >
                  {columns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detalhes e Orientações</label>
                <textarea
                  rows={2}
                  value={globalFormData.notes}
                  onChange={(e) => setGlobalFormData({ ...globalFormData, notes: e.target.value })}
                  placeholder="Instruções adicionais para quem for realizar..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-slate-700 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data Limite</label>
                  <input
                    type="date"
                    required
                    value={globalFormData.dueDate}
                    onChange={(e) => setGlobalFormData({ ...globalFormData, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={globalFormData.priority}
                    onChange={(e) => setGlobalFormData({ ...globalFormData, priority: e.target.value as TaskPriority })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={globalFormData.category}
                  onChange={(e) => setGlobalFormData({ ...globalFormData, category: e.target.value as TaskCategory })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800 bg-white"
                >
                  <option value="rotina">Rotina de Treinos</option>
                  <option value="manutencao">Manutenção de Equipamentos</option>
                  <option value="aula">Aula / Grade Esportiva</option>
                  <option value="avaliacao">Avaliação Biomecânica</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="geral">Geral</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                Cadastrar Tarefa na Coluna
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
