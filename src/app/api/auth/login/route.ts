import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const partner = await prisma.partner.findUnique({
      where: { email }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, partner.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = generateToken(partner.id)

    return NextResponse.json({
      token,
      user: {
        id: partner.id,
        name: partner.companyName,
        email: partner.email,
        tradeName: partner.tradeName
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}