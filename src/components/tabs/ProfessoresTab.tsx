import React from 'react';
import { 
  Clock, 
  CheckSquare, 
  Calendar, 
  Sparkles, 
  FileSpreadsheet, 
  UserCheck, 
  ShieldCheck, 
  Layers, 
  Bell, 
  ArrowRight,
  ClipboardList,
  CalendarCheck,
  Timer
} from 'lucide-react';
import { ProfessoresSubTab, SystemUser } from '../../types';
import { FolhaPontoView } from './professores/FolhaPontoView';
import { GoogleTasksView } from './professores/GoogleTasksView';
import { AgendaProfessorView } from './professores/AgendaProfessorView';

interface ProfessoresTabProps {
  subTab?: ProfessoresSubTab;
  onSubTabChange?: (subTab: ProfessoresSubTab) => void;
  currentUser?: SystemUser | null;
}

export const ProfessoresTab: React.FC<ProfessoresTabProps> = ({
  subTab = 'folha_ponto',
  onSubTabChange,
  currentUser
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* SUBTAB 1: FOLHA DE PONTO */}
      {subTab === 'folha_ponto' && (
        <FolhaPontoView currentUser={currentUser} />
      )}

      {/* SUBTAB 2: TAREFAS (GOOGLE TASKS STYLE) */}
      {subTab === 'tarefas' && (
        <GoogleTasksView currentUser={currentUser} />
      )}

      {/* SUBTAB 3: AGENDA (CALENDÁRIO INTEGRADO DO USUÁRIO) */}
      {subTab === 'agenda' && (
        <AgendaProfessorView currentUser={currentUser} />
      )}
    </div>
  );
};
