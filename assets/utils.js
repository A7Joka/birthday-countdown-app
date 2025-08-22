export function formatCurrency(n){ return new Intl.NumberFormat('ar-EG', { style:'currency', currency:'EGP' }).format(n); }
export function qs(s, root=document){ return root.querySelector(s); }
export function qsa(s, root=document){ return Array.from(root.querySelectorAll(s)); }
export function getParam(name){ return new URLSearchParams(location.search).get(name); }
export function slugify(s){ return s.toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,''); }