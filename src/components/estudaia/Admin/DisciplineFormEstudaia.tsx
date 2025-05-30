
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { createDisciplina, updateDisciplina, type Disciplina, type Course } from '@/services/supabase'

interface DisciplineFormEstudaiaProps {
  discipline?: Disciplina | null
  courses: Course[]
  onClose: () => void
}

export function DisciplineFormEstudaia({ discipline, courses, onClose }: DisciplineFormEstudaiaProps) {
  const [formData, setFormData] = useState({
    nome: '',
    curso_id: '',
    google_drive_folder_id: '',
    descricao_breve: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (discipline) {
      setFormData({
        nome: discipline.nome,
        curso_id: discipline.curso_id,
        google_drive_folder_id: discipline.google_drive_folder_id,
        descricao_breve: discipline.descricao_breve || ''
      })
    } else {
      setFormData({
        nome: '',
        curso_id: '',
        google_drive_folder_id: '',
        descricao_breve: ''
      })
    }
  }, [discipline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.curso_id || !formData.google_drive_folder_id.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome, curso e Google Drive Folder ID são obrigatórios',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      
      if (discipline) {
        await updateDisciplina(discipline.id, formData)
        toast({
          title: 'Sucesso',
          description: 'Disciplina atualizada com sucesso'
        })
      } else {
        await createDisciplina(formData)
        toast({
          title: 'Sucesso',
          description: 'Disciplina criada com sucesso'
        })
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving discipline:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao salvar disciplina',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{discipline ? 'Editar Disciplina' : 'Nova Disciplina'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Disciplina *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome da disciplina"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="curso_id">Curso *</Label>
            <Select
              value={formData.curso_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, curso_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="google_drive_folder_id">Google Drive Folder ID *</Label>
            <Input
              id="google_drive_folder_id"
              value={formData.google_drive_folder_id}
              onChange={(e) => setFormData(prev => ({ ...prev, google_drive_folder_id: e.target.value }))}
              placeholder="ID da pasta do Google Drive"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descricao_breve">Descrição Breve</Label>
            <Textarea
              id="descricao_breve"
              value={formData.descricao_breve}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao_breve: e.target.value }))}
              placeholder="Digite uma descrição breve da disciplina"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (discipline ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
