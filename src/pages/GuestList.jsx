import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import GiftCard from '../components/GiftCard'
import ReserveModal from '../components/ReserveModal'

export default function GuestList() {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchGifts = async () => {
    const { data } = await supabase
      .from('items')
      .select('id, titre, description, prix, lien_url, image_url, statut, categorie')
      .order('created_at', { ascending: true })
    setGifts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchGifts()
  }, [])

  const filtered = gifts.filter((g) => {
    if (filter === 'available' && g.statut !== 'disponible') return false
    if (categoryFilter !== 'all' && g.categorie !== categoryFilter) return false
    return true
  })

  const available = gifts.filter((g) => g.statut === 'disponible').length
  const total = gifts.length

  const handleSuccess = () => {
    setSelectedGift(null)
    fetchGifts()
    setToast('in')
    setTimeout(() => setToast('out'), 3500)
    setTimeout(() => setToast(null), 3800)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm mb-6 animate-fade-in-up stagger-3">
          {/* Bouton toggle */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-warm">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium text-text">Filtrer</span>
              {(categoryFilter !== 'all' || filter !== 'all') && (
                <span className="bg-rose/15 text-rose text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {(categoryFilter !== 'all' ? 1 : 0) + (filter !== 'all' ? 1 : 0)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-light text-xs">
                {available}/{total} disponible{available > 1 ? 's' : ''}
              </span>
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className={`text-text-light transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`}
              >
                <path d="M3.5 5.25L7 8.75l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Contenu des filtres */}
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: filtersOpen ? '300px' : '0' }}
          >
            <div className="px-4 pb-4">
              {/* Catégories — grille centrée */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {[
                  { key: 'all', emoji: '✨', label: 'Tout' },
                  { key: 'sommeil', emoji: '🌙', label: 'Sommeil' },
                  { key: 'éveil', emoji: '🧸', label: 'Éveil' },
                  { key: 'repas', emoji: '🍼', label: 'Repas' },
                  { key: 'allaitement', emoji: '🤱', label: 'Allaitement' },
                  { key: 'sorties', emoji: '🚼', label: 'Sorties' },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setCategoryFilter(c.key)}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                      categoryFilter === c.key
                        ? 'bg-rose/10 ring-1 ring-rose/30 scale-[1.02]'
                        : 'hover:bg-blush/50'
                    }`}
                  >
                    <span className="text-lg leading-none">{c.emoji}</span>
                    <span className={`text-[11px] font-medium ${
                      categoryFilter === c.key ? 'text-rose' : 'text-text-light'
                    }`}>
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Toggle disponibilité */}
              <div className="flex items-center justify-between pt-3 border-t border-blush/60">
                <span className="text-xs text-text-light">Disponibles uniquement</span>
                <button
                  onClick={() => setFilter(filter === 'all' ? 'available' : 'all')}
                  className="cursor-pointer"
                >
                  <div className={`w-9 h-5 rounded-full transition-colors relative ${
                    filter === 'available' ? 'bg-sage' : 'bg-blush'
                  }`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      filter === 'available' ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-rose/30">
              <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 10h18M8 6V3m8 3V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-text-light mb-3">
              {filter === 'available' ? 'Tous les cadeaux ont été réservés !' : 'Aucun cadeau pour le moment.'}
            </p>
            {filter === 'available' && (
              <button
                onClick={() => setFilter('all')}
                className="text-rose text-sm font-medium hover:underline cursor-pointer"
              >
                Voir tous les cadeaux
              </button>
            )}
          </div>
        ) : (
          <div key={filter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((gift, i) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onReserve={setSelectedGift}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {selectedGift && (
        <ReserveModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Footer discret */}
      <footer className="border-t border-blush/40 mt-8 py-6 text-center">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-warm/40 text-xs hover:text-warm/70 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
          </svg>
          Espace Parents
        </Link>
      </footer>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 bg-sage text-white px-6 py-3 rounded-2xl shadow-lg text-sm font-medium z-50 ${toast === 'in' ? 'animate-toast-in' : 'animate-toast-out'}`}>
          Cadeau réservé avec succès !
        </div>
      )}
    </div>
  )
}
