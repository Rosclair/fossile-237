import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { fcfa, imgUrl, STORES, waLink } from '../lib/format'
import { Bag, Menu, Close, Plus, Minus, Trash, WhatsApp, Facebook, Instagram, Pin, Phone, Arrow } from './Icons'
import { Countdown, Toast } from './ui'

const NAV = [
  { to: '/collection?genre=homme', label: 'Pour lui' },
  { to: '/collection?genre=femme', label: 'Pour elle' },
  { to: '/collection?style=automatique', label: 'Automatiques' },
  { to: '/collection?style=coffret', label: 'Coffrets' },
  { to: '/collection', label: 'Toute la collection' },
]

function AnnouncementBar() {
  const { settings } = useStore()
  if (settings.promo_active) {
    return (
      <Link to="/promotions" className="block bg-gradient-to-r from-[#5E1712] via-[#8E2219] to-[#5E1712] py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
        <span className="mr-2 rounded-full bg-white/15 px-2 py-0.5">{settings.promo_badge}</span>
        {settings.promo_title}
        {settings.promo_ends_at && <span className="ml-3 hidden text-white/80 sm:inline"><Countdown to={settings.promo_ends_at} compact /></span>}
        <span className="ml-2 underline underline-offset-4">Voir les offres</span>
      </Link>
    )
  }
  const text = settings.announcement
  return (
    <div className="overflow-hidden border-b border-line bg-coal py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-gold-pale/90">
      <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
        {[...Array(6)].map((_, i) => <span key={i} className="flex items-center gap-16">{text}<span className="text-gold">✦</span></span>)}
      </div>
    </div>
  )
}

