
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Curso } from '@/types';

interface CursoFormProps {
  curso?: Curso | null;
  onSave: (curso: Curso) => void;
  onCancel: () => void;
}

const CursoForm = ({ curso, onSave, onCancel }: CursoFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  });

  useEffect(() => {
    if (curso) {
      setFormData({
        nome: curso.nome,
        descricao: curso.descricao
      });
    }
  }, [curso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cursoData: Curso = {
      id: curso?.id || Date.now().toString(),
      nome: formData.nome,
      descricao: formData.descricao
    };

    onSave(cursoData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{curso ? 'Editar Curso' : 'Novo Curso'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Curso *</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Ex: Engenharia de Software"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição do curso..."
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {curso ? 'Atualizar' : 'Criar'} Curso
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CursoForm;
