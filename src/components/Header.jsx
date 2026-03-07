export default function Header() {
  return (
    <header className="text-center py-12 px-4 animate-fade-in-up">
      <p className="text-rose tracking-[0.3em] uppercase text-xs font-medium mb-3">
        Liste de Naissance
      </p>
      <h1 className="font-display text-text mb-4">
        <span className="text-3xl sm:text-4xl font-semibold tracking-wide">Marine</span>
        <span className="text-rose text-2xl sm:text-3xl font-normal mx-2 sm:mx-3">&</span>
        <span className="text-3xl sm:text-4xl font-semibold tracking-wide">Yoann</span>
      </h1>
      <p className="text-warm/70 text-sm tracking-widest mb-4">08.09.2026</p>
      <div className="flex items-center justify-center gap-2.5 mb-5">
        <div className="w-8 h-px bg-rose/40" />
        <svg width="10" height="9" viewBox="0 0 16 14" fill="none" className="text-rose/50">
          <path d="M8 14s-5.5-4.2-7.2-7.3C-.3 4.3.5 1.5 3.3.5 5 0 6.8.8 8 2.5 9.2.8 11 0 12.7.5c2.8 1 3.6 3.8 2.5 6.2C13.5 9.8 8 14 8 14z" fill="currentColor" />
        </svg>
        <div className="w-8 h-px bg-rose/40" />
      </div>
      <p className="text-text-light text-sm max-w-md mx-auto leading-relaxed">
        Merci de participer à l'arrivée de notre petit trésor.
      </p>
    </header>
  )
}
