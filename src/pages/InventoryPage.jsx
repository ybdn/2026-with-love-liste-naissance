import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'

const CATEGORIES = [
  { key: 'vêtements', label: 'vêtements 👶' },
  { key: 'bodies', label: 'bodies 🧦' },
  { key: 'jouets', label: 'jouets 🧸' },
  { key: 'puériculture', label: 'puériculture 🍼' },
  { key: 'bain', label: 'bain 🛁' },
  { key: 'chambre', label: 'chambre 🛏' },
  { key: 'accessoires', label: 'accessoires 🎒' },
  { key: 'autre', label: 'autre 📦' },
]

function StockBadge({ quantite }) {
  if (quantite === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose/15 text-rose">
        Manque
      </span>
    )
  }
  if (quantite <= 2) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warm/15 text-warm">
        Peut manquer
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage/15 text-sage">
      Bien fourni
    </span>
  )
}

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('inventory_items')
      .select('*')
      .order('categorie')
      .order('nom')
      .order('created_at')
      .then(({ data }) => {
        setItems(data || [])
        setLoading(false)
      })
  }, [])

  const grouped = items.reduce((acc, item) => {
    const cat = item.categorie
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="mb-5 animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-warm text-sm hover:text-rose transition-colors"
          >
            ← Retour à la liste des cadeaux
          </Link>
        </div>

        {/* Bandeau informatif */}
        <div className="bg-blush/50 border border-rose/20 rounded-2xl px-5 py-4 mb-6 animate-fade-in-up stagger-2">
          <p className="text-sm text-warm leading-relaxed">
            <span className="font-semibold text-text">Voici ce que nous avons déjà 📦</span><br />
            Cette liste vous aide à éviter les doublons. Si un article vous fait envie, vous pouvez tout de même l'offrir — chaque attention est la bienvenue !
          </p>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose/15 text-rose">Manque</span>
            <span className="text-xs text-text-light">= nous n'en avons pas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warm/15 text-warm">Peut manquer</span>
            <span className="text-xs text-text-light">= quantité limitée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sage/15 text-sage">Bien fourni</span>
            <span className="text-xs text-text-light">= nous en avons suffisamment</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`animate-fade-in stagger-${i + 1}`}>
                <div className="skeleton h-8 w-40 rounded-lg mb-3" />
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="skeleton h-10 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <p className="text-text-light text-sm">L'inventaire est vide pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map((cat, catIdx) => {
              const catItems = grouped[cat.key]
              if (!catItems?.length) return null
              return (
                <div key={cat.key} className={`animate-fade-in-up stagger-${Math.min(catIdx + 1, 5)}`}>
                  <h2 className="font-display text-base font-semibold text-text mb-3 capitalize">
                    {cat.label}
                  </h2>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <ul className="divide-y divide-blush/40">
                      {catItems.map((item) => (
                        <li key={item.id} className="px-4 py-3 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text">{item.nom}</p>
                            {item.taille && (
                              <p className="text-xs text-text-light mt-0.5">{item.taille}</p>
                            )}
                            {item.notes && (
                              <p className="text-xs text-text-light/70 mt-0.5 italic">{item.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-text-light tabular-nums">×{item.quantite}</span>
                            <StockBadge quantite={item.quantite} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
