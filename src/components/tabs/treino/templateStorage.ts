import { WorkoutTemplate } from '../../../types';
import { WORKOUT_TEMPLATES } from './exerciseDatabase';

const STORAGE_KEY = 'gl_pro_fit_custom_workout_templates';

// Initial sample custom template demonstrating the professional's customized workout routine
export const DEFAULT_INITIAL_CUSTOM_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-custom-densidade-marinho',
    title: 'Protocolo Personalizado - Força & Densidade (Método GL)',
    category: 'Força',
    level: 'Avançado',
    objective: 'Desenvolvimento de força máxima, densidade muscular e simetria postural',
    description: 'Protocolo de alta intensidade desenvolvido pelo Prof. Gianluca Marinho com ênfase em exercícios compostos livres e técnicas de pausa isométrica.',
    isCustom: true,
    author: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
    createdAt: '2026-09-24',
    splits: [
      {
        name: 'Treino A - Cadeia Anterior & Tríceps (Upper Heavy)',
        exercises: [
          { id: 'ct1', name: 'Supino Reto com Barra Olímpica', muscleGroup: 'Peito', sets: 5, reps: '5-6', weightKg: 85, restSec: 120, equipment: 'Barra', method: 'Pirâmide Crescente', notes: 'Foco em força pura e controle escapular' },
          { id: 'ct2', name: 'Supino Inclinado com Halteres', muscleGroup: 'Peito', sets: 4, reps: '8-10', weightKg: 28, restSec: 75, equipment: 'Halteres', method: 'Tradicional' },
          { id: 'ct3', name: 'Desenvolvimento Militar com Barra em Pé', muscleGroup: 'Ombros', sets: 4, reps: '6-8', weightKg: 40, restSec: 90, equipment: 'Barra', method: 'Tradicional' },
          { id: 'ct4', name: 'Elevação Lateral na Polia Baixa', muscleGroup: 'Ombros', sets: 4, reps: '12-15', weightKg: 10, restSec: 45, equipment: 'Cabos/Polia', method: 'Drop-set' },
          { id: 'ct5', name: 'Tríceps Testa com Barra W no Banco Reto', muscleGroup: 'Braços', sets: 4, reps: '10-12', weightKg: 30, restSec: 60, equipment: 'Barra', method: 'Tradicional' }
        ]
      },
      {
        name: 'Treino B - Cadeia Posterior & Bíceps (Pull Heavy)',
        exercises: [
          { id: 'ct6', name: 'Levantamento Terra Clássico (Deadlift)', muscleGroup: 'Costas', sets: 4, reps: '5', weightKg: 140, restSec: 150, equipment: 'Barra', method: 'Tradicional', notes: 'Manter a coluna neutra e ativação dorsal' },
          { id: 'ct7', name: 'Barra Fixa com Pegada Neutra', muscleGroup: 'Costas', sets: 4, reps: '8-10', weightKg: 0, restSec: 90, equipment: 'Peso Corporal', method: 'Tradicional' },
          { id: 'ct8', name: 'Remada Curvada com Pegada Supinada', muscleGroup: 'Costas', sets: 4, reps: '8', weightKg: 65, restSec: 75, equipment: 'Barra', method: 'Tradicional' },
          { id: 'ct9', name: 'Crucifixo Inverso no Cabo', muscleGroup: 'Ombros', sets: 3, reps: '15', weightKg: 12, restSec: 45, equipment: 'Cabos/Polia', method: 'Isometria' },
          { id: 'ct10', name: 'Rosca Direta no Banco Scott com Barra W', muscleGroup: 'Braços', sets: 4, reps: '10', weightKg: 28, restSec: 60, equipment: 'Barra', method: 'Ponto Zero' }
        ]
      },
      {
        name: 'Treino C - Membros Inferiores Completos (Lower Heavy)',
        exercises: [
          { id: 'ct11', name: 'Agachamento Livre com Barra Olímpica', muscleGroup: 'Pernas', sets: 5, reps: '6-8', weightKg: 95, restSec: 120, equipment: 'Barra', method: 'Tradicional', notes: 'Profundidade paralela completa' },
          { id: 'ct12', name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 4, reps: '10-12', weightKg: 220, restSec: 90, equipment: 'Máquina', method: 'Drop-set' },
          { id: 'ct13', name: 'Stiff com Barra Olímpica', muscleGroup: 'Pernas', sets: 4, reps: '10', weightKg: 60, restSec: 75, equipment: 'Barra', method: 'Tradicional' },
          { id: 'ct14', name: 'Cadeira Extensora', muscleGroup: 'Pernas', sets: 3, reps: '12-15', weightKg: 55, restSec: 45, equipment: 'Máquina', method: 'Rest-pause' },
          { id: 'ct15', name: 'Elevação de Panturrilha em Pé no Smith', muscleGroup: 'Pernas', sets: 5, reps: '15', weightKg: 70, restSec: 45, equipment: 'Smith', method: 'Isometria', notes: 'Pausa de 2s no ponto de pico' }
        ]
      }
    ]
  }
];

export function getCustomTemplates(): WorkoutTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_CUSTOM_TEMPLATES));
      return DEFAULT_INITIAL_CUSTOM_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return DEFAULT_INITIAL_CUSTOM_TEMPLATES;
  } catch (err) {
    console.error('Error loading custom templates:', err);
    return DEFAULT_INITIAL_CUSTOM_TEMPLATES;
  }
}

export function saveCustomTemplate(template: WorkoutTemplate): WorkoutTemplate[] {
  try {
    const current = getCustomTemplates();
    const existingIndex = current.findIndex(t => t.id === template.id);
    let updated: WorkoutTemplate[];

    const preparedTemplate: WorkoutTemplate = {
      ...template,
      isCustom: true,
      author: template.author || 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      createdAt: template.createdAt || new Date().toISOString().slice(0, 10)
    };

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = preparedTemplate;
    } else {
      updated = [preparedTemplate, ...current];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gl_pro_fit_templates_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error saving custom template:', err);
    return getCustomTemplates();
  }
}

export function deleteCustomTemplate(templateId: string): WorkoutTemplate[] {
  try {
    const current = getCustomTemplates();
    const updated = current.filter(t => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('gl_pro_fit_templates_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Error deleting custom template:', err);
    return getCustomTemplates();
  }
}

export function getAllWorkoutTemplates(customTemplatesList?: WorkoutTemplate[]): WorkoutTemplate[] {
  const custom = customTemplatesList || getCustomTemplates();
  // Ensure platform templates have isCustom: false
  const platform = WORKOUT_TEMPLATES.map(tpl => ({ ...tpl, isCustom: false }));
  return [...custom, ...platform];
}
