'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Hook para detectar montagem no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return // Só executa após montar no cliente
    
    // Função para acessar localStorage com segurança
    const getToken = () => {
      try {
        return localStorage.getItem('token')
      } catch {
        return null
      }
    }

    const token = getToken()
    if (!token) {
      router.push('/auth/login')
    } else {
      setLoading(false)
    }
  }, [mounted, router])

  // Evita renderização até estar montado
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return <>{children}</>
}