import { Link, useLocation } from 'react-router-dom'

export default function GuestNavTabs() {
  const { pathname } = useLocation()
  const isInventory = pathname === '/inventaire'

  return (
    <div className="flex gap-1 bg-blush/50 p-1 rounded-2xl mb-5">
      <Link
        to="/"
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
          !isInventory
            ? 'bg-white text-text shadow-sm'
            : 'text-text-light hover:text-text'
        }`}
      >
        <span>🎁</span>
        <span>Liste de cadeaux</span>
      </Link>
      <Link
        to="/inventaire"
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
          isInventory
            ? 'bg-white text-text shadow-sm'
            : 'text-text-light hover:text-text'
        }`}
      >
        <span>📋</span>
        <span>Ce qu'on a déjà</span>
      </Link>
    </div>
  )
}
