import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import { Layout } from './components/Layout'

export default function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Layout>
  )
}
