import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { getTasks, getSubjects, deleteAllUserData } from "@/lib/firestore";
import { Task, Subject } from "@/lib/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { User, Trash2, CheckCircle, Circle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, deleteAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [tasksData, subjectsData] = await Promise.all([
          getTasks(user.uid),
          getSubjects(user.uid)
        ]);
        setTasks(tasksData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // Delete all user data first
      await deleteAllUserData(user.uid);

      // Then delete the account
      await deleteAccount();

      toast({
        title: "Conta deletada",
        description: "Sua conta e todos os dados foram removidos com sucesso",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível deletar a conta",
        variant: "destructive",
      });
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Perfil</h1>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <p className="text-lg">{user?.displayName || "Não informado"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Tarefas Concluídas ({completedTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma tarefa concluída ainda.</p>
          ) : (
            <div className="space-y-2">
              {completedTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.subject}</p>
                  </div>
                  <Badge variant="secondary">Concluída</Badge>
                </div>
              ))}
              {completedTasks.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  E mais {completedTasks.length - 5} tarefas concluídas...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-yellow-600" />
            Tarefas Pendentes ({pendingTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma tarefa pendente.</p>
          ) : (
            <div className="space-y-2">
              {pendingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.subject}</p>
                  </div>
                  <Badge variant="outline">Pendente</Badge>
                </div>
              ))}
              {pendingTasks.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  E mais {pendingTasks.length - 5} tarefas pendentes...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Disciplinas ({subjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma disciplina cadastrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <h3 className="font-medium">{subject.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{subject.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Tarefas: {subject.tasksCount}</span>
                    <span>Concluídas: {subject.completedTasks}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá todos os seus dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta,
                  todas as suas tarefas, disciplinas e dados associados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Deletar Conta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
