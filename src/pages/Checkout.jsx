import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { supabase } from '../lib/supabase'
import { fcfa, imgUrl, waLink } from '../lib/format'
import { WhatsApp, Check, Shield, Battery } from '../components/Icons'

const MODES = [
  ['retrait-yaounde', 'Retrait en boutique · Yaoundé (Mfoundi Mall)'],
  ['retrait-douala', 'Retrait en boutique · Douala (Saligny)'],
  ['livraison', 'Livraison à mon adresse'],
]

export default function Checkout() {
  const { lines, total, settings, clear } = useStore()
  const [f, setF] = useState({ name: '', city: 'Yaoundé', mode: 'retrait-yaounde', address: '', note: '' })
  const [done, setDone] = useState(null)
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value })

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/50 text-gold"><Check className="h-9 w-9" /></div>
        <h1 className="mt-6 font-display text-5xl">Merci {done.name.split(' ')[0]} !</h1>
        <p className="mt-4 text-ivory/75">Votre commande <strong className="text-gold-light">{done.ref}</strong> a été préparée dans WhatsApp. Envoyez simplement le message : un conseiller Fossile 237 vous confirme la disponibilité et la livraison.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={done.link} target="_blank" rel="noreferrer" className="btn-wa"><WhatsApp />Rouvrir WhatsApp</a>
          <Link to="/collection" className="btn-ghost">Continuer mes achats</Link>
        </div>
      </div>
    )
  }

  if (!lines.length) {
    return <div className="mx-auto max-w-xl px-5 py-32 text-center"><div className="font-display text-4xl">Votre panier est vide</div><Link to="/collection" className="btn-gold mt-8">Découvrir la collection</Link></div>
  }

  const submit = (e) => {
    e.preventDefault()
    const ref = 'F237-' + Date.now().toString(36).slice(-5).toUpperCase()
    const modeLabel = MODES.find((m) => m[0] === f.mode)[1]
    const items = lines.map((l, i) => `${i + 1}. ${l.product.name} × ${l.qty} — ${fcfa(l.total)}`).join('\n')
    const msg = `Bonjour Fossile 237 👋\nJe souhaite passer la commande suivante :\n\n${items}\n\n💰 *Total : ${fcfa(total)}*\n\n👤 Nom : ${f.name}\n📍 Ville : ${f.city}\n🚚 Mode : ${modeLabel}${f.mode === 'livraison' && f.address ? `\n🏠 Adresse : ${f.address}` : ''}${f.note ? `\n📝 Note : ${f.note}` : ''}\n\n🧾 Réf. commande : ${ref}\nMerci de me confirmer la disponibilité.`
    const link = waLink(settings.whatsapp_number, msg)
    window.open(link, '_blank')
    supabase.from('f237_orders').insert({
      reference: ref, customer_name: f.name, city: f.city, delivery: modeLabel + (f.address ? ` — ${f.address}` : ''), note: f.note,
      items: lines.map((l) => ({ slug: l.slug, name: l.product.name, qty: l.qty, unit: l.unit, total: l.total })), total,
    }).then(() => {})
    setDone({ ref, link, name: f.name })
    clear()
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
      <div className="eyebrow mb-3">Dernière étape</div>
      <h1 className="font-display text-5xl md:text-6xl">Finaliser sur WhatsApp</h1>
      <p className="mt-3 max-w-2xl text-muted">Pas de compte, pas de paiement en ligne. Renseignez ces informations : votre commande s'ouvrira pré-remplie dans WhatsApp, prête à être envoyée à notre équipe.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="card-lux space-y-5 rounded-[26px] p-6 md:p-8">
          <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale">Nom complet *</span><input required value={f.name} onChange={up('name')} className="input-lux" placeholder="Ex : Paul Mbarga" /></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale">Ville *</span>
            <select value={f.city} onChange={up('city')} className="input-lux"><option>Yaoundé</option><option>Douala</option><option>Autre ville du Cameroun</option></select>
          </label>
          <div><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale">Mode de réception *</span>
            <div className="space-y-2">{MODES.map(([v, l]) => (
              <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${f.mode === v ? 'border-gold bg-gold/[.06]' : 'border-line hover:border-gold/40'}`}>
                <input type="radio" name="mode" value={v} checked={f.mode === v} onChange={up('mode')} className="accent-[#D4AF37]" />{l}
              </label>
            ))}</div>
          </div>
          {f.mode === 'livraison' && <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale">Quartier / adresse *</span><input required value={f.address} onChange={up('address')} className="input-lux" placeholder="Ex : Bastos, près de l'ambassade…" /></label>}
          <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold-pale">Message (facultatif)</span><textarea value={f.note} onChange={up('note')} rows={3} className="input-lux" placeholder="Emballage cadeau, gravure, horaire de livraison…" /></label>
          <button className="btn-wa w-full !py-4 !text-base"><WhatsApp className="h-6 w-6" />Envoyer ma commande sur WhatsApp</button>
          <p className="text-center text-xs text-muted">Paiement à la livraison ou en boutique, après confirmation.</p>
        </form>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card-lux rounded-[26px] p-6">
            <div className="font-display text-2xl">Récapitulatif</div>
            <div className="mt-4 divide-y divide-line">
              {lines.map((l) => (
                <div key={l.slug} className="flex items-center gap-4 py-3">
                  <img src={imgUrl(l.product)} alt="" className="h-16 w-14 rounded-lg object-cover" />
                  <div className="flex-1"><div className="font-display text-lg leading-tight">{l.product.name}</div><div className="text-xs text-muted">Qté {l.qty} · {fcfa(l.unit)}</div></div>
                  <div className="text-sm font-semibold text-gold-light">{fcfa(l.total)}</div>
                </div>
              ))}
            </div>
            <div className="divider-gold my-4" />
            <div className="flex items-baseline justify-between"><span className="font-display text-2xl">Total</span><span className="text-2xl font-bold gold-text">{fcfa(total)}</span></div>
            <div className="mt-5 space-y-2 text-sm text-ivory/75">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-gold" />Garantie 2 ans incluse</div>
              <div className="flex items-center gap-2"><Battery className="h-4 w-4 text-gold" />Piles offertes pendant 10 ans</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
