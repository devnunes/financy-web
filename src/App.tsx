import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { Layout } from './components/Layout'

export default function App() {
  const syncSession = useAuthStore(state => state.syncSession)

  useEffect(() => {
    syncSession()
  }, [syncSession])

  return (
    <Layout>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Layout>
  )
}
