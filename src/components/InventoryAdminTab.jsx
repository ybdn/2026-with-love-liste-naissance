import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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

const TAILLES = ['naissance', '0-3 mois', '3-6 mois', '6-12 mois', '12-18 mois', '18-24 mois', '2 ans', 'taille unique']

const EMPTY_ITEM = { categorie: 'vêtements', nom: '', taille: '', quantite: 1, notes: '' }

export default function InventoryAdminTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState({})
  const [savedId, setSavedId] = useState(null)
  const [groupByCategory, setGroupByCategory] = useState(true)
  const [newRow, setNewRow] = useState(null)

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

  const addRow = () => {
    setNewRow({ ...EMPTY_ITEM })
    setEditingId(null)
  }

  const saveNewRow = async () => {
    if (!newRow.nom.trim()) return
    const { data } = await supabase.from('inventory_items').insert(newRow).select().single()
    setNewRow(null)
    fetchItems()
    if (data) showSaved(data.id)
  }

  const cancelNewRow = () => setNewRow(null)

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
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
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
          {CATEGORIES.find((c) => c.key === item.categorie)?.label || item.categorie}
        </td>
        <td className="px-3 py-2.5 text-sm text-text font-medium">{item.nom}</td>
        <td className="px-3 py-2.5 text-sm text-text-light">{item.taille || '—'}</td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => updateQuantity(item, -1)}
              className="w-6 h-6 rounded-full bg-blush text-text-light hover:bg-rose/20 hover:text-rose transition-colors text-sm leading-none flex items-center justify-center cursor-pointer"
            >−</button>
            <span className={`w-7 text-center text-sm font-semibold ${
              isSaved ? 'text-sage' : item.quantite === 0 ? 'text-rose' : item.quantite <= 2 ? 'text-warm' : 'text-sage'
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

  const renderNewRow = () => {
    if (!newRow) return null
    return (
      <tr className="bg-sage/5">
        <td className="px-3 py-2 hidden sm:table-cell">
          <select
            value={newRow.categorie}
            onChange={(e) => setNewRow({ ...newRow, categorie: e.target.value })}
            className="w-full border border-blush rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sage/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2">
          <input
            type="text"
            value={newRow.nom}
            onChange={(e) => setNewRow({ ...newRow, nom: e.target.value })}
            className="w-full border border-blush rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            placeholder="Nom de l'article…"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') saveNewRow() }}
          />
        </td>
        <td className="px-3 py-2">
          <input
            list="tailles-list-new"
            value={newRow.taille}
            onChange={(e) => setNewRow({ ...newRow, taille: e.target.value })}
            className="w-full border border-blush rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            placeholder="ex: 0-3 mois"
          />
          <datalist id="tailles-list-new">
            {TAILLES.map((t) => <option key={t} value={t} />)}
          </datalist>
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            min="0"
            value={newRow.quantite}
            onChange={(e) => setNewRow({ ...newRow, quantite: parseInt(e.target.value) || 0 })}
            className="w-16 border border-blush rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-sage/30"
          />
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          <input
            type="text"
            value={newRow.notes}
            onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
            className="w-full border border-blush rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            placeholder="Notes…"
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-1">
            <button onClick={saveNewRow} className="text-xs px-2.5 py-1 bg-sage text-white rounded-lg hover:bg-sage/90 cursor-pointer">✓</button>
            <button onClick={cancelNewRow} className="text-xs px-2.5 py-1 bg-blush text-text-light rounded-lg hover:bg-blush/80 cursor-pointer">✕</button>
          </div>
        </td>
      </tr>
    )
  }

  const grouped = items.reduce((acc, item) => {
    const cat = item.categorie
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

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
    return (
      <div className="py-12 text-center text-text-light text-sm">Chargement…</div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-light">
          {items.length} article{items.length !== 1 ? 's' : ''} dans l'inventaire
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
          {groupByCategory && items.length > 0 ? (
            <table className="w-full">
              {tableHeader}
              <tbody>
                {CATEGORIES.map((cat) => {
                  const catItems = grouped[cat.key]
                  if (!catItems?.length) return null
                  return (
                    <>
                      <tr key={`cat-${cat.key}`} className="bg-blush/20">
                        <td colSpan={6} className="px-3 py-2 text-xs font-semibold text-warm uppercase tracking-wide">
                          {cat.label}
                        </td>
                      </tr>
                      {catItems.map(renderRow)}
                    </>
                  )
                })}
                {renderNewRow()}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              {tableHeader}
              <tbody>
                {items.map(renderRow)}
                {renderNewRow()}
              </tbody>
            </table>
          )}

          {items.length === 0 && !newRow && (
            <div className="py-12 text-center text-text-light text-sm">
              Aucun article dans l'inventaire. Ajoutez-en un ci-dessous.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={addRow}
        className="w-full border-2 border-dashed border-blush text-text-light text-sm py-3 rounded-xl hover:border-sage/40 hover:text-sage transition-colors cursor-pointer"
      >
        + Ajouter une ligne
      </button>
    </div>
  )
}
