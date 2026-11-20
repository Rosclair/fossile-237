import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { fcfa, effectivePrice, imgUrl, STYLE_LABEL, GENDER_LABEL, waLink } from '../lib/format'
import { ProductCard, Reveal, Countdown } from '../components/ui'
import { Bag, Battery, Shield, Strap, WhatsApp, Search, Arrow, Check } from '../components/Icons'

const GENRES = [['', 'Tous'], ['homme', 'Pour lui'], ['femme', 'Pour elle'], ['mixte', 'Lui & Elle']]
const STYLES = [['', 'Tous les styles'], ['chronographe', 'Chronographes'], ['automatique', 'Automatiques'], ['classique', 'Classiques'], ['coffret', 'Coffrets']]

export function Shop({ promoOnly = false }) {
  const { products, settings } = useStore()
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('pop')
  const genre = sp.get('genre') || ''
  const style = sp.get('style') || ''
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }

  const list = useMemo(() => {
    let l = products.filter((p) => (!promoOnly || p.promo_price) && (!genre || p.gender === genre || (genre !== 'mixte' && p.gender === 'mixte')) && (!style || p.style === style))
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter((p) => `${p.name} ${p.color} ${p.strap} ${p.brand}`.toLowerCase().includes(s)) }
    const pr = (p) => effectivePrice(p, settings)
    if (sort === 'asc') l = [...l].sort((a, b) => pr(a) - pr(b))
    if (sort === 'desc') l = [...l].sort((a, b) => pr(b) - pr(a))
    if (sort === 'new') l = [...l].sort((a, b) => Number(b.is_new) - Number(a.is_new))
    return l
  }, [products, genre, style, q, sort, settings, promoOnly])

  const title = promoOnly ? settings.promo_title || 'Promotions' : genre ? GENRES.find((g) => g[0] === genre)?.[1] : style ? STYLES.find((s) => s[0] === style)?.[1] : 'La collection'

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(212,175,55,.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 lg:px-8">
          <div className="eyebrow mb-3">{promoOnly ? 'Offres limitées' : 'Montres d’origine USA–Canada'}</div>
          <h1 className="font-display text-5xl md:text-7xl">{title}</h1>
          <p className="mt-3 text-muted">{list.length} pièce{list.length > 1 ? 's' : ''} · garanties 2 ans · piles offertes 10 ans</p>
          {promoOnly && settings.promo_ends_at && <div className="mt-6"><Countdown to={settings.promo_ends_at} /></div>}
        </div>
      </section>
      <div className="sticky top-[76px] z-30 border-b border-line bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {GENRES.map(([v, l]) => <button key={l} onClick={() => set('genre', v)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${genre === v ? 'bg-gold text-ink' : 'border border-line text-ivory/80 hover:border-gold/60'}`}>{l}</button>)}
            <span className="mx-1 w-px shrink-0 bg-line" />
            {STYLES.slice(1).map(([v, l]) => <button key={l} onClick={() => set('style', style === v ? '' : v)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${style === v ? 'bg-gold-pale text-ink' : 'border border-line text-ivory/80 hover:border-gold/60'}`}>{l}</button>)}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-60"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (bleu, cuir…)" className="input-lux !rounded-full !py-2.5 pl-10" /></div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-lux !w-auto !rounded-full !py-2.5">
              <option value="pop">Populaires</option><option value="new">Nouveautés</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {list.length ? (
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{list.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}</div>
        ) : (
          <div className="py-24 text-center"><div className="font-display text-3xl">Aucune montre ne correspond</div><button onClick={() => { setSp({}); setQ('') }} className="btn-ghost mt-6">Réinitialiser les filtres</button></div>
        )}
      </section>
    </div>
  )
}

export function Product() {
  const { slug } = useParams()
  const { products, settings, add, setCartOpen } = useStore()
  const nav = useNavigate()
  const p = products.find((x) => x.slug === slug)
  const [img, setImg] = useState(0)
  if (!p) return <div className="mx-auto max-w-xl px-5 py-32 text-center"><div className="font-display text-4xl">Montre introuvable</div><Link to="/collection" className="btn-gold mt-8">Retour à la collection</Link></div>
  const price = effectivePrice(p, settings)
  const onPromo = price !== p.price
  const imgs = p.image_urls?.length ? p.image_urls : [imgUrl(p)]
  const similar = products.filter((x) => x.slug !== p.slug && (x.style === p.style || x.gender === p.gender)).slice(0, 4)
  const msg = `Bonjour Fossile 237 👋\nJe suis intéressé(e) par cette montre :\n\n⌚ ${p.name}\n💰 ${fcfa(price)}\n🔗 ${window.location.origin}/montre/${p.slug}\n\nEst-elle disponible ?`
  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 pt-6 text-xs uppercase tracking-[0.16em] text-muted lg:px-8">
        <Link to="/" className="hover:text-gold">Accueil</Link> / <Link to="/collection" className="hover:text-gold">Collection</Link> / <span className="text-ivory/80">{p.name}</span>
      </div>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-10 lg:grid-cols-2 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[30px] border border-gold/25 bg-coal">
            <img src={imgs[img]} alt={p.name} className="aspect-[4/5] w-full object-cover animate-fadeUp" key={img} />
            {onPromo && <span className="absolute left-5 top-5 rounded-full bg-[#B3261E] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">{settings.promo_badge || 'Promo'}</span>}
          </div>
          {imgs.length > 1 && <div className="mt-4 flex gap-3">{imgs.map((u, i) => <button key={u} onClick={() => setImg(i)} className={`h-24 w-20 overflow-hidden rounded-xl border ${i === img ? 'border-gold' : 'border-line opacity-60'}`}><img src={u} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </div>
        <div className="animate-fadeUp">
          <div className="eyebrow">{p.brand} · {STYLE_LABEL[p.style]} · {GENDER_LABEL[p.gender]}</div>
          <h1 className="mt-3 font-display text-5xl leading-[1.02] md:text-6xl">{p.name}</h1>
          <div className="mt-6 flex items-end gap-4">
            <div className={`text-4xl font-bold ${onPromo ? 'text-[#F08B7E]' : 'gold-text'}`}>{fcfa(price)}</div>
            {onPromo && <div className="pb-1 text-lg text-muted line-through">{fcfa(p.price)}</div>}
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">{p.in_stock ? <><span className="h-2 w-2 rounded-full bg-[#1FAF5A]" /><span className="text-ivory/80">Disponible en boutique</span></> : <><span className="h-2 w-2 rounded-full bg-gold" /><span className="text-ivory/80">Sur commande</span></>}</div>
          <p className="mt-7 text-lg leading-relaxed text-ivory/75">{p.description}</p>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {[['Marque', p.brand], ['Mouvement', p.movement], ['Bracelet', p.strap], ['Coloris', p.color], ...(p.case_size ? [['Boîtier', p.case_size]] : []), ['Origine', 'USA – Canada']].map(([k, v]) => v && (
              <div key={k} className="bg-coal p-4"><div className="text-[10px] uppercase tracking-[0.2em] text-muted">{k}</div><div className="mt-1 font-semibold">{v}</div></div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => { add(p); setCartOpen(true) }} className="btn-gold flex-1"><Bag className="h-5 w-5" />Ajouter au panier</button>
            <a href={waLink(settings.whatsapp_number, msg)} target="_blank" rel="noreferrer" className="btn-wa flex-1"><WhatsApp />Commander directement</a>
          </div>
          <div className="mt-8 space-y-3 rounded-2xl border border-gold/20 bg-gold/[.04] p-5">
            {[[Battery, 'Piles remplacées gratuitement pendant 10 ans'], [Shield, 'Garantie 2 ans sur le mécanisme (quartz)'], [Strap, 'Remplacement du bracelet cuir à -50 %'], [Check, 'Livrée dans son coffret d’origine']].map(([I, t]) => (
              <div key={t} className="flex items-center gap-3 text-sm"><I className="h-5 w-5 text-gold" />{t}</div>
            ))}
          </div>
        </div>
      </section>
      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="mb-8 flex items-end justify-between"><h2 className="font-display text-4xl">Vous aimerez aussi</h2><Link to="/collection" className="text-sm uppercase tracking-[0.16em] text-gold hover:underline">Tout voir</Link></div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{similar.map((x, i) => <ProductCard key={x.slug} p={x} index={i} />)}</div>
        </section>
      )}
    </div>
  )
}
