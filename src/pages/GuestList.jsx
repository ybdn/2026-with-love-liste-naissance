import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import GiftCard from '../components/GiftCard'
import ReserveModal from '../components/ReserveModal'

export default function GuestList() {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedGift, setSelectedGift] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchGifts = async () => {
    const { data } = await supabase
      .from('items')
      .select('id, titre, description, prix, lien_url, image_url, statut')
      .order('created_at', { ascending: true })
    setGifts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchGifts()
  }, [])

  const filtered = filter === 'available'
    ? gifts.filter((g) => g.statut === 'disponible')
    : gifts

  const available = gifts.filter((g) => g.statut === 'disponible').length
  const total = gifts.length

  const handleSuccess = () => {
    setSelectedGift(null)
    setShowConfirm(true)
    fetchGifts()
    setTimeout(() => setShowConfirm(false), 4000)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-light text-sm">
            {available} disponible{available > 1 ? 's' : ''} sur {total}
          </p>
          <div className="flex gap-2">
            {['all', 'available'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  filter === f
                    ? 'bg-sage text-white'
                    : 'bg-blush text-text-light hover:bg-blush/80'
                }`}
              >
                {f === 'all' ? 'Tous' : 'Disponibles'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-text-light">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-text-light">
            Aucun cadeau pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onReserve={setSelectedGift}
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

      {showConfirm && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-sage text-white px-6 py-3 rounded-2xl shadow-lg text-sm font-medium z-50 animate-fade-in">
          Cadeau réservé avec succès !
        </div>
      )}
    </div>
  )
}
