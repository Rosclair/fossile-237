import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../lib/store'
import { fcfa, imgUrl, STYLE_LABEL, GENDER_LABEL } from '../lib/format'
import { Plus, Edit, Trash, Eye, Logout, Upload, Close, Check, Search, Spark } from '../components/Icons'

const TABS = [['dash', 'Tableau de bord'], ['products', 'Montres'], ['promo', 'Promotion'], ['orders', 'Commandes'], ['settings', 'Réglages']]
const EMPTY = { name: '', slug: '', brand: 'Fossil', gender: 'homme', style: 'chronographe', movement: 'Quartz', strap: '', case_size: '', color: '', description: '', price: '', promo_price: '', image_urls: [], is_featured: false, is_new: true, in_stock: true, is_active: true, sort_order: 100 }
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const go = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    setBusy(false)
    if (error) return setErr('Identifiants incorrects.')
    onDone()
  }
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,.15),transparent_60%)] px-5">
      <form onSubmit={go} className="card-lux w-full max-w-md rounded-[28px] p-8 text-center">
        <img src="/brand/logo.png" alt="" className="mx-auto h-28" />
        <div className="eyebrow mt-4">Espace administrateur</div>
        <h1 className="mt-2 font-display text-4xl">Connexion</h1>
        <div className="mt-8 space-y-4 text-left">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="input-lux" />
          <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mot de passe" className="input-lux" />
          {err && <div className="text-sm text-[#F08B7E]">{err}</div>}
          <button disabled={busy} className="btn-gold w-full">{busy ? 'Connexion…' : 'Se connecter'}</button>
        </div>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-[0.16em] text-muted hover:text-gold">← Retour au site</Link>
      </form>
    </div>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex items-center gap-3 text-sm">
      <span className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-gold' : 'bg-line'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} /></span>
      {label}
    </button>
  )
}

function Field({ label, children, className = '' }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-pale">{label}</span>{children}</label>
}

