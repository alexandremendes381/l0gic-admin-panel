"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import ClientOnly from "@/components/client-only";
import { 
  MdPeople, 
  MdWorkOutline, 
  MdAssessment, 
  MdSettings, 
  MdBuild 
} from "react-icons/md";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  fbclid: string | null;
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

async function fetchLeads(): Promise<Lead[]> {
  const response = await API.get("/api/leads");

  if (response.status >= 400) {
    throw new Error("Erro ao buscar leads");
  }

  return response.data;
}


export default function Home() {
  useAuth();
  
  const router = useRouter();

  
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'leads':
        router.push('/leads');
        break;
      case 'reports':
        router.push('/reports');
        break;
      case 'settings':
        alert('Configurações em desenvolvimento');
        break;
      case 'tools':
        alert('Ferramentas em desenvolvimento');
        break;
      default:
        break;
    }
  };



  const totalLeads = leads.length;
  
  const getRecentLeadsCount = () => {
    if (typeof window === 'undefined') return 0;
    
    return leads.filter(lead => {
      const createdAt = new Date(lead.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;
  };
  
  const recentLeads = getRecentLeadsCount();
  
  const positionStats = leads.reduce((acc, lead) => {
    acc[lead.position] = (acc[lead.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topPositions = Object.entries(positionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentLeadsData = leads
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao Painel Administrativo</h1>
              <p className="text-muted-foreground">
                Gerencie leads, visualize relatórios e monitore as atividades do sistema.
              </p>
            </div>
          
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Leads
                </CardTitle>
                <MdPeople size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : totalLeads.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {recentLeads} novos esta semana
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cargos Únicos
                </CardTitle>
                <MdWorkOutline size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : Object.keys(positionStats).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Diferentes posições cadastradas
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Cargos</CardTitle>
                <CardDescription>
                  Análise da distribuição de leads por posição
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPositions.map(([position, count], index) => {
                      const percentage = Math.round((count / totalLeads) * 100);
                      return (
                        <div key={position} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">#{index + 1}</span>
                              <Badge variant="secondary">{position}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {count} leads ({percentage}%)
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                    {topPositions.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum dado disponível
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leads Recentes</CardTitle>
                <CardDescription>
                  Últimos leads cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientOnly fallback={
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                }>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentLeadsData.map((lead) => {
                        const timeAgo = Math.floor(
                          (new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                        );
                      return (
                        <div key={lead.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{lead.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{lead.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {lead.position}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {timeAgo === 0 ? 'Hoje' : `${timeAgo}d atrás`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      {recentLeadsData.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Nenhum lead cadastrado
                        </p>
                      )}
                    </div>
                  )}
                </ClientOnly>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => handleQuickAction('leads')}
                >
                  <MdPeople size={32} />
                  <span>Gerenciar Leads</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => handleQuickAction('reports')}
                >
                  <MdAssessment size={32} />
                  <span>Relatórios</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => handleQuickAction('settings')}
                >
                  <MdSettings size={32} />
                  <span>Configurações</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => handleQuickAction('tools')}
                >
                  <MdBuild size={32} />
                  <span>Ferramentas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}