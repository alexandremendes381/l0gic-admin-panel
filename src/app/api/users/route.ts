import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json([]);
  } catch (err) {
    console.error('Erro ao buscar leads:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error('Erro ao criar lead:', err);
    return NextResponse.json(
      { error: 'Erro ao criar lead' },
      { status: 400 }
    );
  }
}