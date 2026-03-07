import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ReserveModal({ gift, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [surprise, setSurprise] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!surprise && !name.trim()) return

    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('items')
      .update({ statut: 'reserve', reserve_par: surprise ? 'Surprise' : name.trim() })
      .eq('id', gift.id)
      .eq('statut', 'disponible')

    if (updateError) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      onSuccess()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md p-6 pb-8 sm:pb-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center py-6 animate-scale-in">
            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#A8B5A2" strokeWidth="2"/>
                <path d="M10 16l4 4 8-8" stroke="#A8B5A2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">Merci beaucoup !</h2>
            <p className="text-text-light text-sm mb-4">
              Votre réservation pour <span className="font-medium text-text">{gift.titre}</span> est confirmée.
            </p>
            {gift.lien_url && (
              <a
                href={gift.lien_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-rose text-sm font-medium hover:underline"
              >
                Acheter sur la boutique
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 2.5h6m0 0v6m0-6L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-light hover:text-text text-xl cursor-pointer"
            >
              &times;
            </button>

            <div className="flex items-center gap-3 mb-5">
              {gift.image_url && (
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-blush flex-shrink-0">
                  <img src={gift.image_url} alt={gift.titre} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h2 className="font-display text-lg font-semibold">
                  Réserver ce cadeau
                </h2>
                <p className="text-text-light text-sm">
                  {gift.titre} {gift.prix ? `— ${gift.prix} €` : ''}
                </p>
              </div>
            </div>

            <form onSubmit={handleReserve}>
              {!surprise && (
                <>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Votre prénom et nom
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex : Peter McAlway"
                    className="w-full border border-blush rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
                    autoFocus
                    required
                  />
                </>
              )}

              <button
                type="button"
                onClick={() => setSurprise((s) => !s)}
                className={`flex items-center gap-2 mt-3 text-sm cursor-pointer transition-colors ${surprise ? 'text-rose font-medium' : 'text-text-light hover:text-text'}`}
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${surprise ? 'bg-rose border-rose' : 'border-blush'}`}>
                  {surprise && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                Cadeau surprise
              </button>

              {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || (!surprise && !name.trim())}
                className="press-effect w-full mt-4 bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Réservation...' : 'Confirmer la réservation'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
