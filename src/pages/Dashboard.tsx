import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle, BookOpen, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { getTasks, getSubjects, getUserStats, updateTask, Task, Subject } from "@/lib/firestore";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [tasksData, subjectsData, statsData] = await Promise.all([
        getTasks(user!.uid),
        getSubjects(user!.uid),
        getUserStats(user!.uid)
      ]);

      setTasks(tasksData);
      setSubjects(subjectsData);
      setStats(statsData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Não foi possível carregar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const markTaskComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await updateTask(taskId, { completed: !task.completed });
        await loadDashboardData(); // Reload data
        toast({
          title: task.completed ? "Tarefa reaberta" : "Tarefa concluída!",
          description: task.completed ? "Tarefa marcada como pendente" : "Parabéns pelo progresso!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    }
  };

  const completionPercentage = stats ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-section border-b border-border/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gradient mb-2">
                Olá, {user?.displayName || "Estudante"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Vamos organizar seus estudos hoje
              </p>
            </div>
            <Button className="btn-primary" onClick={() => navigate('/tasks')}>
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
                  <p className="text-2xl font-semibold">{stats?.totalTasks || 0}</p>
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
                  <p className="text-2xl font-semibold text-secondary">{stats?.completedTasks || 0}</p>
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
                  <p className="text-2xl font-semibold text-warning">{stats?.pendingTasks || 0}</p>
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
                  <p className="text-2xl font-semibold text-destructive">{stats?.overdueTasks || 0}</p>
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
                {tasks.filter(task => !task.completed).slice(0, 5).map((task) => {
                  const daysUntil = getDaysUntilDue(task.dueDate.toDate());
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
                        onClick={() => markTaskComplete(task.id!)}
                        className="ml-4"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
                {tasks.filter(task => !task.completed).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma tarefa pendente</p>
                  </div>
                )}
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
                    {stats?.completedTasks || 0} de {stats?.totalTasks || 0} tarefas concluídas
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
                  {subjects.slice(0, 4).map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between">
                      <span className="text-sm">{subject.name}</span>
                      <Badge variant="secondary">{subject.tasksCount} tarefas</Badge>
                    </div>
                  ))}
                  {subjects.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma disciplina cadastrada</p>
                  )}
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
