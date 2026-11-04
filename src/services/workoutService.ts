/**
 * GL PRO FIT - Workout & Prescription Service (Fase 2.1)
 * Gerenciamento de treinos, fichas de exercícios (A/B/C) e controle de carga
 * no padrão do avaliaçaofisica.app.
 */

import { WorkoutPlan, ExerciseCatalogItem, ExerciseLoadLog } from '../types';
import { INITIAL_WORKOUTS } from '../mockData';
import { EXERCISE_CATALOG, INITIAL_LOAD_LOGS } from '../components/tabs/treino/exerciseDatabase';
import { USE_REAL_DATABASE } from '../lib/db';

const WORKOUTS_KEY = 'vbsport_workouts';
const EXERCISES_KEY = 'vbsport_exercises_catalog';
const LOAD_HISTORY_KEY = 'vbsport_load_history';

const WORKOUTS_UPDATED_EVENT = 'gl_pro_fit_workouts_updated';

class WorkoutService {
  /**
   * Retorna todos os planos de treino cadastrados
   */
  async getAllWorkouts(): Promise<WorkoutPlan[]> {
    try {
      const stored = localStorage.getItem(WORKOUTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('[workoutService] Erro ao ler treinos:', e);
    }
    return INITIAL_WORKOUTS;
  }

  /**
   * Retorna os treinos de um aluno específico
   */
  async getWorkoutsByStudentId(studentId: string): Promise<WorkoutPlan[]> {
    const all = await this.getAllWorkouts();
    return all.filter(w => w.studentId === studentId);
  }

  /**
   * Retorna o catálogo global de exercícios
   */
  async getExerciseCatalog(): Promise<ExerciseCatalogItem[]> {
    try {
      const stored = localStorage.getItem(EXERCISES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('[workoutService] Erro ao ler catálogo de exercícios:', e);
    }
    return EXERCISE_CATALOG;
  }

  /**
   * Salva ou atualiza um plano de treino
   */
  async saveWorkout(workout: WorkoutPlan): Promise<WorkoutPlan> {
    const all = await this.getAllWorkouts();
    const index = all.findIndex(w => w.id === workout.id);

    let updated: WorkoutPlan[];
    if (index >= 0) {
      updated = [...all];
      updated[index] = workout;
    } else {
      updated = [workout, ...all];
    }

    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(updated));
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('workouts', updated);
    }).catch(err => {
      console.warn('Sync workouts to firestore skipped:', err);
    });

    this.notifyUpdate();
    return workout;
  }

  /**
   * Registra histórico de carga para um exercício (Progressão de Carga)
   */
  async recordLoadProgress(record: Omit<ExerciseLoadLog, 'id'>): Promise<ExerciseLoadLog> {
    const history = this.getLoadHistory();
    const newRecord: ExerciseLoadLog = {
      ...record,
      id: `load-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
    };

    const updated = [newRecord, ...history];
    localStorage.setItem(LOAD_HISTORY_KEY, JSON.stringify(updated));

    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('exercise_load_history', [newRecord]);
    }).catch(err => {
      console.warn('Sync exercise load history to firestore skipped:', err);
    });

    return newRecord;
  }

  /**
   * Obtém o histórico de carga de um aluno
   */
  getLoadHistory(studentId?: string, exerciseName?: string): ExerciseLoadLog[] {
    try {
      const stored = localStorage.getItem(LOAD_HISTORY_KEY);
      if (stored) {
        const parsed: ExerciseLoadLog[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => {
            if (studentId && item.studentId !== studentId) return false;
            if (exerciseName && item.exerciseName.toLowerCase() !== exerciseName.toLowerCase()) return false;
            return true;
          });
        }
      }
    } catch (e) {
      console.error('[workoutService] Erro ao ler histórico de carga:', e);
    }
    
    // Fallback: extrai do dicionário INITIAL_LOAD_LOGS
    const flattenedLogs = Object.values(INITIAL_LOAD_LOGS).flat() as ExerciseLoadLog[];
    return flattenedLogs.filter(item => {
      if (studentId && item.studentId !== studentId) return false;
      if (exerciseName && item.exerciseName.toLowerCase() !== exerciseName.toLowerCase()) return false;
      return true;
    });
  }

  /**
   * Assina atualizações de treinos em tempo real
   */
  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(WORKOUTS_UPDATED_EVENT, handler);
    return () => {
      window.removeEventListener(WORKOUTS_UPDATED_EVENT, handler);
    };
  }

  private notifyUpdate(): void {
    window.dispatchEvent(new CustomEvent(WORKOUTS_UPDATED_EVENT));
  }
}

export const workoutService = new WorkoutService();
