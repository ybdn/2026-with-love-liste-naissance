import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import GiftCard from '../components/GiftCard'
import AdminGiftForm from '../components/AdminGiftForm'

export default function AdminDashboard({ session }) {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGift, setEditingGift] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const fetchGifts = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: true })
    setGifts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchGifts()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce cadeau ?')) return
    await supabase.from('items').delete().eq('id', id)
    fetchGifts()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const reserved = gifts.filter((g) => g.statut === 'reserve').length
  const available = gifts.filter((g) => g.statut === 'disponible').length
  const total = gifts.length

  const stats = [
    {
      label: 'Réservés',
      value: reserved,
      color: 'text-sage',
      bg: 'bg-sage/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6.5 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'Disponibles',
      value: available,
      color: 'text-rose',
      bg: 'bg-rose/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="6" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: 'Total',
      value: total,
      color: 'text-warm',
      bg: 'bg-warm/10',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 7h6M7 10h4M7 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b border-blush bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold">Espace Parents</h1>
            <p className="text-text-light text-xs">{session.user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-rose text-sm hover:underline">
              Voir la liste
            </Link>
            <button
              onClick={handleLogout}
              className="text-text-light text-sm hover:text-text transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s, i) => (
            <div key={s.label} className={`bg-white rounded-2xl p-4 text-center shadow-sm animate-fade-in-up stagger-${i + 1}`}>
              <div className={`${s.bg} ${s.color} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                {s.icon}
              </div>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-text-light text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => { setEditingGift(null); setShowForm(true) }}
          className="press-effect w-full bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors mb-6 cursor-pointer"
        >
          + Ajouter un cadeau
        </button>

        {/* Recherche */}
        <div className="relative mb-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un cadeau..."
            className="w-full border border-blush rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
          />
        </div>

        {/* Filtres statut */}
        <div className="flex gap-2 mb-3">
          {[
            { key: 'all', label: `Tous (${total})` },
            { key: 'disponible', label: `Disponibles (${available})` },
            { key: 'reserve', label: `Réservés (${reserved})` },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                statusFilter === f.key
                  ? 'bg-sage text-white'
                  : 'bg-blush text-text-light hover:bg-blush/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Filtres catégorie */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'Tout' },
            { key: 'sommeil', label: '🌙 Sommeil' },
            { key: 'éveil', label: '🧸 Éveil' },
            { key: 'repas', label: '🍼 Repas' },
            { key: 'allaitement', label: '🤱 Allaitement' },
            { key: 'sorties', label: '🚼 Sorties' },
            { key: 'none', label: 'Sans catégorie' },
          ].map((c) => (
            <button
              key={c.key}
              onClick={() => setCategoryFilter(c.key)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === c.key
                  ? 'bg-rose text-white'
                  : 'bg-blush text-text-light hover:bg-blush/80'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`animate-fade-in stagger-${i + 1}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-10 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (() => {
          const filteredGifts = gifts.filter((g) => {
            if (statusFilter !== 'all' && g.statut !== statusFilter) return false
            if (categoryFilter === 'none' && g.categorie) return false
            if (categoryFilter !== 'all' && categoryFilter !== 'none' && g.categorie !== categoryFilter) return false
            if (search) {
              const q = search.toLowerCase()
              const inTitle = g.titre?.toLowerCase().includes(q)
              const inDesc = g.description?.toLowerCase().includes(q)
              const inReserve = g.reserve_par?.toLowerCase().includes(q)
              if (!inTitle && !inDesc && !inReserve) return false
            }
            return true
          })
          return filteredGifts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-light text-sm">Aucun cadeau ne correspond aux filtres.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGifts.map((gift, i) => (
              <div key={gift.id} className="relative group">
                <GiftCard gift={gift} isAdmin index={i} />
                <div className="absolute top-3 right-3 flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingGift(gift); setShowForm(true) }}
                    className="bg-white/90 backdrop-blur-sm text-text text-xs px-2.5 py-1 rounded-lg shadow-sm hover:bg-white cursor-pointer"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(gift.id)}
                    className="bg-white/90 backdrop-blur-sm text-red-500 text-xs px-2.5 py-1 rounded-lg shadow-sm hover:bg-white cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
          )
        })()}
      </div>

      {showForm && (
        <AdminGiftForm
          gift={editingGift}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchGifts() }}
        />
      )}
    </div>
  )
}
