import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminGiftForm({ gift, onClose, onSaved }) {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    prix: '',
    lien_url: '',
    image_url: '',
    categorie: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [autoFilled, setAutoFilled] = useState({})
  const debounceRef = useRef(null)

  useEffect(() => {
    if (gift) {
      setForm({
        titre: gift.titre || '',
        description: gift.description || '',
        prix: gift.prix || '',
        lien_url: gift.lien_url || '',
        image_url: gift.image_url || '',
        categorie: gift.categorie || '',
      })
    }
  }, [gift])

  const fetchMetadata = async (url) => {
    setFetching(true)
    setFetchError(null)
    try {
      const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
      const json = await res.json()

      if (res.status === 429) {
        setFetchError('Limite de requêtes atteinte. Remplissez les champs manuellement.')
        setFetching(false)
        return
      }

      if (json.status !== 'success' || !json.data) {
        setFetchError('Impossible de récupérer les infos du lien.')
        setFetching(false)
        return
      }

      const d = json.data
      const filled = {}

      setForm((prev) => {
        const next = { ...prev }
        if (!prev.titre && d.title) { next.titre = d.title; filled.titre = true }
        if (!prev.description && d.description) { next.description = d.description; filled.description = true }
        if (!prev.image_url && d.image?.url) { next.image_url = d.image.url; filled.image_url = true }
        if (!prev.prix && d.price) {
          const match = d.price.match(/([\d.,]+)/)
          if (match) { next.prix = match[1].replace(',', '.'); filled.prix = true }
        }
        return next
      })

      setAutoFilled((prev) => ({ ...prev, ...filled }))
    } catch {
      setFetchError('Erreur réseau. Remplissez les champs manuellement.')
    }
    setFetching(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name in autoFilled) {
      setAutoFilled((prev) => { const n = { ...prev }; delete n[name]; return n })
    }

    if (name === 'lien_url') {
      clearTimeout(debounceRef.current)
      if (value && value.startsWith('http')) {
        debounceRef.current = setTimeout(() => fetchMetadata(value), 800)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = {
      titre: form.titre,
      description: form.description || null,
      prix: form.prix ? parseFloat(form.prix) : null,
      lien_url: form.lien_url || null,
      image_url: form.image_url || null,
      categorie: form.categorie || null,
    }

    let error
    if (gift) {
      ({ error } = await supabase.from('items').update(data).eq('id', gift.id))
    } else {
      ({ error } = await supabase.from('items').insert({ ...data, statut: 'disponible' }))
    }

    setLoading(false)
    if (!error) onSaved()
  }

  const autoTag = (name) =>
    autoFilled[name] ? (
      <span className="ml-1.5 text-[10px] text-sage bg-sage/10 px-1.5 py-0.5 rounded-full font-medium">auto</span>
    ) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 pb-8 sm:pb-6 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-text text-xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="font-display text-xl font-semibold mb-5">
          {gift ? 'Modifier le cadeau' : 'Ajouter un cadeau'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lien d'achat en premier */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Lien d'achat
              {fetching && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-warm animate-pulse-soft">
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                    <path d="M8 2a6 6 0 014.9 9.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Récupération...
                </span>
              )}
            </label>
            <input
              type="url"
              name="lien_url"
              value={form.lien_url}
              onChange={handleChange}
              placeholder="https://... (coller un lien pour auto-remplir)"
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
            />
            {fetchError && (
              <p className="text-orange-500 text-xs mt-1">{fetchError}</p>
            )}
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Titre <span className="text-rose">*</span>{autoTag('titre')}
            </label>
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              placeholder="Transat Bébé"
              required
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">Catégorie</label>
            <select
              name="categorie"
              value={form.categorie}
              onChange={handleChange}
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors bg-white"
            >
              <option value="">Sans catégorie</option>
              <option value="sommeil">Sommeil</option>
              <option value="éveil">Éveil</option>
              <option value="repas">Repas</option>
              <option value="allaitement">Allaitement</option>
              <option value="sorties">Sorties</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Description{autoTag('description')}
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Couleur gris chiné"
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
            />
          </div>

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Prix indicatif (€){autoTag('prix')}
            </label>
            <input
              type="number"
              name="prix"
              value={form.prix}
              onChange={handleChange}
              placeholder="49.90"
              step="0.01"
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              URL de l'image{autoTag('image_url')}
            </label>
            <input
              type="url"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
            />
            {form.image_url && (
              <div className="mt-2 rounded-xl overflow-hidden bg-blush aspect-[4/3] max-w-[160px]">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.parentElement.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !form.titre.trim()}
            className="press-effect w-full bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Enregistrement...' : gift ? 'Enregistrer' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  )
}