function ProductForm({ initial, onClose, onSaved }) {
  const [p, setP] = useState({ ...EMPTY, ...initial, price: initial?.price ?? '', promo_price: initial?.promo_price ?? '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setP({ ...p, [k]: e?.target ? (e.target.type === 'number' ? e.target.value : e.target.value) : e })
  const upload = async (files) => {
    setBusy(true)
    const urls = []
    for (const file of files) {
      const path = `products/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('fossile-237').upload(path, file, { upsert: false, cacheControl: '31536000' })
      if (error) { setErr("Échec de l'envoi de l'image : " + error.message); continue }
      urls.push(supabase.storage.from('fossile-237').getPublicUrl(path).data.publicUrl)
    }
    setP((x) => ({ ...x, image_urls: [...x.image_urls, ...urls] }))
    setBusy(false)
  }
  const save = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    const row = { ...p, slug: p.slug || slugify(p.name), price: parseInt(p.price, 10), promo_price: p.promo_price ? parseInt(p.promo_price, 10) : null, sort_order: parseInt(p.sort_order || 100, 10) }
    delete row.created_at; delete row.updated_at
    const q = initial?.id ? supabase.from('f237_products').update(row).eq('id', initial.id) : supabase.from('f237_products').insert((({ id, ...r }) => r)(row))
    const { error } = await q
    setBusy(false)
    if (error) return setErr(error.message.includes('duplicate') ? 'Ce lien (slug) existe déjà, modifiez le nom.' : error.message)
    onSaved()
  }
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <form onSubmit={save} className="card-lux mx-auto my-6 max-w-3xl rounded-[26px] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div><div className="eyebrow">{initial?.id ? 'Modifier' : 'Nouvelle montre'}</div><div className="font-display text-3xl">{p.name || 'Fiche produit'}</div></div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-line"><Close /></button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom de la montre *" className="md:col-span-2"><input required value={p.name} onChange={set('name')} className="input-lux" placeholder="Ex : Grant Chrono Noir & Cognac" /></Field>
          <Field label="Prix (FCFA) *"><input required type="number" min="0" value={p.price} onChange={set('price')} className="input-lux" placeholder="95000" /></Field>
          <Field label="Prix promo (FCFA)"><input type="number" min="0" value={p.promo_price} onChange={set('promo_price')} className="input-lux" placeholder="Visible si la promotion est active" /></Field>
          <Field label="Marque"><input value={p.brand} onChange={set('brand')} className="input-lux" /></Field>
          <Field label="Pour"><select value={p.gender} onChange={set('gender')} className="input-lux"><option value="homme">Homme</option><option value="femme">Femme</option><option value="mixte">Lui & Elle (coffret)</option></select></Field>
          <Field label="Style"><select value={p.style} onChange={set('style')} className="input-lux">{Object.entries(STYLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
          <Field label="Mouvement"><select value={p.movement || ''} onChange={set('movement')} className="input-lux"><option>Quartz</option><option>Automatique</option><option>Connectée</option></select></Field>
          <Field label="Bracelet"><input value={p.strap || ''} onChange={set('strap')} className="input-lux" placeholder="Cuir brun, Acier…" /></Field>
          <Field label="Coloris"><input value={p.color || ''} onChange={set('color')} className="input-lux" placeholder="Bleu / Or rose" /></Field>
          <Field label="Taille du boîtier"><input value={p.case_size || ''} onChange={set('case_size')} className="input-lux" placeholder="44 mm" /></Field>
          <Field label="Ordre d'affichage"><input type="number" value={p.sort_order} onChange={set('sort_order')} className="input-lux" /></Field>
          <Field label="Description" className="md:col-span-2"><textarea rows={3} value={p.description || ''} onChange={set('description')} className="input-lux" /></Field>
        </div>
        <div className="mt-6">
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-pale">Photos</span>
          <div className="flex flex-wrap gap-3">
            {p.image_urls.map((u, i) => (
              <div key={u} className="relative h-28 w-24 overflow-hidden rounded-xl border border-line">
                <img src={u} alt="" className="h-full w-full object-cover" />
                {i === 0 && <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 text-[9px] font-bold uppercase text-ink">Principale</span>}
                <button type="button" onClick={() => setP({ ...p, image_urls: p.image_urls.filter((x) => x !== u) })} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/80"><Close className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <label className="grid h-28 w-24 cursor-pointer place-items-center rounded-xl border border-dashed border-gold/50 text-center text-[11px] text-gold hover:bg-gold/5">
              <div><Upload className="mx-auto mb-1 h-5 w-5" />Ajouter</div>
              <input type="file" accept="image/*" multiple hidden onChange={(e) => upload([...e.target.files])} />
            </label>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <Toggle on={p.is_active} onChange={set('is_active')} label="Visible sur le site" />
          <Toggle on={p.in_stock} onChange={set('in_stock')} label="En stock" />
          <Toggle on={p.is_featured} onChange={set('is_featured')} label="Mise en avant" />
          <Toggle on={p.is_new} onChange={set('is_new')} label="Badge « Nouveau »" />
        </div>
        {err && <div className="mt-4 text-sm text-[#F08B7E]">{err}</div>}
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-ghost">Annuler</button>
          <button disabled={busy} className="btn-gold">{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </form>
    </div>
  )
}

function Products({ items, reload }) {
  const [edit, setEdit] = useState(null)
  const [q, setQ] = useState('')
  const list = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
  const del = async (p) => { if (!confirm(`Supprimer définitivement « ${p.name} » ?`)) return; await supabase.from('f237_products').delete().eq('id', p.id); reload() }
  const quick = async (p, patch) => { await supabase.from('f237_products').update(patch).eq('id', p.id); reload() }
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une montre" className="input-lux pl-10" /></div>
        <button onClick={() => setEdit({})} className="btn-gold"><Plus className="h-4 w-4" />Ajouter une montre</button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-4 border-b border-line bg-coal/60 p-3 last:border-0 md:p-4">
            <img src={imgUrl(p)} alt="" className="h-16 w-14 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg">{p.name}</div>
              <div className="text-xs text-muted">{GENDER_LABEL[p.gender]} · {STYLE_LABEL[p.style]} · {fcfa(p.price)}{p.promo_price ? <span className="text-[#F08B7E]"> → {fcfa(p.promo_price)}</span> : ''}</div>
            </div>
            <div className="hidden gap-2 md:flex">
              <button onClick={() => quick(p, { in_stock: !p.in_stock })} className={`rounded-full px-3 py-1 text-[11px] font-semibold ${p.in_stock ? 'bg-[#1FAF5A]/15 text-[#5BD38E]' : 'bg-line text-muted'}`}>{p.in_stock ? 'En stock' : 'Rupture'}</button>
              <button onClick={() => quick(p, { is_active: !p.is_active })} className={`rounded-full px-3 py-1 text-[11px] font-semibold ${p.is_active ? 'bg-gold/15 text-gold' : 'bg-line text-muted'}`}>{p.is_active ? 'Visible' : 'Masquée'}</button>
            </div>
            <Link to={`/montre/${p.slug}`} target="_blank" className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-gold"><Eye className="h-4 w-4" /></Link>
            <button onClick={() => setEdit(p)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-gold hover:border-gold"><Edit className="h-4 w-4" /></button>
            <button onClick={() => del(p)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-[#F08B7E]"><Trash className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      {edit && <ProductForm initial={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload() }} />}
    </div>
  )
}

function Promo({ settings, items, reload }) {
  const [s, setS] = useState(settings)
  const [pct, setPct] = useState(15)
  const [msg, setMsg] = useState('')
  useEffect(() => setS(settings), [settings])
  const save = async () => {
    const { error } = await supabase.from('f237_settings').update({ promo_active: s.promo_active, promo_title: s.promo_title, promo_subtitle: s.promo_subtitle, promo_badge: s.promo_badge, promo_ends_at: s.promo_ends_at || null }).eq('id', 1)
    setMsg(error ? error.message : 'Promotion enregistrée ✓'); reload(); setTimeout(() => setMsg(''), 2500)
  }
  const togglePromo = async (p) => {
    const promo_price = p.promo_price ? null : Math.round((p.price * (100 - pct)) / 100 / 500) * 500
    await supabase.from('f237_products').update({ promo_price }).eq('id', p.id); reload()
  }
  const local = (iso) => { if (!iso) return ''; const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16) }
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="card-lux space-y-5 rounded-2xl p-6">
        <div className="flex items-center justify-between"><div className="font-display text-2xl">Campagne</div><Toggle on={s.promo_active} onChange={(v) => setS({ ...s, promo_active: v })} label={s.promo_active ? 'Active' : 'Désactivée'} /></div>
        <p className="text-sm text-muted">Quand la promotion est active, un bandeau, une section dédiée et une page « Promotions » apparaissent sur le site. Désactivée, tout disparaît automatiquement.</p>
        <Field label="Titre"><input value={s.promo_title || ''} onChange={(e) => setS({ ...s, promo_title: e.target.value })} className="input-lux" /></Field>
        <Field label="Sous-titre"><textarea rows={2} value={s.promo_subtitle || ''} onChange={(e) => setS({ ...s, promo_subtitle: e.target.value })} className="input-lux" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Badge"><input value={s.promo_badge || ''} onChange={(e) => setS({ ...s, promo_badge: e.target.value })} className="input-lux" placeholder="-15 %" /></Field>
          <Field label="Fin (compte à rebours)"><input type="datetime-local" value={local(s.promo_ends_at)} onChange={(e) => setS({ ...s, promo_ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className="input-lux" /></Field>
        </div>
        <button onClick={save} className="btn-gold w-full">Enregistrer la promotion</button>
        {msg && <div className="text-center text-sm text-gold">{msg}</div>}
      </div>
      <div className="card-lux rounded-2xl p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="font-display text-2xl">Montres en promotion</div>
          <label className="flex items-center gap-2 text-sm text-muted">Remise rapide <input type="number" value={pct} onChange={(e) => setPct(+e.target.value)} className="input-lux !w-20 !py-2" />%</label>
        </div>
        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {items.map((p) => (
            <div key={p.id} className={`flex items-center gap-3 rounded-xl border p-2 ${p.promo_price ? 'border-[#B3261E]/60 bg-[#B3261E]/10' : 'border-line'}`}>
              <img src={imgUrl(p)} alt="" className="h-12 w-10 rounded-md object-cover" />
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{p.name}</div><div className="text-xs text-muted">{fcfa(p.price)}{p.promo_price && <span className="text-[#F08B7E]"> → {fcfa(p.promo_price)}</span>}</div></div>
              <button onClick={() => togglePromo(p)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${p.promo_price ? 'bg-line text-ivory' : 'bg-[#B3261E] text-white'}`}>{p.promo_price ? 'Retirer' : `-${pct} %`}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Orders({ orders, reload }) {
  const setStatus = async (o, status) => { await supabase.from('f237_orders').update({ status }).eq('id', o.id); reload() }
  if (!orders.length) return <div className="card-lux rounded-2xl p-10 text-center text-muted">Aucune commande pour le moment. Chaque commande envoyée sur WhatsApp depuis le site apparaîtra ici.</div>
  const color = { nouvelle: 'bg-gold/15 text-gold', 'confirmée': 'bg-[#2E6FD8]/20 text-[#8DB4F5]', 'livrée': 'bg-[#1FAF5A]/15 text-[#5BD38E]', 'annulée': 'bg-line text-muted' }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="card-lux rounded-2xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3"><span className="font-display text-2xl">{o.reference}</span><span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${color[o.status]}`}>{o.status}</span></div>
              <div className="mt-1 text-sm text-muted">{new Date(o.created_at).toLocaleString('fr-FR')} · {o.customer_name} · {o.city}</div>
              <div className="text-sm text-muted">{o.delivery}</div>
            </div>
            <div className="text-right"><div className="text-xl font-bold text-gold-light">{fcfa(o.total)}</div>
              <select value={o.status} onChange={(e) => setStatus(o, e.target.value)} className="input-lux mt-2 !w-auto !py-1.5 text-xs">{['nouvelle', 'confirmée', 'livrée', 'annulée'].map((s) => <option key={s}>{s}</option>)}</select>
            </div>
          </div>
          <div className="mt-3 border-t border-line pt-3 text-sm">{(o.items || []).map((i) => <div key={i.slug} className="flex justify-between"><span>{i.name} × {i.qty}</span><span className="text-muted">{fcfa(i.total)}</span></div>)}</div>
          {o.note && <div className="mt-2 text-sm italic text-muted">« {o.note} »</div>}
        </div>
      ))}
    </div>
  )
}

function Settings({ settings, reload }) {
  const [s, setS] = useState(settings)
  const [msg, setMsg] = useState('')
  useEffect(() => setS(settings), [settings])
  const save = async () => {
    const { error } = await supabase.from('f237_settings').update({ whatsapp_number: s.whatsapp_number.replace(/\D/g, ''), announcement: s.announcement }).eq('id', 1)
    setMsg(error ? error.message : 'Réglages enregistrés ✓'); reload(); setTimeout(() => setMsg(''), 2500)
  }
  return (
    <div className="card-lux max-w-2xl space-y-5 rounded-2xl p-6">
      <Field label="Numéro WhatsApp qui reçoit les commandes"><input value={s.whatsapp_number} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} className="input-lux" placeholder="237654708627" /></Field>
      <p className="-mt-3 text-xs text-muted">Format international sans « + » ni espaces (ex. 237654708627).</p>
      <Field label="Message défilant en haut du site"><textarea rows={2} value={s.announcement || ''} onChange={(e) => setS({ ...s, announcement: e.target.value })} className="input-lux" /></Field>
      <button onClick={save} className="btn-gold">Enregistrer</button>
      {msg && <div className="text-sm text-gold">{msg}</div>}
    </div>
  )
}

function Dash({ items, orders, settings, go }) {
  const stats = [
    ['Montres en ligne', items.filter((p) => p.is_active).length],
    ['Commandes reçues', orders.length],
    ['À traiter', orders.filter((o) => o.status === 'nouvelle').length],
    ['Chiffre (confirmé + livré)', fcfa(orders.filter((o) => ['confirmée', 'livrée'].includes(o.status)).reduce((s, o) => s + o.total, 0))],
  ]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, v]) => <div key={l} className="card-lux rounded-2xl p-5"><div className="text-[11px] uppercase tracking-[0.16em] text-muted">{l}</div><div className="mt-2 font-display text-4xl gold-text">{v}</div></div>)}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <button onClick={() => go('products')} className="card-lux rounded-2xl p-6 text-left transition hover:border-gold/50"><Plus className="h-6 w-6 text-gold" /><div className="mt-3 font-display text-2xl">Ajouter une montre</div><div className="text-sm text-muted">Photo, prix, description : en ligne en 1 minute.</div></button>
        <button onClick={() => go('promo')} className="card-lux rounded-2xl p-6 text-left transition hover:border-gold/50"><Spark className="h-6 w-6 text-gold" /><div className="mt-3 font-display text-2xl">Lancer une promotion</div><div className="text-sm text-muted">{settings.promo_active ? 'Une promotion est en cours.' : 'Aucune promotion active.'}</div></button>
        <button onClick={() => go('orders')} className="card-lux rounded-2xl p-6 text-left transition hover:border-gold/50"><Check className="h-6 w-6 text-gold" /><div className="mt-3 font-display text-2xl">Suivre les commandes</div><div className="text-sm text-muted">Historique des commandes WhatsApp.</div></button>
      </div>
    </div>
  )
}

export default function Admin() {
  const { reload: reloadStore } = useStore()
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tab, setTab] = useState('dash')
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(null)

  const check = async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    if (data.session) { const { data: ok } = await supabase.rpc('f237_is_admin'); setIsAdmin(!!ok) }
  }
  const load = async () => {
    const [{ data: p }, { data: o }, { data: s }] = await Promise.all([
      supabase.from('f237_products').select('*').order('sort_order'),
      supabase.from('f237_orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('f237_settings').select('*').eq('id', 1).single(),
    ])
    setItems(p || []); setOrders(o || []); setSettings(s); reloadStore()
  }
  useEffect(() => { check() }, [])
  useEffect(() => { if (isAdmin) load() }, [isAdmin])

  if (session === undefined) return <div className="grid min-h-screen place-items-center text-muted">Chargement…</div>
  if (!session) return <Login onDone={check} />
  if (!isAdmin) return <div className="grid min-h-screen place-items-center p-5 text-center"><div><div className="font-display text-3xl">Accès non autorisé</div><button onClick={async () => { await supabase.auth.signOut(); check() }} className="btn-ghost mt-6">Se déconnecter</button></div></div>

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-coal/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3"><img src="/brand/logo-sm.png" alt="" className="h-10" /><div><div className="font-caps text-sm font-bold tracking-[0.18em] gold-text">FOSSILE 237</div><div className="text-[11px] text-muted">Administration</div></div></div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="btn-ghost !px-4 !py-2 !text-[11px]"><Eye className="h-4 w-4" />Voir le site</Link>
            <button onClick={async () => { await supabase.auth.signOut(); check() }} className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted hover:text-gold" aria-label="Déconnexion"><Logout className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
          {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition ${tab === k ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-ivory'}`}>{l}{k === 'orders' && orders.filter((o) => o.status === 'nouvelle').length > 0 && <span className="ml-2 rounded-full bg-gold px-1.5 text-[10px] text-ink">{orders.filter((o) => o.status === 'nouvelle').length}</span>}</button>)}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="mb-6 font-display text-4xl">{TABS.find((t) => t[0] === tab)[1]}</h1>
        {!settings ? <div className="text-muted">Chargement…</div> : <>
          {tab === 'dash' && <Dash items={items} orders={orders} settings={settings} go={setTab} />}
          {tab === 'products' && <Products items={items} reload={load} />}
          {tab === 'promo' && <Promo settings={settings} items={items} reload={load} />}
          {tab === 'orders' && <Orders orders={orders} reload={load} />}
          {tab === 'settings' && <Settings settings={settings} reload={load} />}
        </>}
      </main>
    </div>
  )
}
