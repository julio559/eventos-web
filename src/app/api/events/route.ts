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

    const events = await prisma.event.findMany({
      where: { partnerId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.startsAt.toISOString(),
      time: event.startsAt.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      category: event.categories[0]?.category?.name || 'Evento',
      price: event.priceMinCents ? event.priceMinCents / 100 : 0,
      isActive: event.visibility === 'public' && event.isApproved,
      image: event.coverImageUrl
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
