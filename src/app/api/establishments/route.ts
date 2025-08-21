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

    const partner = await prisma.partner.findUnique({
      where: { id: decoded.userId },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        },
        reservations: {
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Estabelecimento não encontrado' }, { status: 404 })
    }

    const establishment = {
      id: partner.id,
      name: partner.companyName,
      tradeName: partner.tradeName,
      category: 'Estabelecimento',
      address: partner.addressLine || '',
      phone: partner.phone || '',
      email: partner.email,
      city: partner.city,
      state: partner.state,
      isActive: partner.isVerified
    }

    return NextResponse.json(establishment)
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
