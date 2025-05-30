
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { createCourse, updateCourse, type Course } from '@/services/supabase'

interface CourseFormEstudaiaProps {
  course?: Course | null
  onClose: () => void
}

export function CourseFormEstudaia({ course, onClose }: CourseFormEstudaiaProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course) {
      setFormData({
        nome: course.nome,
        descricao: course.descricao || ''
      })
    } else {
      setFormData({
        nome: '',
        descricao: ''
      })
    }
  }, [course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do curso é obrigatório',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      
      if (course) {
        await updateCourse(course.id, formData)
        toast({
          title: 'Sucesso',
          description: 'Curso atualizado com sucesso'
        })
      } else {
        await createCourse(formData)
        toast({
          title: 'Sucesso',
          description: 'Curso criado com sucesso'
        })
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving course:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao salvar curso',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course ? 'Editar Curso' : 'Novo Curso'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Curso *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Digite o nome do curso"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Digite uma descrição para o curso"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (course ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
