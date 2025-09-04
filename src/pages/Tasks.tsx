import { useState } from "react";
import { Plus, Search, Calendar, Clock, CheckCircle2, Circle, Filter, BookOpen, AlertCircle, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockTasks = [
  {
    id: 1,
    title: "Prova de Matemática",
    description: "Estudar capítulos 1-5 do livro de álgebra",
    subject: "Matemática",
    subjectId: 1,
    dueDate: new Date("2024-01-20"),
    priority: "high",
    completed: false,
    createdAt: new Date("2024-01-10")
  },
  {
    id: 2,
    title: "Trabalho de História",
    description: "Pesquisa sobre a Revolução Industrial",
    subject: "História",
    subjectId: 2,
    dueDate: new Date("2024-01-25"),
    priority: "medium",
    completed: false,
    createdAt: new Date("2024-01-12")
  },
  {
    id: 3,
    title: "Lista de Exercícios",
    description: "Resolver exercícios de mecânica clássica",
    subject: "Física",
    subjectId: 3,
    dueDate: new Date("2024-01-18"),
    priority: "low",
    completed: true,
    createdAt: new Date("2024-01-08")
  },
  {
    id: 4,
    title: "Relatório de Química",
    description: "Relatório do experimento de titulação",
    subject: "Química",
    subjectId: 4,
    dueDate: new Date("2024-01-22"),
    priority: "high",
    completed: false,
    createdAt: new Date("2024-01-14")
  }
];

const mockSubjects = [
  { id: 1, name: "Matemática" },
  { id: 2, name: "História" },
  { id: 3, name: "Física" },
  { id: 4, name: "Química" }
];

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [subjects] = useState(mockSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    dueDate: "",
    priority: "medium"
  });
  const { toast } = useToast();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || task.subjectId.toString() === selectedSubject;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && task.completed) ||
                         (statusFilter === "pending" && !task.completed);
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      default: return "secondary";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Média";
      default: return "Baixa";
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    toast({
      title: task?.completed ? "Tarefa reaberta" : "Tarefa concluída!",
      description: task?.completed ? "Tarefa marcada como pendente" : "Parabéns pelo progresso!",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedSubjectData = subjects.find(s => s.id.toString() === formData.subjectId);
    
    if (editingTask) {
      // Editar tarefa existente
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              ...formData,
              subjectId: parseInt(formData.subjectId),
              subject: selectedSubjectData?.name || "",
              dueDate: new Date(formData.dueDate)
            }
          : task
      ));
      toast({
        title: "Tarefa atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criar nova tarefa
      const newTask = {
        id: Date.now(),
        ...formData,
        subjectId: parseInt(formData.subjectId),
        subject: selectedSubjectData?.name || "",
        dueDate: new Date(formData.dueDate),
        completed: false,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "Tarefa criada!",
        description: "Nova tarefa adicionada com sucesso.",
      });
    }

    setIsDialogOpen(false);
    setEditingTask(null);
    setFormData({ title: "", description: "", subjectId: "", dueDate: "", priority: "medium" });
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      subjectId: task.subjectId.toString(),
      dueDate: task.dueDate.toISOString().split('T')[0],
      priority: task.priority
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida com sucesso.",
      variant: "destructive",
    });
  };

  const openDialog = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", subjectId: "", dueDate: "", priority: "medium" });
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
                <CheckCircle2 className="w-8 h-8" />
                Tarefas
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas atividades e acompanhe seu progresso
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary" onClick={openDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da tarefa</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Prova de Matemática"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva os detalhes da tarefa"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Disciplina</Label>
                    <Select value={formData.subjectId} onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Data de entrega</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
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
                      {editingTask ? "Salvar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as disciplinas</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Prioridade</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const daysUntil = getDaysUntilDue(task.dueDate);
            const isOverdue = daysUntil < 0 && !task.completed;
            const isDueToday = daysUntil === 0 && !task.completed;
            
            return (
              <Card key={task.id} className={`card-elevated transition-all duration-200 ${
                task.completed ? 'opacity-75' : ''
              } ${isOverdue ? 'border-destructive/50' : ''} ${isDueToday ? 'border-warning/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {task.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span>{task.subject}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                        
                        <Badge variant={getPriorityColor(task.priority) as any}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        
                        {isOverdue && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Atrasado
                          </Badge>
                        )}
                        
                        {isDueToday && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Vence hoje
                          </Badge>
                        )}
                        
                        {daysUntil > 0 && daysUntil <= 3 && !isDueToday && (
                          <Badge variant="secondary">
                            {daysUntil} dia{daysUntil > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {tasks.length === 0 ? "Nenhuma tarefa cadastrada" : "Nenhuma tarefa encontrada"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {tasks.length === 0 
                ? "Comece adicionando suas primeiras tarefas para organizar seus estudos."
                : "Tente ajustar os filtros ou criar uma nova tarefa."
              }
            </p>
            <Button className="btn-primary" onClick={openDialog}>
              <Plus className="w-4 h-4 mr-2" />
              {tasks.length === 0 ? "Adicionar Primeira Tarefa" : "Nova Tarefa"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;