import { useState } from "react";
import { Plus, Search, BookOpen, Trash2, Edit3, MoreVertical, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data - você conectará com Firebase
const mockSubjects = [
  {
    id: 1,
    name: "Matemática",
    description: "Álgebra, geometria e cálculo",
    color: "bg-blue-500",
    tasksCount: 8,
    completedTasks: 3,
    teacher: "Prof. Silva"
  },
  {
    id: 2,
    name: "História",
    description: "História do Brasil e mundial",
    color: "bg-green-500",
    tasksCount: 5,
    completedTasks: 4,
    teacher: "Prof. Santos"
  },
  {
    id: 3,
    name: "Física",
    description: "Mecânica e eletromagnetismo",
    color: "bg-purple-500",
    tasksCount: 6,
    completedTasks: 2,
    teacher: "Prof. Costa"
  },
  {
    id: 4,
    name: "Química",
    description: "Química orgânica e inorgânica",
    color: "bg-orange-500",
    tasksCount: 4,
    completedTasks: 1,
    teacher: "Prof. Lima"
  }
];

const Subjects = () => {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teacher: "",
    color: "bg-blue-500"
  });
  const { toast } = useToast();

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-yellow-500"
  ];

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSubject) {
      // Editar disciplina existente
      setSubjects(prev => prev.map(subject =>
        subject.id === editingSubject.id
          ? { ...subject, ...formData }
          : subject
      ));
      toast({
        title: "Disciplina atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criar nova disciplina
      const newSubject = {
        id: Date.now(),
        ...formData,
        tasksCount: 0,
        completedTasks: 0
      };
      setSubjects(prev => [...prev, newSubject]);
      toast({
        title: "Disciplina criada!",
        description: "Nova disciplina adicionada com sucesso.",
      });
    }

    setIsDialogOpen(false);
    setEditingSubject(null);
    setFormData({ name: "", description: "", teacher: "", color: "bg-blue-500" });
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      teacher: subject.teacher,
      color: subject.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (subjectId: number) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
    toast({
      title: "Disciplina removida",
      description: "A disciplina foi removida com sucesso.",
      variant: "destructive",
    });
  };

  const openDialog = () => {
    setEditingSubject(null);
    setFormData({ name: "", description: "", teacher: "", color: "bg-blue-500" });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-section border-b border-border/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gradient mb-2 flex items-center gap-3">
                <GraduationCap className="w-8 h-8" />
                Disciplinas
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas matérias e organize seus estudos
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary" onClick={openDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Disciplina
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingSubject ? "Editar Disciplina" : "Nova Disciplina"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da disciplina</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Matemática"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o conteúdo da disciplina"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Professor</Label>
                    <Input
                      id="teacher"
                      value={formData.teacher}
                      onChange={(e) => setFormData(prev => ({ ...prev, teacher: e.target.value }))}
                      placeholder="Nome do professor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor da disciplina</Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-full ${color} border-2 transition-all ${
                            formData.color === color ? "border-foreground scale-110" : "border-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="btn-primary">
                      {editingSubject ? "Salvar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar disciplinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const completionPercentage = subject.tasksCount > 0 ? (subject.completedTasks / subject.tasksCount) * 100 : 0;
            
            return (
              <Card key={subject.id} className="card-elevated group hover:scale-105 transition-all duration-300">
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center`}>
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        {subject.teacher && (
                          <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(subject)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(subject.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {subject.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progresso</span>
                      <span className="text-sm font-medium">{Math.round(completionPercentage)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-secondary to-secondary-light h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <Badge variant="secondary">
                        {subject.tasksCount} tarefas
                      </Badge>
                      <span className="text-muted-foreground">
                        {subject.completedTasks} concluídas
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma disciplina encontrada</h3>
            <p className="text-muted-foreground">
              Tente buscar com outros termos ou adicione uma nova disciplina.
            </p>
          </div>
        )}

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhuma disciplina cadastrada</h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando suas primeira disciplina para organizar seus estudos.
            </p>
            <Button className="btn-primary" onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeira Disciplina
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;