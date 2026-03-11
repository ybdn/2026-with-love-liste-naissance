import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import GuestList from './pages/GuestList'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<GuestList />} />
      <Route path="/admin" element={session ? <AdminDashboard session={session} /> : <AdminLogin />} />
    </Routes>
  )
}
