import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ReserveModal({ gift, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('items')
      .update({ statut: 'reserve', reserve_par: name.trim() })
      .eq('id', gift.id)
      .eq('statut', 'disponible')

    if (updateError) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 pb-8 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-text text-xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="font-display text-xl font-semibold mb-1">
          Réserver ce cadeau
        </h2>
        <p className="text-text-light text-sm mb-5">
          {gift.titre} {gift.prix ? `— ${gift.prix} €` : ''}
        </p>

        <form onSubmit={handleReserve}>
          <label className="block text-sm font-medium text-text mb-1.5">
            Votre prénom et nom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Marie Dupont"
            className="w-full border border-blush rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
            autoFocus
            required
          />

          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full mt-4 bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Réservation...' : 'Confirmer la réservation'}
          </button>
        </form>

        {gift.lien_url && (
          <a
            href={gift.lien_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-rose text-sm mt-4 hover:underline"
          >
            Acheter sur la boutique &rarr;
          </a>
        )}
      </div>
    </div>
  )
}
