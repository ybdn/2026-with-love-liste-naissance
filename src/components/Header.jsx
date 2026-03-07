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
    </header>
  )
}
