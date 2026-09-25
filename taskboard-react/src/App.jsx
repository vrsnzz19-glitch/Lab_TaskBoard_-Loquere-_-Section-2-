import { useEffect, useState } from 'react'
import { api } from './api'
import LoginForm from './LoginForm'
import LogoutButton from './LogoutButton'
import ProjectList from './ProjectList'

export default function App() {
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return

    api('/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsCheckingSession(false))
  }, [])

  if (isCheckingSession) return <p>Loading...</p>
  if (!user) return <LoginForm onLogin={setUser} />

  return (
    <main>
      <header>
        <div>
          <p>TaskBoard</p>
          <h1>{user.name}&apos;s workspace</h1>
        </div>
        <LogoutButton onLogout={() => setUser(null)} />
      </header>
      <ProjectList />
    </main>
  )
}
