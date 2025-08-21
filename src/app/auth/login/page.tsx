'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [showPassword, setShowPassword] = useState(false)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const router = useRouter()

 const handleLogin = async (e: React.FormEvent) => {
   e.preventDefault()
   setLoading(true)
   setError('')

   try {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
     })

     const data = await response.json()

     if (response.ok) {
       localStorage.setItem('token', data.token)
       localStorage.setItem('user', JSON.stringify(data.user))
       router.push('/dashboard')
     } else {
       setError(data.error || 'Erro ao fazer login')
     }
   } catch (err) {
     setError('Erro de conexão')
   } finally {
     setLoading(false)
   }
 }

 return (
   <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
     <div className="max-w-md w-full space-y-8">
       <div className="text-center">
         <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
           E
         </div>
         <h2 className="mt-6 text-3xl font-bold text-white">
           Entre na sua conta
         </h2>
         <p className="mt-2 text-sm text-purple-200">
           Gerencie seu estabelecimento
         </p>
       </div>

       <form className="mt-8 space-y-6 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20" onSubmit={handleLogin}>
         {error && (
           <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg text-sm">
             {error}
           </div>
         )}

         <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-white mb-2">
               Email
             </label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                 placeholder="seu@email.com"
                 required
               />
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-white mb-2">
               Senha
             </label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
               <input
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="block w-full pl-10 pr-10 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                 placeholder="••••••••"
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
               >
                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
           </div>
         </div>

         <button
           type="submit"
           disabled={loading}
           className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
         >
           {loading ? 'Entrando...' : 'Entrar'}
         </button>

         <div className="text-center">
           <p className="text-sm text-purple-200">
             Não tem conta?{' '}
             <a href="/auth/register" className="font-medium text-purple-300 hover:text-white transition-colors">
               Cadastre-se aqui
             </a>
           </p>
         </div>
       </form>
     </div>
   </div>
 )
}
