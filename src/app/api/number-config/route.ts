import { NextRequest, NextResponse } from "next/server";

let config = {
  id: 1,
  value: 2,
  lastUpdatedBy: "alexandre mendes",
  createdAt: "2025-10-05T17:57:40.287Z",
  updatedAt: "2025-10-05T17:58:22.381Z"
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Configuração de layout obtida com sucesso",
      data: config
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao obter configuração"
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { value } = body;

    if (!value || ![1, 2, 3].includes(Number(value))) {
      return NextResponse.json(
        {
          success: false,
          message: "Valor inválido. Deve ser 1, 2 ou 3"
        },
        { status: 400 }
      );
    }

    config = {
      ...config,
      value: Number(value),
      lastUpdatedBy: "alexandre mendes",
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: "Configuração atualizada com sucesso",
      data: config
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar configuração"
      },
      { status: 500 }
    );
  }
}