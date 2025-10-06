import { NextRequest, NextResponse } from 'next/server';

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
  fbclid?: string | null;
  gclid?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

const leadsDatabase: Lead[] = [];

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await params;
    const leadId = parseInt(id);
    
    const requiredFields = ['name', 'email', 'phone', 'position'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json(
          { message: `O campo '${field}' é obrigatório` },
          { status: 400 }
        );
      }
    }

    const emailExists = leadsDatabase.find(lead => 
      lead.email.toLowerCase() === body.email.toLowerCase() && lead.id !== leadId
    );
    
    if (emailExists) {
      return NextResponse.json(
        { message: 'Email já está em uso' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const existingLeadIndex = leadsDatabase.findIndex(lead => lead.id === leadId);
    if (existingLeadIndex === -1) {
      return NextResponse.json(
        { message: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    const updatedLead = {
      ...leadsDatabase[existingLeadIndex],
      ...body,
      id: leadId,
      updatedAt: new Date().toISOString()
    };
    
    leadsDatabase[existingLeadIndex] = updatedLead;
    
    return NextResponse.json(updatedLead);
  } catch (err) {
    console.error('Erro ao atualizar lead:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const leadId = parseInt(id);
    
    const leadIndex = leadsDatabase.findIndex(lead => lead.id === leadId);
    if (leadIndex === -1) {
      return NextResponse.json(
        { message: 'Lead não encontrado' },
        { status: 404 }
      );
    }

    leadsDatabase.splice(leadIndex, 1);
    
    return NextResponse.json({ message: 'Lead deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar lead:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}