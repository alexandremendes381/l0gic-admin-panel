"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadDetailsModal } from "@/components/lead-details-modal";
import { LeadFormModal } from "@/components/lead-form-modal";
import { DeleteLeadModal } from "@/components/delete-lead-modal";
import { useState, useEffect } from "react";
import { z } from "zod";
import API from "@/services/api";
import useAuth from "@/hooks/useAuth";
import { formatDateSafe } from "@/lib/date-utils";
import { 
  MdVisibility, 
  MdEdit, 
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdPeople,
  MdSearch,
  MdAdd,
  MdClear
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

const searchSchema = z.string().regex(/^[\w\s@.]*$/, "Campo inválido");

export default function LeadsPage() {
  useAuth();
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLeads = async (q?: string) => {
    setIsLoading(true);
    try {
      const res = q
        ? await API.get(`/api/leads/search?q=${encodeURIComponent(q)}`)
        : await API.get("/api/leads");
      const data = res.data || [];
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      setLeads([]);
      setFilteredLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [showFormModal, showDeleteModal]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchLeads();
      } else {
        try {
          searchSchema.parse(searchTerm);
          fetchLeads(searchTerm);
        } catch (error) {
          console.error("Termo de busca inválido:", error);
        }
      }
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setShowFormModal(true);
  };

  const handleDelete = (lead: Lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  const handleNewLead = () => {
    setLeadToEdit(null);
    setShowFormModal(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Leads" />
      
      <div className="p-8">
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Lista de Leads</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar leads..."
                      className="pl-10 pr-10 py-2 text-sm border border-input rounded-md bg-background w-full sm:w-64"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <MdClear size={16} />
                      </button>
                    )}
                  </div>
                  <Button onClick={handleNewLead} size="sm">
                    <MdAdd className="mr-2 h-4 w-4" />
                    Novo Lead
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Mostrando {leads.length} leads
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center min-h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? 'Buscando leads...' : 'Carregando leads...'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium text-sm">Nome</th>
                            <th className="text-left py-3 px-2 font-medium text-sm">Email</th>
                            <th className="text-left py-3 px-2 font-medium text-sm">Telefone</th>
                            <th className="text-left py-3 px-2 font-medium text-sm">Posição</th>
                            <th className="text-left py-3 px-2 font-medium text-sm">Data</th>
                            <th className="text-right py-3 px-2 font-medium text-sm">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentLeads.length > 0 ? (
                            currentLeads.map((lead) => (
                              <tr key={lead.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-2">
                                  <div className="font-medium text-sm">{lead.name}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="text-sm text-muted-foreground">{lead.email}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="text-sm">{lead.phone}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="text-sm">{lead.position}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="text-sm text-muted-foreground">{formatDateSafe(lead.createdAt)}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(lead)} title="Ver detalhes" className="h-7 w-7 p-0">
                                      <MdVisibility size={14} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(lead)} title="Editar lead" className="h-7 w-7 p-0">
                                      <MdEdit size={14} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDelete(lead)}
                                      title="Excluir lead"
                                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                    >
                                      <MdDelete size={14} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : searchTerm ? (
                            <tr>
                              <td colSpan={6} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  <MdSearch size={48} className="mx-auto mb-4 opacity-50" />
                                  <p>Nenhum lead encontrado</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  <MdPeople size={48} className="mx-auto mb-4 opacity-50" />
                                  <p>Nenhum lead cadastrado</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {currentLeads.length > 0 ? (
                      currentLeads.map((lead) => (
                        <Card key={lead.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-medium text-sm mb-1">{lead.name}</h3>
                                <p className="text-xs text-muted-foreground mb-1">{lead.email}</p>
                                <p className="text-xs text-muted-foreground">{lead.phone}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(lead)} title="Ver detalhes" className="h-7 w-7 p-0">
                                  <MdVisibility size={14} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(lead)} title="Editar lead" className="h-7 w-7 p-0">
                                  <MdEdit size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(lead)}
                                  title="Excluir lead"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                >
                                  <MdDelete size={14} />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Posição:</span> {lead.position}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Data:</span> {formatDateSafe(lead.createdAt)}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : searchTerm ? (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground">
                          <MdSearch size={48} className="mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Nenhum lead encontrado</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground">
                          <MdPeople size={48} className="mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Nenhum lead cadastrado</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages} ({totalItems} itens)
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <MdChevronLeft size={16} />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Próxima
                          <MdChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modais */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLead(null);
          }}
        />
      )}

      <LeadFormModal
        lead={leadToEdit}
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setLeadToEdit(null);
        }}
      />

      {leadToDelete && (
        <DeleteLeadModal
          lead={leadToDelete}
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setLeadToDelete(null);
          }}
        />
      )}
    </div>
  );
}