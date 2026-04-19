import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES, VETEMENTS_CATEGORIES, AUTRES_CATEGORIES, GROUPES_VETEMENTS } from '../lib/inventoryCategories'

const TAILLES = ['naissance', '0-3 mois', '3-6 mois', '6-12 mois', '12-18 mois', '18-24 mois', '2 ans', 'taille unique']

const EMPTY_FORM = { categorie: 'bodies-ml', nom: '', taille: '', quantite: 1, notes: '' }

function AddItemSheet({ onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async () => {
    if (!form.nom.trim()) return
    setSaving(true)
    await supabase.from('inventory_items').insert(form)
    setSaving(false)
    onSaved()
  }

  const renderCatButton = (c) => (
    <button
      key={c.key}
      onClick={() => set('categorie', c.key)}
      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all cursor-pointer ${
        form.categorie === c.key
          ? 'bg-rose/10 ring-1 ring-rose/30'
          : 'bg-blush/30 hover:bg-blush/60'
      }`}
    >
      <span className="text-lg leading-none">{c.emoji}</span>
      <span className={`text-[10px] font-medium leading-tight text-center ${form.categorie === c.key ? 'text-rose' : 'text-text-light'}`}>
        {c.label}
      </span>
      {c.manches && (
        <span className={`text-[8px] leading-none ${form.categorie === c.key ? 'text-rose/70' : 'text-text-light/50'}`}>
          {c.manches === 'manches longues' ? 'ML' : 'MC'}
        </span>
      )}
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 max-h-[90dvh] overflow-y-auto animate-slide-up">
        {/* Handle */}
        <div className="w-10 h-1 bg-blush rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold">Nouvel article</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-blush/60 text-text-light hover:bg-blush cursor-pointer">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Catégorie — Vêtements */}
        <div className="mb-5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide mb-2 block">Vêtements</label>
          <div className="grid grid-cols-4 gap-2">
            {VETEMENTS_CATEGORIES.map(renderCatButton)}
          </div>
        </div>

        {/* Catégorie — Autres */}
        <div className="mb-5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide mb-2 block">Autres</label>
          <div className="grid grid-cols-4 gap-2">
            {AUTRES_CATEGORIES.map(renderCatButton)}
          </div>
        </div>

        {/* Nom */}
        <div className="mb-4">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide mb-2 block">Nom de l'article</label>
          <input
            type="text"
            value={form.nom}
            onChange={(e) => set('nom', e.target.value)}
            placeholder="ex : body manches longues blanc"
            className="w-full border border-blush rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
            autoFocus
          />
        </div>

        {/* Taille */}
        <div className="mb-5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide mb-2.5 block">Taille <span className="normal-case font-normal">(optionnel)</span></label>
          <div className="flex flex-wrap gap-2">
            {TAILLES.map((t) => (
              <button
                key={t}
                onClick={() => set('taille', form.taille === t ? '' : t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  form.taille === t
                    ? 'bg-sage text-white'
                    : 'bg-blush/50 text-text-light hover:bg-blush'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Quantité */}
        <div className="mb-5">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide mb-2.5 block">Quantité</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => set('quantite', Math.max(0, form.quantite - 1))}
              className="w-11 h-11 rounded-full bg-blush flex items-center justify-center text-xl text-text-light hover:bg-rose/15 hover:text-rose transition-colors cursor-pointer"
            >−</button>
            <span className="text-2xl font-semibold text-text w-10 text-center tabular-nums">{form.quantite}</span>
            <button
              onClick={() => set('quantite', form.quantite + 1)}
              className="w-11 h-11 rounded-full bg-blush flex items-center justify-center text-xl text-text-light hover:bg-sage/15 hover:text-sage transition-colors cursor-pointer"
            >+</button>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="text-xs font-medium text-text-light uppercase tracking-wide mb-2 block">Notes <span className="normal-case font-normal">(optionnel)</span></label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="ex : offert par mamie, à compléter…"
            className="w-full border border-blush rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!form.nom.trim() || saving}
          className="w-full bg-sage text-white font-medium py-3.5 rounded-xl hover:bg-sage/90 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {saving ? 'Enregistrement…' : 'Ajouter à l\'inventaire'}
        </button>
      </div>
    </div>
  )
}

function buildGroupedDisplay(items) {
  const grouped = items.reduce((acc, item) => {
    const cat = item.categorie
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const rows = []

  // Section vêtements — groupée par famille (groupe)
  GROUPES_VETEMENTS.forEach((groupe) => {
    const cats = VETEMENTS_CATEGORIES.filter((c) => c.groupe === groupe)
    const groupeItems = cats.flatMap((c) => grouped[c.key] || [])
    if (!groupeItems.length) return

    const firstCat = cats[0]
    rows.push({ type: 'groupe-header', label: firstCat.label.replace(/ ML| MC/, ''), emoji: firstCat.emoji, key: groupe })

    cats.forEach((cat) => {
      const catItems = grouped[cat.key] || []
      if (!catItems.length) return
      if (cat.manches) {
        rows.push({ type: 'sous-header', label: cat.manches, key: `${cat.key}-header` })
      }
      catItems.forEach((item) => rows.push({ type: 'item', item }))
    })
  })

  // Section autres catégories
  AUTRES_CATEGORIES.forEach((cat) => {
    const catItems = grouped[cat.key] || []
    if (!catItems.length) return
    rows.push({ type: 'groupe-header', label: cat.label, emoji: cat.emoji, key: cat.key })
    catItems.forEach((item) => rows.push({ type: 'item', item }))
  })

  return rows
}

export default function InventoryAdminTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState({})
  const [savedId, setSavedId] = useState(null)
  const [groupByCategory, setGroupByCategory] = useState(true)
  const [showAddSheet, setShowAddSheet] = useState(false)

  const fetchItems = async () => {
    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .order('categorie')
      .order('nom')
      .order('created_at')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const showSaved = (id) => {
    setSavedId(id)
    setTimeout(() => setSavedId(null), 1500)
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditingData({ categorie: item.categorie, nom: item.nom, taille: item.taille || '', quantite: item.quantite, notes: item.notes || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingData({})
  }

  const saveEdit = async (id) => {
    await supabase.from('inventory_items').update(editingData).eq('id', id)
    setEditingId(null)
    setEditingData({})
    fetchItems()
    showSaved(id)
  }

  const updateQuantity = async (item, delta) => {
    const newQty = Math.max(0, item.quantite + delta)
    await supabase.from('inventory_items').update({ quantite: newQty }).eq('id', item.id)
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, quantite: newQty } : i))
    showSaved(item.id)
  }

  const deleteItem = async (id) => {
    if (!confirm('Supprimer cet article ?')) return
    await supabase.from('inventory_items').delete().eq('id', id)
    fetchItems()
  }

  const renderRow = (item) => {
    const isEditing = editingId === item.id
    const isSaved = savedId === item.id

    if (isEditing) {
      return (
        <tr key={item.id} className="bg-blush/20">
          <td className="px-3 py-2 hidden sm:table-cell">
            <select
              value={editingData.categorie}
              onChange={(e) => setEditingData({ ...editingData, categorie: e.target.value })}
              className="w-full border border-blush rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sage/30"
            >
              <optgroup label="Vêtements">
                {VETEMENTS_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </optgroup>
              <optgroup label="Autres">
                {AUTRES_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </optgroup>
            </select>
          </td>
          <td className="px-3 py-2">
            <input
              type="text"
              value={editingData.nom}
              onChange={(e) => setEditingData({ ...editingData, nom: e.target.value })}
              className="w-full border border-blush rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              autoFocus
            />
          </td>
          <td className="px-3 py-2">
            <input
              list="tailles-list"
              value={editingData.taille}
              onChange={(e) => setEditingData({ ...editingData, taille: e.target.value })}
              className="w-full border border-blush rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              placeholder="ex: 0-3 mois"
            />
            <datalist id="tailles-list">
              {TAILLES.map((t) => <option key={t} value={t} />)}
            </datalist>
          </td>
          <td className="px-3 py-2">
            <input
              type="number"
              min="0"
              value={editingData.quantite}
              onChange={(e) => setEditingData({ ...editingData, quantite: parseInt(e.target.value) || 0 })}
              className="w-16 border border-blush rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </td>
          <td className="px-3 py-2 hidden sm:table-cell">
            <input
              type="text"
              value={editingData.notes}
              onChange={(e) => setEditingData({ ...editingData, notes: e.target.value })}
              className="w-full border border-blush rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              placeholder="Notes…"
            />
          </td>
          <td className="px-3 py-2">
            <div className="flex gap-1">
              <button onClick={() => saveEdit(item.id)} className="text-xs px-2.5 py-1 bg-sage text-white rounded-lg hover:bg-sage/90 cursor-pointer">✓</button>
              <button onClick={cancelEdit} className="text-xs px-2.5 py-1 bg-blush text-text-light rounded-lg hover:bg-blush/80 cursor-pointer">✕</button>
            </div>
          </td>
        </tr>
      )
    }

    return (
      <tr
        key={item.id}
        onClick={() => startEdit(item)}
        className="hover:bg-blush/10 cursor-pointer transition-colors"
      >
        <td className="px-3 py-2.5 hidden sm:table-cell text-xs text-text-light">
          {CATEGORIES.find((c) => c.key === item.categorie)?.emoji} {item.categorie}
        </td>
        <td className="px-3 py-2.5 text-sm text-text font-medium">{item.nom}</td>
        <td className="px-3 py-2.5 text-sm text-text-light">{item.taille || '—'}</td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => updateQuantity(item, -1)}
              className="w-6 h-6 rounded-full bg-blush text-text-light hover:bg-rose/20 hover:text-rose transition-colors text-sm leading-none flex items-center justify-center cursor-pointer"
            >−</button>
            <span className={`w-7 text-center text-sm font-semibold transition-colors ${
              isSaved ? 'text-sage' : item.quantite === 0 ? 'text-rose' : item.quantite <= 2 ? 'text-warm' : 'text-text'
            }`}>
              {isSaved ? '✓' : item.quantite}
            </span>
            <button
              onClick={() => updateQuantity(item, 1)}
              className="w-6 h-6 rounded-full bg-blush text-text-light hover:bg-sage/20 hover:text-sage transition-colors text-sm leading-none flex items-center justify-center cursor-pointer"
            >+</button>
          </div>
        </td>
        <td className="px-3 py-2.5 text-sm text-text-light hidden sm:table-cell">{item.notes || '—'}</td>
        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => deleteItem(item.id)}
            className="text-red-400 hover:text-red-600 text-xs cursor-pointer"
          >
            Suppr.
          </button>
        </td>
      </tr>
    )
  }

  const tableHeader = (
    <thead>
      <tr className="border-b border-blush/60">
        <th className="text-left px-3 py-2.5 text-xs font-medium text-text-light hidden sm:table-cell">Catégorie</th>
        <th className="text-left px-3 py-2.5 text-xs font-medium text-text-light">Article</th>
        <th className="text-left px-3 py-2.5 text-xs font-medium text-text-light">Taille</th>
        <th className="text-left px-3 py-2.5 text-xs font-medium text-text-light">Qté</th>
        <th className="text-left px-3 py-2.5 text-xs font-medium text-text-light hidden sm:table-cell">Notes</th>
        <th className="px-3 py-2.5"></th>
      </tr>
    </thead>
  )

  if (loading) {
    return <div className="py-12 text-center text-text-light text-sm">Chargement…</div>
  }

  const groupedDisplay = buildGroupedDisplay(items)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-light">
          {items.length} article{items.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setGroupByCategory(!groupByCategory)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
            groupByCategory ? 'bg-rose/15 text-rose' : 'bg-blush text-text-light hover:bg-blush/80'
          }`}
        >
          Grouper par catégorie
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div className="overflow-x-auto">
          {items.length === 0 ? (
            <div className="py-12 text-center text-text-light text-sm">
              Aucun article. Ajoutez-en un avec le bouton ci-dessous.
            </div>
          ) : groupByCategory ? (
            <table className="w-full">
              {tableHeader}
              <tbody>
                {groupedDisplay.map((row) => {
                  if (row.type === 'groupe-header') {
                    return (
                      <tr key={row.key} className="bg-blush/20">
                        <td colSpan={6} className="px-3 py-2 text-xs font-semibold text-warm uppercase tracking-wide">
                          {row.emoji} {row.label}
                        </td>
                      </tr>
                    )
                  }
                  if (row.type === 'sous-header') {
                    return (
                      <tr key={row.key} className="bg-blush/10">
                        <td colSpan={6} className="px-4 py-1.5 text-[11px] italic text-text-light/80">
                          {row.label}
                        </td>
                      </tr>
                    )
                  }
                  return renderRow(row.item)
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              {tableHeader}
              <tbody>{items.map(renderRow)}</tbody>
            </table>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowAddSheet(true)}
        className="press-effect w-full bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors cursor-pointer"
      >
        + Ajouter un article
      </button>

      {showAddSheet && (
        <AddItemSheet
          onClose={() => setShowAddSheet(false)}
          onSaved={() => { setShowAddSheet(false); fetchItems() }}
        />
      )}
    </div>
  )
}
