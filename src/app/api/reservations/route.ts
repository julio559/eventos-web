import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const reservations = await prisma.restaurantReservation.findMany({
      where: { partnerId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    })

    const formattedReservations = reservations.map(reservation => ({
      id: reservation.id,
      customerName: reservation.name || 'Cliente',
      customerEmail: '',
      customerPhone: reservation.phone || '',
      date: reservation.reservedAt.toISOString().split('T')[0],
      time: reservation.reservedAt.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      guests: reservation.people,
      status: reservation.status,
      notes: reservation.notes
    }))

    return NextResponse.json(formattedReservations)
  } catch (error) {
    console.error('Erro ao buscar reservas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