function Header() {
  const { count, setCartOpen } = useStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc])
  useEffect(() => { const f = () => setScrolled(window.scrollY > 30); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f) }, [])
  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'border-b border-line bg-ink/85 backdrop-blur-xl' : 'bg-gradient-to-b from-ink to-ink/0'}`}>
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <button className="text-ivory lg:hidden" onClick={() => setOpen(true)} aria-label="Menu"><Menu className="h-6 w-6" /></button>
        <Link to="/" className="flex items-center gap-3">
          <img src="/brand/logo-sm.png" alt="Fossile 237" className="h-11 w-auto md:h-12" />
          <div className="hidden leading-none sm:block">
            <div className="font-caps text-lg font-bold tracking-[0.18em] gold-text">FOSSILE 237</div>
            <div className="mt-1 font-display text-[13px] italic text-muted">Montres et accessoires d'origine</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.label} to={n.to} className="relative text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory/80 transition hover:text-gold-light after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all hover:after:w-full">{n.label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#boutiques" onClick={(e) => { if (loc.pathname !== '/') { e.preventDefault(); window.location.href = '/#boutiques' } }} className="hidden text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory/80 hover:text-gold-light xl:block mr-3">Nos boutiques</a>
          <button onClick={() => setCartOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/30 text-gold transition hover:border-gold hover:bg-gold/10" aria-label="Panier">
            <Bag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">{count}</span>}
          </button>
        </div>
      </div>
      <div className={`fixed inset-0 z-[60] transition ${open ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-[84%] max-w-sm border-r border-line bg-coal p-6 transition-transform duration-500 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-10 flex items-center justify-between">
            <img src="/brand/logo-sm.png" alt="" className="h-12" />
            <button onClick={() => setOpen(false)} aria-label="Fermer"><Close className="h-6 w-6" /></button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV.map((n) => <Link key={n.label} to={n.to} className="flex items-center justify-between border-b border-line py-4 font-display text-2xl">{n.label}<Arrow className="h-4 w-4 text-gold" /></Link>)}
            <a href="/#boutiques" className="flex items-center justify-between border-b border-line py-4 font-display text-2xl">Nos boutiques<Arrow className="h-4 w-4 text-gold" /></a>
          </div>
          <div className="mt-10 text-sm text-muted">Yaoundé · Mfoundi Mall<br />Douala · Centre Commercial Saligny</div>
        </aside>
      </div>
    </header>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, total, setQty, count } = useStore()
  return (
    <div className={`fixed inset-0 z-[80] ${cartOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${cartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setCartOpen(false)} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-coal transition-transform duration-500 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div><div className="eyebrow">Votre sélection</div><div className="font-display text-3xl">Panier <span className="text-muted">({count})</span></div></div>
          <button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:border-gold" aria-label="Fermer"><Close /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 grid h-20 w-20 place-items-center rounded-full border border-gold/30 text-gold"><Bag className="h-8 w-8" /></div>
              <div className="font-display text-2xl">Votre panier est vide</div>
              <p className="mt-2 max-w-xs text-sm text-muted">Découvrez nos pièces d'origine et ajoutez celle qui vous ressemble.</p>
              <Link to="/collection" onClick={() => setCartOpen(false)} className="btn-gold mt-6">Explorer la collection</Link>
            </div>
          ) : lines.map((l) => (
            <div key={l.slug} className="flex gap-4 border-b border-line py-4">
              <img src={imgUrl(l.product)} alt="" className="h-24 w-20 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="font-display text-lg leading-tight">{l.product.name}</div>
                <div className="text-sm font-semibold text-gold-light">{fcfa(l.unit)}</div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Moins"><Minus className="h-4 w-4" /></button>
                    <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                    <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Plus"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button onClick={() => setQty(l.slug, 0)} className="text-muted hover:text-[#F08B7E]" aria-label="Retirer"><Trash className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-line bg-ink/60 px-6 py-5">
            <div className="mb-1 flex justify-between text-sm text-muted"><span>Sous-total</span><span>{fcfa(total)}</span></div>
            <div className="mb-4 flex items-baseline justify-between"><span className="font-display text-2xl">Total</span><span className="text-2xl font-bold text-gold-light">{fcfa(total)}</span></div>
            <Link to="/commande" onClick={() => setCartOpen(false)} className="btn-wa w-full"><WhatsApp className="h-5 w-5" />Commander sur WhatsApp</Link>
            <p className="mt-3 text-center text-xs text-muted">Aucun paiement en ligne · Confirmation et livraison avec un conseiller</p>
          </div>
        )}
      </aside>
    </div>
  )
}

function Footer() {
  const { settings } = useStore()
  return (
    <footer className="relative mt-10 border-t border-line bg-coal">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <img src="/brand/logo.png" alt="Fossile 237" className="h-28 w-auto" />
          <p className="mt-5 font-display text-xl italic text-gold-pale">Fièrement authentique.</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">Montres et accessoires d'origine USA–Canada, sélectionnés pour le Cameroun.</p>
        </div>
        {STORES.map((s) => (
          <div key={s.city}>
            <div className="eyebrow mb-4">{s.city}</div>
            <div className="font-display text-2xl">{s.name}</div>
            <p className="mt-2 text-sm text-muted">{s.detail}<br />{s.hint}</p>
            <div className="mt-3 space-y-1 text-sm">{s.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block text-ivory/80 hover:text-gold">{p}</a>)}</div>
          </div>
        ))}
        <div>
          <div className="eyebrow mb-4">Restons connectés</div>
          <a href={waLink(settings.whatsapp_number, 'Bonjour Fossile 237 👋')} target="_blank" rel="noreferrer" className="btn-wa !px-5 !py-3 !text-xs"><WhatsApp />Écrire sur WhatsApp</a>
          <div className="mt-5 flex gap-3">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold hover:border-gold" aria-label="Facebook"><Facebook /></a>
            <a href="https://www.instagram.com/fossil_237" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-line text-gold hover:border-gold" aria-label="Instagram"><Instagram /></a>
          </div>
          <p className="mt-5 text-xs text-muted">Facebook : Fossile 237 · Fossile C 237 · Idées Cadeaux 237<br />Instagram : @fossil_237</p>
        </div>
      </div>
      <div className="divider-gold" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted md:flex-row lg:px-8">
        <span>© {new Date().getFullYear()} Fossile 237 · Tous droits réservés</span>
        <span>Les marques citées appartiennent à leurs propriétaires respectifs.</span>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  const { settings } = useStore()
  return (
    <a href={waLink(settings.whatsapp_number, "Bonjour Fossile 237 👋 J'aimerais un conseil pour choisir une montre.")} target="_blank" rel="noreferrer"
      className="pulse-wa fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1FAF5A] text-white shadow-2xl transition hover:scale-105" aria-label="WhatsApp">
      <WhatsApp className="h-7 w-7" />
    </a>
  )
}

function ScrollTop() {
  const { pathname, search, hash } = useLocation()
  useEffect(() => {
    if (hash) { setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 300); return }
    window.scrollTo(0, 0)
  }, [pathname, search, hash])
  return null
}

export default function Layout() {
  return (
    <>
      <ScrollTop />
      <AnnouncementBar />
      <Header />
      <main><Outlet /></main>
      <Footer />
      <CartDrawer />
      <Toast />
      <WhatsAppFab />
    </>
  )
}
