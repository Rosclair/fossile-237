import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './lib/store'
import Layout from './components/Layout'
import Home from './pages/Home'
import { Shop, Product } from './pages/Shop'
import Checkout from './pages/Checkout'
import Admin from './admin/Admin'

const NotFound = () => <div className="mx-auto max-w-xl px-5 py-32 text-center"><div className="font-display text-6xl gold-text">404</div><p className="mt-4 text-muted">Cette page n'existe pas.</p><Link to="/" className="btn-gold mt-8">Retour à l'accueil</Link></div>

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Shop />} />
            <Route path="/promotions" element={<Shop promoOnly />} />
            <Route path="/montre/:slug" element={<Product />} />
            <Route path="/commande" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
)
