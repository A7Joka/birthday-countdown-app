// ====== CART (localStorage) ======
const LS_KEY = "cart.v1";
export const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  },
  save(items) { localStorage.setItem(LS_KEY, JSON.stringify(items)); },
  add(item, qty=1) {
    const items = Cart.get();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      items[idx].qty += qty;
    } else {
      items.push({ id: item.id, title: item.title, price: item.discount ?? item.price, image: item.image, qty });
    }
    Cart.save(items);
  },
  remove(id) {
    Cart.save(Cart.get().filter(i => i.id !== id));
  },
  clear() { Cart.save([]); },
  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  }
};