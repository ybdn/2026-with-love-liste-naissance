export default function GiftCard({ gift, onReserve, isAdmin }) {
  const reserved = gift.statut === 'reserve'

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${reserved ? 'opacity-75' : 'hover:shadow-md hover:-translate-y-0.5'}`}>
      {gift.image_url && (
        <div className="aspect-square overflow-hidden bg-blush">
          <img
            src={gift.image_url}
            alt={gift.titre}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-text mb-1">
          {gift.titre}
        </h3>
        {gift.description && (
          <p className="text-text-light text-sm mb-3 line-clamp-2">
            {gift.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-warm font-semibold text-lg">
            {gift.prix ? `${gift.prix} €` : ''}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${reserved ? 'bg-blush text-warm' : 'bg-sage-light/40 text-sage'}`}>
            {reserved ? 'Réservé' : 'Disponible'}
          </span>
        </div>

        {!isAdmin && !reserved && (
          <button
            onClick={() => onReserve(gift)}
            className="w-full bg-sage text-white text-sm font-medium py-2.5 rounded-xl hover:bg-sage/90 transition-colors cursor-pointer"
          >
            Je l'offre
          </button>
        )}

        {!isAdmin && reserved && gift.lien_url && (
          <p className="text-center text-text-light text-xs italic">
            Déjà réservé par un proche
          </p>
        )}

        {!isAdmin && !reserved && gift.lien_url && (
          <a
            href={gift.lien_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-rose text-xs mt-2 hover:underline"
          >
            Voir sur la boutique
          </a>
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
