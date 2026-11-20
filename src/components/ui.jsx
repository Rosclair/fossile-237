import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { fcfa, effectivePrice, imgUrl, STYLE_LABEL, GENDER_LABEL } from '../lib/format'
import { Bag, Clock } from './Icons'

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    io.observe(el); return () => io.disconnect()
  }, [])
  return <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>
}

export function SectionTitle({ eyebrow, title, sub, center = true, className = '' }) {
  return (
    <Reveal className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      {eyebrow && <div className={`eyebrow mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}><span className="h-px w-8 bg-gold/60" />{eyebrow}<span className="h-px w-8 bg-gold/60" /></div>}
      <h2 className="font-display text-4xl leading-[1.05] text-ivory md:text-6xl">{title}</h2>
      {sub && <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">{sub}</p>}
    </Reveal>
  )
}

export function Countdown({ to, compact = false }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  if (!to) return null
  let d = Math.max(0, new Date(to).getTime() - now)
  const parts = [['j', 86400000], ['h', 3600000], ['min', 60000], ['s', 1000]].map(([l, ms]) => { const v = Math.floor(d / ms); d -= v * ms; return [l, v] })
  if (compact) return <span className="inline-flex items-center gap-1.5 tabular-nums"><Clock className="h-3.5 w-3.5" />{parts.map(([l, v]) => `${String(v).padStart(2, '0')}${l}`).join(' ')}</span>
  return (
    <div className="flex gap-3">
      {parts.map(([l, v]) => (
        <div key={l} className="min-w-[68px] rounded-2xl border border-gold/30 bg-ink/60 px-3 py-3 text-center backdrop-blur">
          <div className="font-display text-4xl tabular-nums gold-text">{String(v).padStart(2, '0')}</div>
          <div className="eyebrow !text-[10px] !tracking-[0.2em] text-muted">{l === 'j' ? 'jours' : l === 'h' ? 'heures' : l === 'min' ? 'min' : 'sec'}</div>
        </div>
      ))}
    </div>
  )
}

export function ProductCard({ p, index = 0 }) {
  const { add, settings } = useStore()
  const price = effectivePrice(p, settings)
  const onPromo = price !== p.price
  return (
    <Reveal delay={(index % 4) * 80} className="group">
      <div className="card-lux relative overflow-hidden rounded-[22px] transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_30px_60px_-30px_rgba(212,175,55,.35)]">
        <Link to={`/montre/${p.slug}`} className="img-zoom sheen relative block aspect-[4/5] overflow-hidden bg-coal">
          <img src={imgUrl(p)} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {onPromo && <span className="rounded-full bg-[#B3261E] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Promo</span>}
            {p.is_new && <span className="gold-bg rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">Nouveau</span>}
            {!p.in_stock && <span className="rounded-full bg-ink/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">Sur commande</span>}
          </div>
        </Link>
        <div className="p-4 md:p-5">
          <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/80">
            <span>{p.brand}</span><span className="text-muted">{STYLE_LABEL[p.style] || p.style}</span>
          </div>
          <Link to={`/montre/${p.slug}`} className="block font-display text-xl leading-tight text-ivory transition group-hover:text-gold-light md:text-[1.4rem]">{p.name}</Link>
          <div className="mt-1 text-xs text-muted">{GENDER_LABEL[p.gender]} · {p.strap}</div>
          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              {onPromo && <div className="text-xs text-muted line-through">{fcfa(p.price)}</div>}
              <div className={`text-lg font-bold tracking-wide ${onPromo ? 'text-[#F08B7E]' : 'text-gold-light'}`}>{fcfa(price)}</div>
            </div>
            <button onClick={() => add(p)} aria-label={`Ajouter ${p.name} au panier`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition hover:scale-105 hover:border-transparent hover:bg-gold hover:text-ink">
              <Bag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export function Toast() {
  const { toast, setCartOpen } = useStore()
  return (
    <div className={`fixed left-1/2 top-24 z-[70] w-[92%] max-w-sm -translate-x-1/2 transition-all duration-500 ${toast ? 'opacity-100 translate-y-0' : 'pointer-events-none -translate-y-4 opacity-0'}`}>
      {toast && (
        <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-coal/95 p-3 shadow-2xl backdrop-blur">
          <img src={toast.img} alt="" className="h-14 w-12 rounded-lg object-cover" />
          <div className="flex-1 text-sm"><div className="text-xs uppercase tracking-widest text-gold">Ajoutée au panier</div><div className="font-display text-lg leading-tight">{toast.name}</div></div>
          <button onClick={() => setCartOpen(true)} className="rounded-full bg-gold px-3 py-2 text-xs font-bold uppercase text-ink">Voir</button>
        </div>
      )}
    </div>
  )
}
