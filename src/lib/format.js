export const fcfa = (n) => `${Number(n || 0).toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`
export const STYLE_LABEL = { chronographe: 'Chronographe', automatique: 'Automatique', classique: 'Classique', coffret: 'Coffret' }
export const GENDER_LABEL = { homme: 'Pour lui', femme: 'Pour elle', mixte: 'Lui & Elle' }
export const STORES = [
  { city: 'Yaoundé', name: 'Mfoundi Mall', detail: 'Face CAMAIR-Co, Boutique N° 1070', hint: "Entrée tout près de la Paroisse Marie Gocker", phones: ['+237 654 70 86 27', '+237 697 03 08 80'], maps: 'https://www.google.com/maps/search/?api=1&query=Mfoundi+Mall+Yaound%C3%A9' },
  { city: 'Douala', name: 'Centre Commercial Saligny', detail: 'Mahima Bonamoussadi, Boutique H1-6', hint: "À l'étage", phones: ['+237 678 59 31 32', '+237 679 86 31 25'], maps: 'https://www.google.com/maps/search/?api=1&query=Centre+Commercial+Saligny+Bonamoussadi+Douala' },
]
export const effectivePrice = (p, settings) => (settings?.promo_active && p.promo_price ? p.promo_price : p.price)
export const imgUrl = (p) => (p?.image_urls && p.image_urls[0]) || '/brand/poster.webp'
export const waLink = (number, text) => `https://wa.me/${String(number || '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
