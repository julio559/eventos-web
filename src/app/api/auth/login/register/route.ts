import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { companyName, tradeName, email, phone, password } = await request.json()

    if (!companyName || !email || !password) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Verificar se o email já existe
    const existingPartner = await prisma.partner.findUnique({
      where: { email }
    })

    if (existingPartner) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const partner = await prisma.partner.create({
      data: {
        companyName,
        tradeName: tradeName || null,
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
        latitude: -23.550000, // Coordenadas padrão de São Paulo
        longitude: -46.633000,
        isVerified: false
      }
    })

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
    console.error('Erro no registro:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}