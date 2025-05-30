
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Disciplina, Curso } from '@/types';

interface DisciplinaFormProps {
  disciplina?: Disciplina | null;
  cursos: Curso[];
  onSave: (disciplina: Disciplina) => void;
  onCancel: () => void;
}

const DisciplinaForm = ({ disciplina, cursos, onSave, onCancel }: DisciplinaFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    cursoId: '',
    googleDriveFolderId: '',
    descricaoBreve: ''
  });

  useEffect(() => {
    if (disciplina) {
      setFormData({
        nome: disciplina.nome,
        cursoId: disciplina.cursoId,
        googleDriveFolderId: disciplina.googleDriveFolderId,
        descricaoBreve: disciplina.descricaoBreve
      });
    }
  }, [disciplina]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const disciplinaData: Disciplina = {
      id: disciplina?.id || Date.now().toString(),
      nome: formData.nome,
      cursoId: formData.cursoId,
      googleDriveFolderId: formData.googleDriveFolderId,
      descricaoBreve: formData.descricaoBreve
    };

    onSave(disciplinaData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{disciplina ? 'Editar Disciplina' : 'Nova Disciplina'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Disciplina *</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Ex: Algoritmos e Estruturas de Dados"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="curso">Curso *</Label>
            <Select 
              value={formData.cursoId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, cursoId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleDriveFolderId">ID da Pasta do Google Drive *</Label>
            <Input
              id="googleDriveFolderId"
              type="text"
              placeholder="Ex: 1a2b3c4d5e6f7g8h9i0j"
              value={formData.googleDriveFolderId}
              onChange={(e) => setFormData(prev => ({ ...prev, googleDriveFolderId: e.target.value }))}
              required
            />
            <p className="text-xs text-gray-500">
              ID da pasta no Google Drive que contém os materiais desta disciplina
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricaoBreve">Descrição Breve</Label>
            <Textarea
              id="descricaoBreve"
              placeholder="Breve descrição da disciplina..."
              value={formData.descricaoBreve}
              onChange={(e) => setFormData(prev => ({ ...prev, descricaoBreve: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {disciplina ? 'Atualizar' : 'Criar'} Disciplina
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DisciplinaForm;
