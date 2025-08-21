'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Star, 
  Users, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock,
  Phone,
  Menu,
  Bell,
  Settings,
  BarChart3,
  MessageCircle,
  Share2,
  LogOut
} from 'lucide-react'

interface Stats {
  views: number
  reservations: number
  events: number
  rating: number
  reviewsCount: number
  revenue: number
}

interface Event {
  id: number
  title: string
  description?: string
  category: string
  date: string
  time: string
  price?: number
  isActive: boolean
  image?: string
}

interface Reservation {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
}

interface Establishment {
  id: number
  name: string
  tradeName?: string
  category: string
  address: string
  phone: string
  email: string
  city?: string
  state?: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    views: 0,
    reservations: 0,
    events: 0,
    rating: 0,
    reviewsCount: 0,
    revenue: 0
  })
  const [events, setEvents] = useState<Event[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/auth/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const [statsRes, eventsRes, reservationsRes, establishmentRes] = await Promise.all([
        fetch('/api/establishments/stats', { headers }),
        fetch('/api/events', { headers }),
        fetch('/api/reservations', { headers }),
        fetch('/api/establishments', { headers })
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        setEvents(eventsData)
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json()
        setReservations(reservationsData)
      }

      if (establishmentRes.ok) {
        const establishmentData = await establishmentRes.json()
        setEstablishment(establishmentData)
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const updateReservationStatus = async (reservationId: number, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setReservations(reservations.map(r => 
          r.id === reservationId ? { ...r, status: status as any } : r
        ))
      }
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error)
    }
  }

  const deleteEvent = async (eventId: number) => {
    if (!confirm('Tem certeza que deseja deletar este evento?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId))
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
    }
  }

  const MenuItem = ({ icon: Icon, label, tabKey, count }: any) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 ${
        activeTab === tabKey
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`px-2 py-1 text-xs rounded-full ${
          activeTab === tabKey ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  )

  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${
          color === 'purple' ? 'from-purple-500 to-purple-600' :
          color === 'green' ? 'from-green-500 to-green-600' :
          color === 'orange' ? 'from-orange-500 to-orange-600' :
          'from-blue-500 to-blue-600'
        } text-white`}>
          <Icon size={24} />
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )

  const EventCard = ({ event }: { event: Event }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          {event.title.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              event.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {event.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {event.time}
            </div>
            {event.price && (
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                R$ {event.price}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => deleteEvent(event.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard 
                icon={Eye} 
                title="Visualizações" 
                value={stats.views.toLocaleString()} 
                change={12}
                color="blue"
              />
              <StatCard 
                icon={Users} 
                title="Reservas" 
                value={stats.reservations} 
                change={8}
                color="green"
              />
              <StatCard 
                icon={Star} 
                title="Avaliação" 
                value={stats.rating.toFixed(1)} 
                change={2}
                color="orange"
              />
              <StatCard 
                icon={DollarSign} 
                title="Receita" 
                value={`R$ ${stats.revenue.toLocaleString()}`} 
                change={15}
                color="purple"
              />
            </div>

            {/* Recent Events */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Eventos Recentes</h2>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  Novo Evento
                </button>
              </div>
              <div className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
                {events.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Nenhum evento cadastrado</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setActiveTab('events')}
                className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all text-left"
              >
                <Calendar className="text-blue-600 mb-3" size={24} />
                <h3 className="font-semibold text-gray-900 mb-2">Criar Evento</h3>
                <p className="text-sm text-gray-600">Adicione um novo evento ao seu estabelecimento</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('settings')}
                className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all text-left"
              >
                <Settings className="text-green-600 mb-3" size={24} />
                <h3 className="font-semibold text-gray-900 mb-2">Editar Perfil</h3>
                <p className="text-sm text-gray-600">Atualize as informações do seu negócio</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('reservations')}
                className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all text-left"
              >
                <BarChart3 className="text-purple-600 mb-3" size={24} />
                <h3 className="font-semibold text-gray-900 mb-2">Ver Reservas</h3>
                <p className="text-sm text-gray-600">Gerencie as reservas do seu estabelecimento# Continuando Dashboard principal (parte 3 - resto do renderContent)
cat >> src/app/dashboard/page.tsx << 'EOF'
               <p className="text-sm text-gray-600">Gerencie as reservas do seu estabelecimento</p>
             </button>
           </div>
         </div>
       )

     case 'events':
       return (
         <div className="space-y-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h1 className="text-2xl font-bold text-gray-900">Meus Eventos</h1>
             <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
               <Plus size={16} />
               Criar Evento
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {events.map(event => (
               <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                 <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                   {event.title.substring(0, 2).toUpperCase()}
                 </div>
                 <div className="p-6">
                   <div className="flex items-start justify-between mb-3">
                     <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                     <span className={`px-2 py-1 text-xs rounded-full ${
                       event.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                     }`}>
                       {event.isActive ? 'Ativo' : 'Inativo'}
                     </span>
                   </div>
                   
                   <div className="space-y-2 mb-4">
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Calendar size={14} />
                       {new Date(event.date).toLocaleDateString('pt-BR')}
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Clock size={14} />
                       {event.time}
                     </div>
                     {event.price && (
                       <div className="flex items-center gap-2 text-sm text-gray-600">
                         <DollarSign size={14} />
                         R$ {event.price}
                       </div>
                     )}
                   </div>

                   <div className="flex items-center justify-between">
                     <div className="flex gap-2">
                       <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                         <Eye size={16} />
                       </button>
                       <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                         <Edit size={16} />
                       </button>
                       <button 
                         onClick={() => deleteEvent(event.id)}
                         className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                     <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600">
                       <Share2 size={14} />
                       Compartilhar
                     </button>
                   </div>
                 </div>
               </div>
             ))}
             
             {events.length === 0 && (
               <div className="col-span-full text-center py-12">
                 <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                 <p className="text-gray-600 mb-4">Comece criando seu primeiro evento</p>
                 <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                   <Plus size={16} />
                   Criar Primeiro Evento
                 </button>
               </div>
             )}
           </div>
         </div>
       )

     case 'reservations':
       return (
         <div className="space-y-6">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
             <div className="flex gap-2">
               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                 Hoje
               </button>
               <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                 Esta Semana
               </button>
             </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="p-6 border-b border-gray-100">
               <div className="flex items-center gap-8">
                 <div className="text-center">
                   <p className="text-2xl font-bold text-green-600">
                     {reservations.filter(r => r.status === 'confirmed').length}
                   </p>
                   <p className="text-sm text-gray-600">Confirmadas</p>
                 </div>
                 <div className="text-center">
                   <p className="text-2xl font-bold text-yellow-600">
                     {reservations.filter(r => r.status === 'pending').length}
                   </p>
                   <p className="text-sm text-gray-600">Pendentes</p>
                 </div>
                 <div className="text-center">
                   <p className="text-2xl font-bold text-blue-600">{reservations.length}</p>
                   <p className="text-sm text-gray-600">Total</p>
                 </div>
               </div>
             </div>

             <div className="divide-y divide-gray-100">
               {reservations.map(reservation => (
                 <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                         {reservation.customerName.split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                         <h3 className="font-semibold text-gray-900">{reservation.customerName}</h3>
                         <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                           <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                           <span>{reservation.time}</span>
                           <span>{reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}</span>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-4">
                       <span className={`px-3 py-1 text-sm rounded-full ${
                         reservation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                         reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                         'bg-red-100 text-red-700'
                       }`}>
                         {reservation.status === 'confirmed' ? 'Confirmada' : 
                          reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
                       </span>
                       
                       {reservation.status === 'pending' && (
                         <div className="flex gap-2">
                           <button 
                             onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                             className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                           >
                             Confirmar
                           </button>
                           <button 
                             onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                             className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                           >
                             Rejeitar
                           </button>
                         </div>
                       )}
                       
                       <a 
                         href={`tel:${reservation.customerPhone}`}
                         className="p-2 text-gray-600 hover:text-blue-600"
                       >
                         <Phone size={16} />
                       </a>
                     </div>
                   </div>
                 </div>
               ))}
               
               {reservations.length === 0 && (
                 <div className="p-12 text-center">
                   <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                   <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
                   <p className="text-gray-600">As reservas aparecerão aqui quando os clientes fizerem solicitações</p>
                 </div>
               )}
             </div>
           </div>
         </div>
       )

     default:
       return (
         <div className="text-center py-12">
           <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
           <h3 className="text-lg font-medium text-gray-900 mb-2">Em desenvolvimento</h3>
           <p className="text-gray-600">Esta seção será implementada em breve</p>
         </div>
       )
   }
 }

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
     </div>
   )
 }

 return (
   <div className="min-h-screen bg-gray-50">
     {/* Mobile Sidebar Overlay */}
     {sidebarOpen && (
       <div 
         className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
         onClick={() => setSidebarOpen(false)}
       />
     )}

     {/* Sidebar */}
     <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
       sidebarOpen ? 'translate-x-0' : '-translate-x-full'
     } lg:translate-x-0 lg:static lg:shadow-none`}>
       <div className="p-6 border-b border-gray-100">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
             {establishment?.name ? establishment.name.charAt(0).toUpperCase() : user?.name?.charAt(0)?.toUpperCase() || 'E'}
           </div>
           <div>
             <h2 className="font-bold text-gray-900">{establishment?.tradeName || establishment?.name || user?.name || 'Estabelecimento'}</h2>
             <p className="text-sm text-gray-600">{establishment?.category || 'Categoria'}</p>
           </div>
         </div>
       </div>

       <nav className="p-4 space-y-2">
         <MenuItem icon={BarChart3} label="Visão Geral" tabKey="overview" />
         <MenuItem icon={Calendar} label="Eventos" tabKey="events" count={events.length} />
         <MenuItem icon={Users} label="Reservas" tabKey="reservations" count={reservations.length} />
         <MenuItem icon={MessageCircle} label="Avaliações" tabKey="reviews" count={stats.reviewsCount} />
         <MenuItem icon={Settings} label="Configurações" tabKey="settings" />
       </nav>

       <div className="absolute bottom-4 left-4 right-4 space-y-4">
         <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all"
         >
           <LogOut size={20} />
           <span className="font-medium">Sair</span>
         </button>
         
         <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-purple-200">
           <h3 className="font-semibold text-gray-900 text-sm mb-1">Upgrade para Pro</h3>
           <p className="text-xs text-gray-600 mb-3">Mais recursos e analytics avançados</p>
           <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:shadow-lg transition-all">
             Assinar Agora
           </button>
         </div>
       </div>
     </div>

     {/* Main Content */}
     <div className="lg:ml-64 min-h-screen">
       {/* Header */}
       <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
         <div className="px-6 py-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <button 
                 onClick={() => setSidebarOpen(true)}
                 className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
               >
                 <Menu size={20} />
               </button>
               <div>
                 <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                 <p className="text-sm text-gray-600">Gerencie seu estabelecimento</p>
               </div>
             </div>

             <div className="flex items-center gap-4">
               <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                 <Bell size={20} />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
               </button>
               <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
               </div>
             </div>
           </div>
         </div>
       </header>

       {/* Main Content */}
       <main className="p-6">
         {renderContent()}
       </main>
     </div>
   </div>
 )
}
