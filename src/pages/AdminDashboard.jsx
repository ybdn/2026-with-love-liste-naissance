import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import GiftCard from '../components/GiftCard'
import AdminGiftForm from '../components/AdminGiftForm'

export default function AdminDashboard({ session }) {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGift, setEditingGift] = useState(null)

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
  const total = gifts.length

  return (
    <div className="min-h-screen">
      <header className="border-b border-blush bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold">Espace Parents</h1>
            <p className="text-text-light text-xs">{session.user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-text-light text-sm hover:text-text transition-colors cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-sage">{reserved}</p>
            <p className="text-text-light text-xs">Réservés</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-2xl font-semibold text-warm">{total}</p>
            <p className="text-text-light text-xs">Total</p>
          </div>
        </div>

        <button
          onClick={() => { setEditingGift(null); setShowForm(true) }}
          className="w-full bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors mb-6 cursor-pointer"
        >
          + Ajouter un cadeau
        </button>

        {loading ? (
          <div className="text-center py-20 text-text-light">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gifts.map((gift) => (
              <div key={gift.id} className="relative group">
                <GiftCard gift={gift} isAdmin />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
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
        )}
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
