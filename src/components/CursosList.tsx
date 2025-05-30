
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Book } from 'lucide-react';
import { Curso } from '@/types';
import { storageUtils } from '@/utils/storage';

interface CursosListProps {
  cursos: Curso[];
  onEdit: (curso: Curso) => void;
  onDelete: (id: string) => void;
}

const CursosList = ({ cursos, onEdit, onDelete }: CursosListProps) => {
  if (cursos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Book className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Nenhum curso cadastrado ainda.</p>
        <p className="text-sm">Clique em "Novo Curso" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cursos.map((curso) => {
        const disciplinasCount = storageUtils.getDisciplinasByCurso(curso.id).length;
        
        return (
          <Card key={curso.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{curso.nome}</CardTitle>
                <Badge variant="secondary">
                  {disciplinasCount} {disciplinasCount === 1 ? 'disciplina' : 'disciplinas'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {curso.descricao || 'Sem descrição'}
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(curso)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir o curso "${curso.nome}"? Todas as disciplinas relacionadas também serão excluídas.`)) {
                      onDelete(curso.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CursosList;
