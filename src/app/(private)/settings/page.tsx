"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import API from "@/services/api";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { MdSettings, MdCheck, MdRefresh } from "react-icons/md";
import { showSuccessMessage, showErrorMessage } from "@/lib/toast-utils";

interface ThemeConfig {
  id: number;
  value: number;
  lastUpdatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Theme {
  id: number;
  name: string;
  description: string;
  image: string;
}

const themes: Theme[] = [
  {
    id: 0,
    name: "Tema Clássico",
    description: "Design limpo e profissional com foco na simplicidade",
    image: "/screen/image1.png"
  },
  {
    id: 1,
    name: "Tema Moderno",
    description: "Layout contemporâneo com elementos visuais marcantes",
    image: "/screen/image2.png"
  },
  {
    id: 2,
    name: "Tema Criativo",
    description: "Design inovador com cores vibrantes e animações",
    image: "/screen/image3.png"
  }
];

export default function SettingsPage() {
  useAuth();

  const [config, setConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await API.get("/api/layout-config");
      if (response.data.success) {
        setConfig(response.data.data);
        setSelectedTheme(response.data.data.value);
      }
    } catch (error) {
      console.error("Erro ao buscar configuração:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (themeId: number) => {
    setUpdating(true);
    try {
      const response = await API.patch("/api/layout-config", {
        value: themeId
      });
      
      if (response.data.success) {
        setConfig(response.data.data);
        setSelectedTheme(themeId);
        showSuccessMessage("Tema atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar tema:", error);
      showErrorMessage("Erro ao atualizar tema. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Configurações" />
        <div className="flex-1 p-4 md:p-6">
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Carregando configurações...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Configurações" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MdSettings size={20} />
                Temas da Landing Page
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Escolha o tema que será usado na sua landing page. O tema selecionado será aplicado imediatamente.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative rounded-lg border-2 transition-all cursor-pointer ${
                      selectedTheme === theme.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => selectedTheme !== theme.id && updateTheme(theme.id)}
                  >
                    <div className="p-4">
                      <div className="relative aspect-video mb-4 rounded-md overflow-hidden bg-muted">
                        <Image
                          src={theme.image}
                          alt={theme.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base">{theme.name}</h3>
                          {selectedTheme === theme.id && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                              <MdCheck size={12} />
                              Ativo
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {theme.description}
                        </p>
                      </div>
                      
                      {selectedTheme !== theme.id && (
                        <Button 
                          size="sm" 
                          className="w-full mt-4"
                          disabled={updating}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTheme(theme.id);
                          }}
                        >
                          {updating ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                              Aplicando...
                            </>
                          ) : (
                            "Selecionar Tema"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {config && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdRefresh size={20} />
                  Informações da Configuração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Última atualização por:</span>
                    <p className="font-medium text-primary">{config.lastUpdatedBy}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Tema Atual:</span>
                    <p>{themes.find(t => t.id === config.value)?.name || "Desconhecido"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Criado em:</span>
                    <p>{new Date(config.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Última atualização:</span>
                    <p>{new Date(config.updatedAt).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}