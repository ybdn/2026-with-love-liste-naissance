import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import GuestNavTabs from '../components/GuestNavTabs'
import { VETEMENTS_CATEGORIES, AUTRES_CATEGORIES, GROUPES_VETEMENTS } from '../lib/inventoryCategories'

function buildGroupedDisplay(items) {
  const grouped = items.reduce((acc, item) => {
    const cat = item.categorie
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const sections = []

  GROUPES_VETEMENTS.forEach((groupe) => {
    const cats = VETEMENTS_CATEGORIES.filter((c) => c.groupe === groupe)
    const groupeItems = cats.flatMap((c) => grouped[c.key] || [])
    if (!groupeItems.length) return

    const firstCat = cats[0]
    const label = firstCat.label.replace(/ ML| MC/, '')
    const subsections = []

    cats.forEach((cat) => {
      const catItems = grouped[cat.key] || []
      if (!catItems.length) return
      subsections.push({ manches: cat.manches, items: catItems })
    })

    sections.push({ key: groupe, label, emoji: firstCat.emoji, subsections })
  })

  AUTRES_CATEGORIES.forEach((cat) => {
    const catItems = grouped[cat.key] || []
    if (!catItems.length) return
    sections.push({ key: cat.key, label: cat.label, emoji: cat.emoji, subsections: [{ manches: null, items: catItems }] })
  })

  return sections
}

function ItemRow({ item }) {
  return (
    <li className="px-4 py-3 flex items-start justify-between gap-3">
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
      </div>
    </li>
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

  const sections = buildGroupedDisplay(items)

  return (
    <div className="min-h-screen">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pb-12">

        <GuestNavTabs />

        {/* Bandeau informatif */}
        <div className="bg-blush/50 border border-rose/20 rounded-2xl px-5 py-4 mb-6 animate-fade-in-up stagger-2">
          <p className="text-sm text-warm leading-relaxed">
            <span className="font-semibold text-text">Voici ce que nous avons déjà 📦</span><br />
            Cette liste vous aide à éviter les doublons. Si un article vous fait envie, vous pouvez tout de même l'offrir — chaque attention est la bienvenue !
          </p>
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
            {sections.map((section, sIdx) => (
              <div key={section.key} className={`animate-fade-in-up stagger-${Math.min(sIdx + 1, 5)}`}>
                <h2 className="font-display text-base font-semibold text-text mb-3 capitalize">
                  {section.emoji} {section.label}
                </h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {section.subsections.map((sub, subIdx) => (
                    <div key={subIdx}>
                      {sub.manches && (
                        <p className="px-4 pt-3 pb-1 text-xs font-medium text-text-light/70 italic">
                          {sub.manches}
                        </p>
                      )}
                      <ul className="divide-y divide-blush/40">
                        {sub.items.map((item) => (
                          <ItemRow key={item.id} item={item} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
