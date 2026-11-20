import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from './supabase'
import fallback from '../data/fallback.json'

const DEFAULT_SETTINGS = {
  whatsapp_number: '237654708627', promo_active: false, promo_title: '', promo_subtitle: '', promo_badge: '', promo_ends_at: null,
  announcement: "Montres 100 % d'origine USA–Canada · Garantie 2 ans · Piles offertes pendant 10 ans",
}
const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(fallback)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('f237-cart') || '[]') } catch { return [] } })
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const reload = useCallback(async () => {
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from('f237_products').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('f237_settings').select('*').eq('id', 1).maybeSingle(),
    ])
    if (p && p.length) setProducts(p)
    if (s) setSettings({ ...DEFAULT_SETTINGS, ...s })
    setLoading(false)
  }, [])
  useEffect(() => { reload().catch(() => setLoading(false)) }, [reload])
  useEffect(() => { try { localStorage.setItem('f237-cart', JSON.stringify(cart)) } catch {} }, [cart])

  const promoLive = !!settings.promo_active && (!settings.promo_ends_at || new Date(settings.promo_ends_at) > new Date())
  const s2 = useMemo(() => ({ ...settings, promo_active: promoLive }), [settings, promoLive])

  const add = (product, qty = 1) => {
    setCart((c) => {
      const f = c.find((i) => i.slug === product.slug)
      if (f) return c.map((i) => (i.slug === product.slug ? { ...i, qty: i.qty + qty } : i))
      return [...c, { slug: product.slug, qty }]
    })
    setToast({ name: product.name, img: product.image_urls?.[0] })
    setTimeout(() => setToast(null), 2600)
  }
  const setQty = (slug, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.slug !== slug) : c.map((i) => (i.slug === slug ? { ...i, qty } : i))))
  const clear = () => setCart([])

  const lines = useMemo(() => cart.map((i) => {
    const p = products.find((x) => x.slug === i.slug)
    if (!p) return null
    const unit = promoLive && p.promo_price ? p.promo_price : p.price
    return { ...i, product: p, unit, total: unit * i.qty }
  }).filter(Boolean), [cart, products, promoLive])
  const total = lines.reduce((s, l) => s + l.total, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)

  return (
    <Ctx.Provider value={{ products, settings: s2, rawSettings: settings, loading, reload, lines, total, count, add, setQty, clear, cartOpen, setCartOpen, toast }}>
      {children}
    </Ctx.Provider>
  )
}
export const useStore = () => useContext(Ctx)
