"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import API from "@/services/api";
import useAuth from "@/hooks/useAuth";
import { formatDateSafe } from "@/lib/date-utils";
import { 
  MdAssessment, 
  MdDashboard, 
  MdDownload,
  MdAnalytics,
  MdDateRange,
  MdCampaign
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

export default function ReportsPage() {
  useAuth();
  
  const [isExporting, setIsExporting] = useState(false);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const headers = [
        'ID',
        'Nome',
        'Email', 
        'Telefone',
        'Cargo',
        'Data de Nascimento',
        'Mensagem',
        'Data de Cadastro',
        'Última Atualização',
        'Facebook Click ID',
        'Google Click ID',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign',
        'UTM Term',
        'UTM Content'
      ];

      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          lead.id,
          `"${lead.name}"`,
          lead.email,
          lead.phone,
          `"${lead.position}"`,
          formatDateSafe(lead.birthDate),
          `"${lead.message.replace(/"/g, '""')}"`,
          formatDateSafe(lead.createdAt),
          formatDateSafe(lead.updatedAt),
          lead.fbclid || '',
          lead.gclid || '',
          lead.utm_source || '',
          lead.utm_medium || '',
          lead.utm_campaign || '',
          lead.utm_term || '',
          lead.utm_content || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const excelContent = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cargo</th>
              <th>Data de Nascimento</th>
              <th>Mensagem</th>
              <th>Data de Cadastro</th>
              <th>Última Atualização</th>
              <th>Facebook Click ID</th>
              <th>Google Click ID</th>
              <th>UTM Source</th>
              <th>UTM Medium</th>
              <th>UTM Campaign</th>
              <th>UTM Term</th>
              <th>UTM Content</th>
            </tr>
          </thead>
          <tbody>
            ${leads.map(lead => `
              <tr>
                <td>${lead.id}</td>
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.phone}</td>
                <td>${lead.position}</td>
                <td>${formatDateSafe(lead.birthDate)}</td>
                <td>${lead.message}</td>
                <td>${formatDateSafe(lead.createdAt)}</td>
                <td>${formatDateSafe(lead.updatedAt)}</td>
                <td>${lead.fbclid || ''}</td>
                <td>${lead.gclid || ''}</td>
                <td>${lead.utm_source || ''}</td>
                <td>${lead.utm_medium || ''}</td>
                <td>${lead.utm_campaign || ''}</td>
                <td>${lead.utm_term || ''}</td>
                <td>${lead.utm_content || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      const blob = new Blob([excelContent], { 
        type: 'application/vnd.ms-excel;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${Date.now()}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Relatórios" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Exportação de Leads</h1>
              <p className="text-muted-foreground">
                Exporte todos os leads cadastrados em formato CSV ou Excel
              </p>
            </div>
          </div>

          {/* Resumo Executivo */}
          {!isLoading && leads.length > 0 && (
            <div className="max-w-4xl mx-auto mb-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MdAssessment size={24} />
                    Resumo Executivo
                  </CardTitle>
                  <CardDescription>
                    Visão geral dos seus leads e performance de marketing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{leads.length}</div>
                      <div className="text-sm text-muted-foreground">Total de Leads</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {leads.filter(lead => {
                          const today = new Date();
                          const createdAt = new Date(lead.createdAt);
                          const diffTime = Math.abs(today.getTime() - createdAt.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          return diffDays <= 7;
                        }).length} novos esta semana
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {leads.length > 0 ? Math.round((leads.filter(lead => lead.utm_source || lead.gclid || lead.fbclid).length / leads.length) * 100) : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Taxa de Rastreamento</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {leads.filter(lead => lead.utm_source || lead.gclid || lead.fbclid).length} com dados de origem
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {Array.from(new Set(leads.filter(lead => lead.utm_source).map(lead => lead.utm_source))).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Fontes Ativas</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        canais de aquisição únicos
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-2">
                    <MdAssessment size={16} />
                    Exportar Leads
                  </div>
                </CardTitle>
                <CardDescription>
                  Faça o download de todos os leads em formato CSV ou Excel para análise externa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{leads.length}</div>
                        <div className="text-sm text-muted-foreground">Total de Leads</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {Array.from(new Set(leads.map(lead => lead.position))).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Cargos Únicos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {leads.filter(lead => lead.utm_source || lead.gclid || lead.fbclid).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Com Tracking</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {leads.filter(lead => {
                            const today = new Date();
                            const createdAt = new Date(lead.createdAt);
                            const diffTime = Math.abs(today.getTime() - createdAt.getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            return diffDays <= 30;
                          }).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Últimos 30 dias</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MdDownload size={16} />
                    Dados incluídos na exportação:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ID do Lead
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Nome Completo
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Email
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Telefone
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Cargo/Posição
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Data de Nascimento
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Mensagem
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Data de Cadastro
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Facebook Click ID
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Google Click ID
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      UTM Source
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      UTM Medium
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      UTM Campaign
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      UTM Term
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      UTM Content
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MdAnalytics size={16} />
                    Dados de Marketing Incluídos:
                  </h3>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                      📈 Todos os parâmetros de rastreamento são incluídos na exportação
                    </p>
                    <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                      <li>• Parâmetros UTM completos para análise de campanhas</li>
                      <li>• IDs de clique do Facebook e Google para remarketing</li>
                      <li>• Dados essenciais para relatórios de ROI e atribuição</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">💾 Escolha o formato:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={exportToCSV}
                      disabled={isExporting || isLoading || leads.length === 0}
                      className="h-16 flex flex-col gap-1"
                      variant="outline"
                    >
                      <span className="text-lg">📄</span>
                      <span>Exportar CSV</span>
                      <span className="text-xs text-muted-foreground">
                        Compatível com Excel, Google Sheets
                      </span>
                    </Button>

                    <Button
                      onClick={exportToExcel}
                      disabled={isExporting || isLoading || leads.length === 0}
                      className="h-16 flex flex-col gap-1"
                      variant="outline"
                    >
                      <MdAssessment size={20} />
                      <span>Exportar Excel</span>
                      <span className="text-xs text-muted-foreground">
                        Formato .xls para Microsoft Excel
                      </span>
                    </Button>
                  </div>
                </div>

                {isExporting && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Preparando arquivo para download...</p>
                  </div>
                )}

                {leads.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MdDashboard size={48} className="mb-2" />
                    <p>Nenhum lead encontrado para exportar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Filtros Avançados */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdAssessment size={20} />
                  Filtros de Análise
                </CardTitle>
                <CardDescription>
                  Personalize suas análises filtrando os dados por diferentes critérios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Por Período</label>
                    <div className="space-y-1">
                      {[
                        { label: 'Últimas 24h', count: leads.filter(lead => {
                          const createdAt = new Date(lead.createdAt);
                          const diffHours = Math.abs(new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60);
                          return diffHours <= 24;
                        }).length },
                        { label: 'Última semana', count: leads.filter(lead => {
                          const createdAt = new Date(lead.createdAt);
                          const diffDays = Math.abs(new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
                          return diffDays <= 7;
                        }).length },
                        { label: 'Último mês', count: leads.filter(lead => {
                          const createdAt = new Date(lead.createdAt);
                          const diffDays = Math.abs(new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
                          return diffDays <= 30;
                        }).length }
                      ].map(period => (
                        <div key={period.label} className="flex justify-between text-sm">
                          <span>{period.label}</span>
                          <span className="font-medium">{period.count} leads</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Por Fonte</label>
                    <div className="space-y-1">
                      {Object.entries(
                        leads.reduce((acc, lead) => {
                          const source = lead.utm_source || 'Direto';
                          acc[source] = (acc[source] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([source, count]) => (
                          <div key={source} className="flex justify-between text-sm">
                            <span className="truncate">{source}</span>
                            <span className="font-medium">{count} leads</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estatísticas Gerais</label>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Com telefone</span>
                        <span className="font-medium">
                          {leads.filter(lead => lead.phone && lead.phone.trim()).length} leads
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Com mensagem</span>
                        <span className="font-medium">
                          {leads.filter(lead => lead.message && lead.message.trim()).length} leads
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Com data nasc.</span>
                        <span className="font-medium">
                          {leads.filter(lead => lead.birthDate).length} leads
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Análise de Fontes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdAnalytics size={20} />
                  Análise de Fontes de Tráfego
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const sourceStats = leads.reduce((acc, lead) => {
                      const source = lead.utm_source || 'Direto';
                      acc[source] = (acc[source] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);

                    return Object.entries(sourceStats)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <span className="text-sm font-medium">{source}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{count} leads</span>
                            <span className="text-xs text-muted-foreground">
                              ({((count / leads.length) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Análise Temporal */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdDateRange size={20} />
                  Leads por Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const today = new Date();
                    const periods = [
                      { label: 'Hoje', days: 1 },
                      { label: 'Últimos 7 dias', days: 7 },
                      { label: 'Últimos 30 dias', days: 30 },
                      { label: 'Últimos 90 dias', days: 90 }
                    ];

                    return periods.map(({ label, days }) => {
                      const count = leads.filter(lead => {
                        const createdAt = new Date(lead.createdAt);
                        const diffTime = Math.abs(today.getTime() - createdAt.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays <= days;
                      }).length;

                      return (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{label}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{count} leads</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${leads.length > 0 ? (count / leads.length) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Top Campanhas */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdCampaign size={20} />
                  Top Campanhas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const campaignStats = leads
                      .filter(lead => lead.utm_campaign)
                      .reduce((acc, lead) => {
                        const campaign = lead.utm_campaign!;
                        acc[campaign] = (acc[campaign] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);

                    const entries = Object.entries(campaignStats);
                    
                    if (entries.length === 0) {
                      return (
                        <div className="text-center text-muted-foreground py-8">
                          <p>Nenhuma campanha registrada</p>
                        </div>
                      );
                    }

                    return entries
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([campaign, count]) => (
                        <div key={campaign} className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate max-w-[200px]" title={campaign}>
                            {campaign}
                          </span>
                          <span className="text-sm text-muted-foreground">{count} leads</span>
                        </div>
                      ));
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}