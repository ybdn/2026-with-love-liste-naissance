import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 bg-blush rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-warm">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-semibold text-text">
              Espace Parents
            </h1>
            <p className="text-text-light text-sm mt-1">
              Connectez-vous pour gérer votre liste
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-blush rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-blush rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="press-effect w-full bg-sage text-white font-medium py-3 rounded-xl hover:bg-sage/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="block text-center text-text-light text-sm mt-5 hover:text-text transition-colors"
        >
          &larr; Retour à la liste
        </Link>
      </div>
    </div>
  )
}
