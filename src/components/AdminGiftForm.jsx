import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminGiftForm({ gift, onClose, onSaved }) {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    prix: '',
    lien_url: '',
    image_url: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (gift) {
      setForm({
        titre: gift.titre || '',
        description: gift.description || '',
        prix: gift.prix || '',
        lien_url: gift.lien_url || '',
        image_url: gift.image_url || '',
      })
    }
  }, [gift])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
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

  const fields = [
    { name: 'titre', label: 'Titre', required: true, placeholder: 'Transat Bébé' },
    { name: 'description', label: 'Description', placeholder: 'Couleur gris chiné' },
    { name: 'prix', label: 'Prix indicatif (€)', type: 'number', placeholder: '49.90' },
    { name: 'lien_url', label: "Lien d'achat", type: 'url', placeholder: 'https://...' },
    { name: 'image_url', label: "URL de l'image", type: 'url', placeholder: 'https://...' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg p-6 pb-8 sm:pb-6 max-h-[90vh] overflow-y-auto"
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
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-text mb-1">
                {f.label} {f.required && <span className="text-rose">*</span>}
              </label>
              <input
                type={f.type || 'text'}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required={f.required}
                step={f.type === 'number' ? '0.01' : undefined}
                className="w-full border border-blush rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading || !form.titre.trim()}
            className="w-full bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Enregistrement...' : gift ? 'Enregistrer' : 'Ajouter'}
          </button>
        </form>
      </div>
    </div>
  )
}
