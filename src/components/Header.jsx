import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="text-center py-10 px-4">
      <p className="text-rose tracking-[0.3em] uppercase text-xs font-medium mb-2">
        Liste de Naissance
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-text mb-3">
        2026 <span className="text-rose italic">with Love</span>
      </h1>
      <div className="w-16 h-px bg-rose mx-auto mb-4" />
      <p className="text-text-light text-sm max-w-md mx-auto leading-relaxed">
        Merci de participer à l'arrivée de notre petit trésor.
        Choisissez un cadeau et réservez-le en un clic&nbsp;!
      </p>
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 mt-5 text-warm/50 text-xs hover:text-warm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
        </svg>
        Espace Parents
      </Link>
    </header>
  )
}
