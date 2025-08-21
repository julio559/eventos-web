import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const reservationId = parseInt(params.id)
    const { status } = await request.json()

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    // Verificar se a reserva pertence ao parceiro
    const reservation = await prisma.restaurantReservation.findFirst({
      where: {
        id: reservationId,
        partnerId: decoded.userId
      }
    })

    if (!reservation) {
      return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 })
    }

    // Atualizar o status da reserva
    const updatedReservation = await prisma.restaurantReservation.update({
      where: { id: reservationId },
      data: { status }
    })

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}