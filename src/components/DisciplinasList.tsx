
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import { Disciplina, Curso } from '@/types';

interface DisciplinasListProps {
  disciplinas: Disciplina[];
  cursos: Curso[];
  onEdit: (disciplina: Disciplina) => void;
  onDelete: (id: string) => void;
}

const DisciplinasList = ({ disciplinas, cursos, onEdit, onDelete }: DisciplinasListProps) => {
  const getCursoNome = (cursoId: string) => {
    const curso = cursos.find(c => c.id === cursoId);
    return curso?.nome || 'Curso não encontrado';
  };

  if (disciplinas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Nenhuma disciplina cadastrada ainda.</p>
        <p className="text-sm">Clique em "Nova Disciplina" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {disciplinas.map((disciplina) => (
        <Card key={disciplina.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{disciplina.nome}</CardTitle>
              <Badge variant="outline">
                {getCursoNome(disciplina.cursoId)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                {disciplina.descricaoBreve || 'Sem descrição'}
              </p>
              
              <div className="flex items-center text-xs text-gray-500">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="font-mono">
                  {disciplina.googleDriveFolderId}
                </span>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(disciplina)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir a disciplina "${disciplina.nome}"?`)) {
                      onDelete(disciplina.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DisciplinasList;
