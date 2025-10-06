"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteUser } from "@/hooks/use-user-mutations"
import { MdClose } from "react-icons/md"

interface Lead {
  id: number;
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

interface DeleteLeadModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteLeadModal({ lead, isOpen, onClose }: DeleteLeadModalProps) {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(lead.id);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar lead:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg w-full max-w-md m-4 border border-border">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-destructive">
                  Deletar Lead
                </CardTitle>
                <CardDescription>
                  Esta ação não pode ser desfeita.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <MdClose size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
              Tem certeza que deseja deletar o lead <strong className="text-foreground">{lead.name}</strong>?
              </p>
              <p className="text-xs text-muted-foreground">
                Todos os dados associados a este lead serão permanentemente removidos.
              </p>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={deleteUserMutation.isPending}
                >
                  {deleteUserMutation.isPending ? "Deletando..." : "Deletar"}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}