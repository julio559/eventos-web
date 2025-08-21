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

    // Buscar estatísticas do parceiro
    const [events, reservations, reviews] = await Promise.all([
      prisma.event.count({ 
        where: { 
          partnerId: decoded.userId,
          visibility: 'public',
          isApproved: true
        } 
      }),
      prisma.restaurantReservation.count({ 
        where: { 
          partnerId: decoded.userId 
        } 
      }),
      prisma.restaurantReview.aggregate({
        where: { partnerId: decoded.userId },
        _avg: { rating: true },
        _count: { id: true }
      })
    ])

    // Dados simulados para views e revenue (você pode implementar tabelas reais depois)
    const stats = {
      views: Math.floor(Math.random() * 1000) + 500, // Placeholder
      reservations,
      events,
      rating: Number(reviews._avg.rating?.toFixed(1)) || 0,
      reviewsCount: reviews._count.id,
      revenue: Math.floor(Math.random() * 10000) + 5000 // Placeholder
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}