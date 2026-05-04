import { useEffect, useRef } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import { useAuthSyncSession } from '@/stores/authStore'
import { Layout } from './components/Layout'

export default function App() {
  const syncSession = useAuthSyncSession()
  const hasBootstrappedSession = useRef(false)

  useEffect(() => {
    if (hasBootstrappedSession.current) {
      return
    }

    hasBootstrappedSession.current = true
    void syncSession()
  }, [syncSession])

  return (
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
    </BrowserRouter>
  )
}
