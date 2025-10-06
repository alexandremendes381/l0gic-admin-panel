"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MdClose, MdEdit } from "react-icons/md"
import { formatDateSafe, formatPhoneSafe } from "@/lib/date-utils"

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

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

function parseTrackingData(message: string) {
  try {
    const trackingMatch = message.match(/Dados de tracking:\{([^}]+)\}/);
    if (trackingMatch) {
      const trackingDataStr = `{${trackingMatch[1]}}`;
      const trackingData = JSON.parse(trackingDataStr.replace(/(\w+):/g, '"$1":'));
      return {
        originalMessage: message.replace(/Dados de tracking:\{[^}]+\}/, '').trim(),
        trackingData
      };
    }
    return { originalMessage: message, trackingData: null };
  } catch {
    return { originalMessage: message, trackingData: null };
  }
}

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  if (!isOpen || !lead) return null;

  const { originalMessage, trackingData } = parseTrackingData(lead.message);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 border border-border">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{lead.name}</CardTitle>
                <CardDescription>{lead.email}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <MdClose size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-base text-foreground mb-3">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h4>
                  <p className="text-sm">{formatPhoneSafe(lead.phone)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Cargo</h4>
                  <p className="text-sm">{lead.position}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Data de Nascimento</h4>
                  <p className="text-sm">{formatDateSafe(lead.birthDate)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">ID do Lead</h4>
                  <p className="text-sm">#{lead.id}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Cadastrado em</h4>
                  <p className="text-sm">{formatDateSafe(lead.createdAt)}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Última Atualização</h4>
                  <p className="text-sm">{formatDateSafe(lead.updatedAt)}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold text-base text-foreground mb-3">Mensagem</h3>
              <p className="text-sm bg-muted/50 text-foreground p-3 rounded-md border">{originalMessage}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-base text-foreground mb-3">Dados de Marketing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">UTM Source</h4>
                  <p className="text-sm">{lead.utm_source || "Não informado"}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">UTM Medium</h4>
                  <p className="text-sm">{lead.utm_medium || "Não informado"}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">UTM Campaign</h4>
                  <p className="text-sm">{lead.utm_campaign || "Não informado"}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">UTM Term</h4>
                  <p className="text-sm">{lead.utm_term || "Não informado"}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">UTM Content</h4>
                  <p className="text-sm">{lead.utm_content || "Não informado"}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Google Click ID</h4>
                  <p className="text-sm">{lead.gclid || "Não informado"}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Facebook Click ID</h4>
                  <p className="text-sm">{lead.fbclid || "Não informado"}</p>
                </div>
              </div>
            </div>
            
            {trackingData && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-3">Dados de Rastreamento Adicional</h3>
                  <div className="bg-muted/30 p-3 rounded-md text-sm space-y-2">
                    <div>
                      <strong>Referrer:</strong> {trackingData.referrer}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {formatDateSafe(trackingData.timestamp)}
                    </div>
                    <div>
                      <strong>Session ID:</strong> {trackingData.sessionId}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button>
                <MdEdit size={16} className="mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}