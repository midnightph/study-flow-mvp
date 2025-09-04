import { useState } from "react";
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle, BookOpen, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Mock data - você conectará com Firebase
const mockTasks = [
  {
    id: 1,
    title: "Prova de Matemática",
    subject: "Matemática",
    dueDate: new Date("2024-01-20"),
    priority: "high",
    completed: false,
    description: "Capítulos 1-5 do livro"
  },
  {
    id: 2,
    title: "Trabalho de História",
    subject: "História",
    dueDate: new Date("2024-01-25"),
    priority: "medium",
    completed: false,
    description: "Revolução Industrial"
  },
  {
    id: 3,
    title: "Lista de Exercícios",
    subject: "Física",
    dueDate: new Date("2024-01-18"),
    priority: "low",
    completed: true,
    description: "Mecânica clássica"
  }
];

const mockStats = {
  totalTasks: 15,
  completed: 8,
  pending: 7,
  overdue: 2
};

const Dashboard = () => {
  const [tasks] = useState(mockTasks);
  const { toast } = useToast();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      default: return "secondary";
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const markTaskComplete = (taskId: number) => {
    toast({
      title: "Tarefa concluída!",
      description: "Parabéns pelo progresso!",
    });
  };

  const completionPercentage = (mockStats.completed / mockStats.totalTasks) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-section border-b border-border/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gradient mb-2">
                Olá, Estudante! 👋
              </h1>
              <p className="text-muted-foreground">
                Vamos organizar seus estudos hoje
              </p>
            </div>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold">{mockStats.totalTasks}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                  <p className="text-2xl font-semibold text-secondary">{mockStats.completed}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-semibold text-warning">{mockStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Atrasadas</p>
                  <p className="text-2xl font-semibold text-destructive">{mockStats.overdue}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próximas Tarefas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.filter(task => !task.completed).map((task) => {
                  const daysUntil = getDaysUntilDue(task.dueDate);
                  return (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge variant={getPriorityColor(task.priority) as any}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {task.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {daysUntil === 0 ? "Hoje" : daysUntil === 1 ? "Amanhã" : `${daysUntil} dias`}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markTaskComplete(task.id)}
                        className="ml-4"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Progresso Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conclusão</span>
                      <span>{Math.round(completionPercentage)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mockStats.completed} de {mockStats.totalTasks} tarefas concluídas
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Disciplinas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Matemática", "História", "Física", "Química"].map((subject) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm">{subject}</span>
                      <Badge variant="secondary">3 tarefas</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;