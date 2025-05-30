
import { Curso, Disciplina } from '@/types';

export const storageUtils = {
  // Cursos
  getCursos: (): Curso[] => {
    return JSON.parse(localStorage.getItem('cursos') || '[]');
  },

  saveCurso: (curso: Curso): void => {
    const cursos = storageUtils.getCursos();
    const existingIndex = cursos.findIndex(c => c.id === curso.id);
    
    if (existingIndex >= 0) {
      cursos[existingIndex] = curso;
    } else {
      cursos.push(curso);
    }
    
    localStorage.setItem('cursos', JSON.stringify(cursos));
  },

  deleteCurso: (id: string): void => {
    const cursos = storageUtils.getCursos().filter(c => c.id !== id);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    
    // Também deletar disciplinas relacionadas
    const disciplinas = storageUtils.getDisciplinas().filter(d => d.cursoId !== id);
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
  },

  // Disciplinas
  getDisciplinas: (): Disciplina[] => {
    return JSON.parse(localStorage.getItem('disciplinas') || '[]');
  },

  saveDisciplina: (disciplina: Disciplina): void => {
    const disciplinas = storageUtils.getDisciplinas();
    const existingIndex = disciplinas.findIndex(d => d.id === disciplina.id);
    
    if (existingIndex >= 0) {
      disciplinas[existingIndex] = disciplina;
    } else {
      disciplinas.push(disciplina);
    }
    
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
  },

  deleteDisciplina: (id: string): void => {
    const disciplinas = storageUtils.getDisciplinas().filter(d => d.id !== id);
    localStorage.setItem('disciplinas', JSON.stringify(disciplinas));
  },

  getDisciplinasByCurso: (cursoId: string): Disciplina[] => {
    return storageUtils.getDisciplinas().filter(d => d.cursoId === cursoId);
  }
};
