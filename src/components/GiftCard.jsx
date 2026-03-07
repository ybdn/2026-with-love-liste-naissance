const CATEGORY_LABELS = {
  sommeil: '🌙 Sommeil',
  'éveil': '🧸 Éveil',
  repas: '🍼 Repas',
  allaitement: '🤱 Allaitement',
  sorties: '🚼 Sorties',
}

export default function GiftCard({ gift, onReserve, isAdmin, index = 0 }) {
  const reserved = gift.statut === 'reserve'

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 animate-fade-in-up stagger-${Math.min(index + 1, 9)} ${reserved ? '' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-blush">
        {gift.image_url ? (
          <img
            src={gift.image_url}
            alt={gift.titre}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            className="w-full h-full object-contain"
          />
        ) : null}
        <div className={`${gift.image_url ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-rose/30">
            <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 21V12m0 0H3l9-9 9 9h-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 3v3M9 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {gift.prix && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-warm font-semibold text-sm px-2.5 py-1 rounded-lg shadow-sm">
            {gift.prix} €
          </span>
        )}

        {reserved && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/95 backdrop-blur-sm text-text font-medium text-sm px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#A8B5A2" strokeWidth="1.5"/>
                <path d="M5 8l2 2 4-4" stroke="#A8B5A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Réservé
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        {gift.categorie && (
          <span className="inline-block text-[10px] font-medium text-warm bg-warm/10 px-2 py-0.5 rounded-full mb-2">
            {CATEGORY_LABELS[gift.categorie] || gift.categorie}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-text mb-1">
          {gift.titre}
        </h3>
        {gift.description && (
          <p className="text-text-light text-sm mb-3 line-clamp-2">
            {gift.description}
          </p>
        )}

        {!isAdmin && !reserved && (
          <>
            <button
              onClick={() => onReserve(gift)}
              className="press-effect w-full bg-sage text-white text-sm font-medium py-2.5 rounded-xl hover:bg-sage/90 transition-colors cursor-pointer"
            >
              Je l'offre
            </button>
            {gift.lien_url && (
              <a
                href={gift.lien_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-rose text-xs mt-2 hover:underline"
              >
                Voir sur la boutique
              </a>
            )}
          </>
        )}

        {!isAdmin && reserved && (
          <p className="text-center text-text-light text-xs italic">
            Déjà réservé par un proche
          </p>
        )}

        {isAdmin && reserved && (
          <p className="text-center text-sage text-xs font-medium italic">
            Réservé par un proche
          </p>
        )}
      </div>
    </div>
  )
}
