/**
 * GL PRO FIT - Student Service (Fase 2.1)
 * Repositório de Alunos com suporte híbrido (Nuvem / LocalStorage Fallback)
 * e listener reativo em tempo real.
 */

import { Student } from '../types';
import { StudentEntity } from '../types/database';
import { INITIAL_STUDENTS } from '../mockData';
import { USE_REAL_DATABASE } from '../lib/db';

const STORAGE_KEY = 'vbsport_students';

// Evento customizado para sincronização de estado reativo no navegador
const STUDENT_UPDATED_EVENT = 'gl_pro_fit_students_updated';

class StudentService {
  /**
   * Obtém a lista atual de alunos (com fallback automático para LocalStorage/Mock)
   */
  async getAll(): Promise<Student[]> {
    if (!USE_REAL_DATABASE) {
      return this.getFromLocalStorage();
    }

    try {
      // Se conectado ao banco real em nuvem, pode ser chamado aqui
      // Mantendo fallback caso a rede oscile
      return this.getFromLocalStorage();
    } catch (error) {
      console.warn('[studentService] Falha ao consultar nuvem. Usando fallback LocalStorage:', error);
      return this.getFromLocalStorage();
    }
  }

  /**
   * Busca aluno por ID
   */
  async getById(id: string): Promise<Student | null> {
    const list = await this.getAll();
    return list.find(s => s.id === id) || null;
  }

  /**
   * Busca aluno por número de telefone / WhatsApp
   */
  async getByPhone(phone: string): Promise<Student | null> {
    const list = await this.getAll();
    const cleanTarget = phone.replace(/\D/g, '');
    return list.find(s => {
      const sPhone = s.phone.replace(/\D/g, '');
      return (cleanTarget && sPhone.includes(cleanTarget)) || (cleanTarget && cleanTarget.includes(sPhone));
    }) || null;
  }

  /**
   * Salva ou atualiza um aluno
   */
  async save(student: StudentEntity): Promise<Student> {
    const now = new Date().toISOString();
    const studentToSave: StudentEntity = {
      ...student,
      updatedAt: now,
      createdAt: student.createdAt || now,
    };

    const currentList = this.getFromLocalStorage();
    const existingIndex = currentList.findIndex(s => s.id === studentToSave.id);

    let updatedList: Student[];
    if (existingIndex >= 0) {
      updatedList = [...currentList];
      updatedList[existingIndex] = studentToSave;
    } else {
      updatedList = [studentToSave, ...currentList];
    }

    this.saveToLocalStorage(updatedList);
    this.notifySubscribers(updatedList);

    import('./firebaseDbService').then(({ saveDocToFirestore }) => {
      saveDocToFirestore('students', studentToSave);
    }).catch(err => {
      console.warn('Sync student to firestore skipped:', err);
    });

    return studentToSave;
  }

  /**
   * Exclui um aluno
   */
  async delete(id: string): Promise<boolean> {
    const currentList = this.getFromLocalStorage();
    const filtered = currentList.filter(s => s.id !== id);

    this.saveToLocalStorage(filtered);
    this.notifySubscribers(filtered);

    import('./firebaseDbService').then(({ deleteDocFromFirestore }) => {
      deleteDocFromFirestore('students', id);
    }).catch(err => {
      console.warn('Delete student from firestore skipped:', err);
    });

    return true;
  }

  /**
   * Atualiza status de matrícula do aluno
   */
  async updateStatus(id: string, status: Student['status']): Promise<Student | null> {
    const student = await this.getById(id);
    if (!student) return null;

    return this.save({
      ...student,
      status
    });
  }

  /**
   * Assina atualizações em tempo real (Real-time listener)
   */
  subscribe(callback: (students: Student[]) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Student[]>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      } else {
        this.getAll().then(callback);
      }
    };

    window.addEventListener(STUDENT_UPDATED_EVENT, handler);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.getAll().then(callback);
      }
    });

    // Emissão inicial imediata
    this.getAll().then(callback);

    // Retorna função para cancelar assinatura (unsubscribe)
    return () => {
      window.removeEventListener(STUDENT_UPDATED_EVENT, handler);
    };
  }

  // ==========================================
  // HELPERS PRIVADOS DE PERSISTÊNCIA LOCAL
  // ==========================================
  private getFromLocalStorage(): Student[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('[studentService] Erro ao carregar LocalStorage:', e);
    }
    return INITIAL_STUDENTS;
  }

  private saveToLocalStorage(data: Student[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[studentService] Erro ao gravar LocalStorage:', e);
    }
  }

  private notifySubscribers(data: Student[]): void {
    const event = new CustomEvent(STUDENT_UPDATED_EVENT, { detail: data });
    window.dispatchEvent(event);
  }
}

export const studentService = new StudentService();
