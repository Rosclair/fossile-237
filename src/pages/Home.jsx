import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { fcfa, effectivePrice, imgUrl, STORES, waLink } from '../lib/format'
import { Reveal, SectionTitle, ProductCard, Countdown } from '../components/ui'
import { Arrow, Battery, Shield, Strap, WhatsApp, Pin, Phone, Gift, Plane, Check, Bag, Truck } from '../components/Icons'

function RingText() {
  const t = 'FIÈREMENT AUTHENTIQUE ✦ MONTRES D’ORIGINE ✦ USA · CANADA ✦ '
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-spin-slow">
      <defs><path id="circ" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" /></defs>
      <text fill="#D4AF37" fontSize="13" letterSpacing="5.2" fontFamily="Cinzel" opacity=".85"><textPath href="#circ">{t + t}</textPath></text>
    </svg>
  )
}

function Hero() {
  const { products, add, settings } = useStore()
  const star = products.find((p) => p.slug === 'neutra-bicolore-nacre') || products[0]
  return (
    <section className="grain relative -mt-[76px] overflow-hidden pt-[76px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,.20),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(156,116,25,.15),transparent_50%)]" />
      <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(rgba(212,175,55,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,.6)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-36px)] max-w-7xl items-center gap-10 px-5 pb-16 pt-6 lg:pt-10 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <div className="animate-fadeUp">
          <div className="eyebrow mb-6 flex items-center gap-3"><span className="h-px w-10 bg-gold" />Yaoundé · Douala · Depuis l'Amérique du Nord</div>
          <h1 className="font-display text-[3.2rem] font-medium leading-[0.95] sm:text-7xl lg:text-[5.6rem]">
            Le temps,<br /><span className="italic gold-text">en version</span><br />originale.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory/75">
            Fossil, Michael Kors, Emporio Armani… Des montres <strong className="font-semibold text-gold-pale">100 % d'origine USA–Canada</strong>, garanties 2 ans, avec les piles offertes pendant 10 ans.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/collection" className="btn-gold">Découvrir la collection <Arrow className="h-4 w-4" /></Link>
            <a href={waLink(settings.whatsapp_number, "Bonjour Fossile 237 👋 J'aimerais être conseillé(e) pour choisir une montre.")} target="_blank" rel="noreferrer" className="btn-ghost"><WhatsApp className="h-5 w-5 text-[#25D366]" />Être conseillé</a>
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-8">
            {[['2 ans', 'de garantie'], ['10 ans', 'de piles offertes'], ['2', 'boutiques physiques']].map(([a, b]) => (
              <div key={b}><div className="font-display text-3xl gold-text md:text-4xl">{a}</div><div className="mt-1 text-xs uppercase tracking-[0.15em] text-muted">{b}</div></div>
            ))}
          </div>
        </div>
        <div className="relative order-first mx-auto w-full max-w-[330px] animate-fadeUp [animation-delay:.2s] sm:max-w-[420px] lg:order-none lg:max-w-[520px] mb-8 lg:mb-0">
          <div className="relative aspect-square">
            <RingText />
            <div className="absolute inset-[9%] rounded-full border border-gold/25" />
            <div className="absolute inset-[13%] overflow-hidden rounded-full border border-gold/50 shadow-[0_0_120px_-20px_rgba(212,175,55,.55)]">
              <img src="/brand/hero-watch.webp" alt="Montre Fossil Neutra bicolore nacre" className="h-full w-full scale-110 object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.18),transparent_45%)]" />
            </div>
          </div>
          {star && (
            <div className="animate-float absolute -bottom-10 inset-x-0 mx-auto flex w-fit items-center sm:-bottom-2 sm:inset-x-auto sm:-left-6 sm:mx-0 gap-3 rounded-2xl border border-gold/40 bg-coal/90 p-3 pr-4 shadow-2xl backdrop-blur-xl sm:-left-6">
              <img src={imgUrl(star)} alt="" className="h-16 w-14 rounded-xl object-cover" />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold">Coup de cœur</div>
                <div className="font-display text-lg leading-tight">{star.name}</div>
                <div className="text-sm font-bold text-gold-light">{fcfa(effectivePrice(star, settings))}</div>
              </div>
              <button onClick={() => add(star)} className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-gold text-ink" aria-label="Ajouter"><Bag className="h-4 w-4" /></button>
            </div>
          )}
          <div className="absolute -right-2 top-6 hidden rounded-2xl sm:block border border-gold/30 bg-coal/85 px-4 py-3 text-center backdrop-blur-xl sm:right-0">
            <Shield className="mx-auto h-6 w-6 text-gold" />
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em]">Authentique</div>
            <div className="text-[10px] text-muted">certifiée d'origine</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Brands() {
  const b = ['FOSSIL', 'MICHAEL KORS', 'EMPORIO ARMANI', 'DIESEL', 'FOSSIL SMARTWATCH']
  return (
    <div className="border-y border-line bg-coal/70 py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-16">
          {[...b, ...b, ...b, ...b].map((x, i) => <span key={i} className="flex items-center gap-16 font-caps text-xl tracking-[0.3em] text-ivory/40">{x}<span className="text-gold/60">✦</span></span>)}
        </div>
      </div>
    </div>
  )
}

