"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateUser, useUpdateUser } from "@/hooks/use-user-mutations"
import { MdClose } from "react-icons/md"

interface Lead {
  id?: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  fbclid?: string | null;
  gclid?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

interface LeadFormModalProps {
  lead?: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadFormModal({ lead, isOpen, onClose }: LeadFormModalProps) {
  const [formData, setFormData] = useState<Lead>({
    name: "",
    email: "",
    phone: "",
    position: "",
    birthDate: "",
    message: "",
    fbclid: null,
    gclid: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      if (lead) {
        setFormData({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          position: lead.position,
          birthDate: lead.birthDate,
          message: lead.message,
          fbclid: lead.fbclid || null,
          gclid: lead.gclid || null,
          utm_source: lead.utm_source || null,
          utm_medium: lead.utm_medium || null,
          utm_campaign: lead.utm_campaign || null,
          utm_term: lead.utm_term || null,
          utm_content: lead.utm_content || null,
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: "",
          birthDate: "",
          message: "",
          fbclid: null,
          gclid: null,
          utm_source: null,
          utm_medium: null,
          utm_campaign: null,
          utm_term: null,
          utm_content: null,
        });
      }
    }
  }, [lead, isOpen]);

  const isEditing = Boolean(lead?.id);
  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (isEditing && lead?.id) {
        await updateUserMutation.mutateAsync({ ...formData, id: lead.id });
      } else {
        await createUserMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar lead:", error);
      console.error("Erro detalhado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido ao salvar lead";
      setErrorMessage(errorMsg);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      birthDate: "",
      message: "",
    });
    setErrorMessage("");
    onClose();
  };

  const handleInputChange = (field: keyof Lead, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value === "" ? null : value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 border border-border">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {isEditing ? "Editar Lead" : "Novo Lead"}
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Atualize as informações do lead" : "Preencha os dados do novo lead"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <MdClose size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-1">
                    Posição/Cargo *
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                  required
                />
              </div>

              {/* Campos de Tracking/Marketing */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Dados de Marketing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fbclid" className="block text-sm font-medium mb-1">
                      Facebook Click ID (FBCLID)
                    </label>
                    <input
                      id="fbclid"
                      type="text"
                      value={formData.fbclid || ""}
                      onChange={(e) => handleInputChange("fbclid", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="fb.1.1234567890.987654321"
                    />
                  </div>

                  <div>
                    <label htmlFor="gclid" className="block text-sm font-medium mb-1">
                      Google Click ID (GCLID)
                    </label>
                    <input
                      id="gclid"
                      type="text"
                      value={formData.gclid || ""}
                      onChange={(e) => handleInputChange("gclid", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="Cj0KCQjw..."
                    />
                  </div>

                  <div>
                    <label htmlFor="utm_source" className="block text-sm font-medium mb-1">
                      UTM Source
                    </label>
                    <input
                      id="utm_source"
                      type="text"
                      value={formData.utm_source || ""}
                      onChange={(e) => handleInputChange("utm_source", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="google, facebook, newsletter"
                    />
                  </div>

                  <div>
                    <label htmlFor="utm_medium" className="block text-sm font-medium mb-1">
                      UTM Medium
                    </label>
                    <input
                      id="utm_medium"
                      type="text"
                      value={formData.utm_medium || ""}
                      onChange={(e) => handleInputChange("utm_medium", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="cpc, email, social"
                    />
                  </div>

                  <div>
                    <label htmlFor="utm_campaign" className="block text-sm font-medium mb-1">
                      UTM Campaign
                    </label>
                    <input
                      id="utm_campaign"
                      type="text"
                      value={formData.utm_campaign || ""}
                      onChange={(e) => handleInputChange("utm_campaign", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="spring_sale, product_launch"
                    />
                  </div>

                  <div>
                    <label htmlFor="utm_term" className="block text-sm font-medium mb-1">
                      UTM Term
                    </label>
                    <input
                      id="utm_term"
                      type="text"
                      value={formData.utm_term || ""}
                      onChange={(e) => handleInputChange("utm_term", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="running+shoes, red+dress"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="utm_content" className="block text-sm font-medium mb-1">
                      UTM Content
                    </label>
                    <input
                      id="utm_content"
                      type="text"
                      value={formData.utm_content || ""}
                      onChange={(e) => handleInputChange("utm_content", e.target.value || null)}
                      className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                      placeholder="logolink, textlink, banner"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}