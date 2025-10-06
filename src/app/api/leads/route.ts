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

export async function GET() {
  try {
    return NextResponse.json(leadsDatabase);
  } catch (err) {
    console.error('Erro ao buscar leads:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
      lead.email.toLowerCase() === body.email.toLowerCase()
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

    const newLead = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    leadsDatabase.push(newLead);
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (err) {
    console.error('Erro ao criar lead:', err);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

