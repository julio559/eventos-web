import { useState, useEffect } from 'react'

// Hook para detectar se o componente foi montado no cliente
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  return hasMounted
}

// Função para acessar localStorage com segurança
export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

// Função para definir item no localStorage com segurança
export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, value)
  } catch {
    // Silently fail
  }
}

// Função para remover item do localStorage com segurança
export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {
    // Silently fail
  }
}

// Função para verificar se está no cliente
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

// Função para parsear JSON com segurança
export function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

// Função para formatar data brasileira
export function formatDateBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('pt-BR')
}

// Função para formatar hora brasileira
export function formatTimeBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Função para formatar moeda brasileira
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para formatar número com separadores
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}