function Universes() {
  const items = [
    { to: '/collection?genre=homme', t: 'Pour lui', s: 'Chronographes & automatiques', img: '/products/grant-automatique-bleu-roi.webp' },
    { to: '/collection?genre=femme', t: 'Pour elle', s: 'Nacre, cristaux & élégance', img: '/products/raquel-cadran-rose.webp' },
    { to: '/collection?style=coffret', t: 'Lui & Elle', s: 'Coffrets & idées cadeaux', img: '/products/coffret-duo-emeraude.webp' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionTitle eyebrow="Nos univers" title={<>Trouvez la pièce <em className="gold-text">qui vous ressemble</em></>} />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {items.map((i, k) => (
          <Reveal key={i.t} delay={k * 120}>
            <Link to={i.to} className="img-zoom sheen group relative block aspect-[3/4] overflow-hidden rounded-[26px] border border-line">
              <img src={i.img} alt={i.t} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <div className="eyebrow mb-2">{i.s}</div>
                <div className="flex items-end justify-between">
                  <div className="font-display text-5xl">{i.t}</div>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold transition group-hover:bg-gold group-hover:text-ink"><Arrow className="h-5 w-5" /></span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function PromoSection() {
  const { products, settings } = useStore()
  const promo = products.filter((p) => p.promo_price)
  if (!settings.promo_active || promo.length === 0) return null
  return (
    <section className="relative overflow-hidden border-y border-[#5E1712] bg-gradient-to-br from-[#1C0A08] via-ink to-[#1C0A08] py-24">
      <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#8E2219]/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <span className="mb-4 inline-block rounded-full bg-[#B3261E] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">{settings.promo_badge}</span>
            <h2 className="font-display text-5xl leading-none md:text-6xl">{settings.promo_title}</h2>
            <p className="mt-4 max-w-xl text-ivory/70">{settings.promo_subtitle}</p>
          </Reveal>
          {settings.promo_ends_at && <Reveal delay={150}><div className="eyebrow mb-3">Se termine dans</div><Countdown to={settings.promo_ends_at} /></Reveal>}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{promo.slice(0, 8).map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}</div>
        {promo.length > 8 && <div className="mt-10 text-center"><Link to="/promotions" className="btn-ghost">Toutes les offres</Link></div>}
      </div>
    </section>
  )
}

function Signature() {
  const { products, add, settings } = useStore()
  const autos = products.filter((p) => p.style === 'automatique').slice(0, 6)
  if (!autos.length) return null
  const [main, ...rest] = autos
  return (
    <section className="relative overflow-hidden bg-coal py-24">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(212,175,55,.22),transparent_65%)]" />
            <Link to={`/montre/${main.slug}`} className="img-zoom sheen relative block aspect-[4/5] overflow-hidden rounded-[32px] border border-gold/30">
              <img src={imgUrl(main)} alt={main.name} className="h-full w-full object-cover" />
            </Link>
          </Reveal>
          <div>
            <SectionTitle center={false} eyebrow="Les pièces signature" title={<>Le cœur <em className="gold-text">mécanique</em>,<br />à découvert.</>}
              sub="Nos montres automatiques se remontent au rythme de votre poignet. Pas de pile, juste un mouvement ciselé visible à travers le cadran squelette. Des pièces qui se regardent autant qu'elles se portent." />
            <Reveal delay={120} className="mt-8 rounded-3xl border border-line bg-ink/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="eyebrow mb-1">{main.brand} · Automatique</div>
                  <div className="font-display text-3xl">{main.name}</div>
                  <p className="mt-2 text-sm text-muted">{main.description}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="text-2xl font-bold text-gold-light">{fcfa(effectivePrice(main, settings))}</div>
                <button onClick={() => add(main)} className="btn-gold !py-3"><Bag className="h-4 w-4" />Ajouter au panier</button>
              </div>
            </Reveal>
            <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2">
              {rest.map((p) => (
                <Link key={p.slug} to={`/montre/${p.slug}`} className="group w-28 shrink-0">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-line transition group-hover:border-gold"><img src={imgUrl(p)} alt={p.name} className="h-full w-full object-cover" loading="lazy" /></div>
                  <div className="mt-2 text-xs font-semibold text-gold-light">{fcfa(effectivePrice(p, settings))}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { products } = useStore()
  const list = [...products].sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order).slice(0, 8)
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionTitle center={false} eyebrow="La sélection du moment" title={<>Nos pièces <em className="gold-text">les plus demandées</em></>} />
        <Reveal><Link to="/collection" className="btn-ghost">Voir les {products.length} montres <Arrow className="h-4 w-4" /></Link></Reveal>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {list.map((p, i) => <ProductCard key={p.slug} p={p} index={i} />)}
      </div>
    </section>
  )
}

function Guarantees() {
  const g = [
    { n: '01', i: Battery, t: 'Piles remplacées gratuitement', d: "Pendant 10 ans. Passez en boutique, on s'occupe du reste, sans frais." },
    { n: '02', i: Shield, t: 'Garantie 2 ans sur le mécanisme', d: '2 ans pour les montres à quartz et 1 an pour les montres intelligentes.' },
    { n: '03', i: Strap, t: 'Bracelets cuir à -50 %', d: 'Une garantie spéciale : votre bracelet cuir remplacé à moitié prix.' },
  ]
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,.10),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionTitle eyebrow="Nos garanties" title={<>Acheter une montre,<br /><em className="gold-text">c'est un engagement.</em> Le nôtre aussi.</>} sub="Chez Fossile 237, la relation ne s'arrête pas à l'achat. Vous repartez avec une pièce authentique et un service après-vente réel, dans nos boutiques." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {g.map((x, k) => (
            <Reveal key={x.n} delay={k * 120}>
              <div className="card-lux group relative h-full overflow-hidden rounded-[26px] p-8 transition hover:border-gold/50">
                <div className="absolute -right-4 -top-6 font-display text-[9rem] leading-none text-gold/[.07] transition group-hover:text-gold/[.12]">{x.n}</div>
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold"><x.i className="h-7 w-7" /></div>
                <div className="mt-6 font-display text-3xl leading-tight">{x.t}</div>
                <p className="mt-3 text-muted">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Authenticity() {
  const steps = [
    { i: Plane, t: 'Sélectionnées en Amérique du Nord', d: 'Nos montres sont achetées en boutique aux USA et au Canada, dans leur coffret d’origine.' },
    { i: Check, t: 'Contrôlées une à une', d: 'Étiquettes, coffret, mécanisme : chaque pièce est vérifiée avant de rejoindre nos vitrines.' },
    { i: Truck, t: 'Disponibles au Cameroun', d: 'Retrait en boutique à Yaoundé ou Douala, ou livraison après confirmation sur WhatsApp.' },
  ]
  return (
    <section className="bg-coal py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle center={false} eyebrow="Fièrement authentique" title={<>Pas de copie.<br /><em className="gold-text">Jamais.</em></>} sub="Une vraie montre se reconnaît au poids, à la finition, au coffret… et à la confiance de celui qui la porte. C'est notre seule promesse, depuis le premier jour." />
          <div className="mt-10 space-y-6">
            {steps.map((s, k) => (
              <Reveal key={s.t} delay={k * 100} className="flex gap-5">
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold"><s.i className="h-5 w-5" /></div>
                  {k < steps.length - 1 && <div className="absolute left-1/2 top-12 h-10 w-px -translate-x-1/2 bg-gold/30" />}
                </div>
                <div><div className="font-display text-2xl">{s.t}</div><p className="mt-1 text-sm text-muted">{s.d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img src="/products/grant-chrono-noir-cognac.webp" alt="" className="mt-10 aspect-[4/5] w-full rounded-3xl border border-line object-cover" loading="lazy" />
            <img src="/products/jacqueline-nacre-blanc.webp" alt="" className="aspect-[4/5] w-full rounded-3xl border border-line object-cover" loading="lazy" />
          </div>
          <div className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/50 bg-ink/90 p-3 shadow-[0_0_60px_rgba(212,175,55,.35)] backdrop-blur">
            <img src="/brand/logo.png" alt="Fossile 237" className="w-full" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function HowToOrder() {
  const s = [
    { n: '1', t: 'Choisissez', d: 'Parcourez la collection et ajoutez vos montres au panier.' },
    { n: '2', t: 'Envoyez sur WhatsApp', d: 'Votre commande arrive pré-remplie chez un conseiller Fossile 237.' },
    { n: '3', t: 'Recevez', d: 'Retrait en boutique ou livraison, paiement à la réception.' },
  ]
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionTitle eyebrow="Commander en 1 minute" title={<>Simple, rapide, <em className="gold-text">sans paiement en ligne</em></>} />
      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 md:block" />
        {s.map((x, k) => (
          <Reveal key={x.n} delay={k * 120} className="relative text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/50 bg-ink font-display text-4xl gold-text">{x.n}</div>
            <div className="mt-5 font-display text-3xl">{x.t}</div>
            <p className="mx-auto mt-2 max-w-xs text-muted">{x.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function GiftBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[34px] border border-gold/30">
          <img src="/brand/poster.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_40%] opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
          <div className="relative max-w-xl p-10 md:p-16">
            <Gift className="h-10 w-10 text-gold" />
            <h3 className="mt-5 font-display text-4xl leading-tight md:text-6xl">Un cadeau de qualité, <em className="gold-text">c'est une attention qui marque le temps.</em></h3>
            <p className="mt-5 text-ivory/75">Anniversaire, mariage, fête des pères ou Saint-Valentin : chaque montre est livrée dans son coffret d'origine, prête à offrir.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/collection?style=coffret" className="btn-gold">Idées cadeaux</Link>
              <Link to="/collection?genre=femme" className="btn-ghost">Pour elle</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Stores() {
  return (
    <section id="boutiques" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 lg:px-8">
      <SectionTitle eyebrow="Nos boutiques" title={<>Venez les <em className="gold-text">essayer au poignet</em></>} sub="Ouvertes tous les jours. Nos conseillers vous accueillent à Yaoundé et à Douala." />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {STORES.map((s, k) => (
          <Reveal key={s.city} delay={k * 120}>
            <div className="card-lux relative overflow-hidden rounded-[28px] p-8 md:p-10">
              <div className="absolute -right-10 -top-10 font-caps text-[7rem] font-bold leading-none text-gold/[.05]">{s.city.toUpperCase()}</div>
              <div className="eyebrow">{s.city}</div>
              <div className="mt-3 font-display text-4xl">{s.name}</div>
              <div className="mt-4 flex gap-3 text-ivory/80"><Pin className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span>{s.detail}<br /><span className="text-sm text-muted">{s.hint}</span></span></div>
              <div className="mt-3 flex gap-3 text-ivory/80"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" /><span>{s.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="mr-4 hover:text-gold">{p}</a>)}</span></div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={s.maps} target="_blank" rel="noreferrer" className="btn-gold !py-3">Itinéraire</a>
                <a href={`tel:${s.phones[0].replace(/\s/g, '')}`} className="btn-ghost !py-3">Appeler</a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <PromoSection />
      <Universes />
      <Signature />
      <Featured />
      <Guarantees />
      <Authenticity />
      <HowToOrder />
      <GiftBanner />
      <Stores />
    </>
  )
}
