import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { subscribeUnauthorized } from '@/lib/graphql/apollo'
import Router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import { Layout } from './components/Layout'

export default function App() {
  const syncSession = useAuthStore(state => state.syncSession)
  const handleUnauthorized = useAuthStore(state => state.handleUnauthorized)

  useEffect(() => {
    syncSession()
  }, [syncSession])

  useEffect(() => {
    const unsubscribe = subscribeUnauthorized(() => {
      void handleUnauthorized()
    })

    return unsubscribe
  }, [handleUnauthorized])

  return (
    <BrowserRouter>
      <Layout>
        <Router />
      </Layout>
    </BrowserRouter>
  )
}
