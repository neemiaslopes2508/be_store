(() => {
  const key = 'be-store-demo-cart-v1';
  const products = window.BE_PRODUCTS;
  const productById = new Map(products.map((product) => [product.id, product]));
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  let fallbackCart = [];

  function normalize(value) {
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    return value.filter((item) => {
      if (!item || !productById.has(item.id) || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).map((item) => ({ id: item.id, quantity: Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1))) }));
  }

  function getCart() {
    try { return normalize(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch { return normalize(fallbackCart); }
  }

  function saveCart(cart) {
    const clean = normalize(cart);
    fallbackCart = clean;
    try { localStorage.setItem(key, JSON.stringify(clean)); } catch { /* Cart remains available on this page. */ }
    window.dispatchEvent(new Event('be:cartchange'));
  }

  function add(id) {
    if (!productById.has(id)) return;
    const cart = getCart();
    const found = cart.find((item) => item.id === id);
    if (found) found.quantity = Math.min(20, found.quantity + 1);
    else cart.push({ id, quantity: 1 });
    saveCart(cart);
  }

  function setQuantity(id, quantity) {
    const cart = getCart();
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    if (quantity <= 0) saveCart(cart.filter((entry) => entry.id !== id));
    else { item.quantity = Math.min(20, Math.floor(quantity)); saveCart(cart); }
  }

  function remove(id) { saveCart(getCart().filter((item) => item.id !== id)); }
  function clear() { saveCart([]); }
  function getLines() { return getCart().map((item) => ({ ...item, product: productById.get(item.id), total: productById.get(item.id).price * item.quantity })); }
  function subtotal() { return getLines().reduce((sum, item) => sum + item.total, 0); }
  function count() { return getCart().reduce((sum, item) => sum + item.quantity, 0); }

  function refreshBadges() {
    const amount = count();
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.textContent = amount;
      badge.hidden = amount === 0;
    });
    document.querySelectorAll('[data-cart-link]').forEach((link) => link.setAttribute('aria-label', `Carrinho, ${amount} ${amount === 1 ? 'item' : 'itens'}`));
  }

  window.BEStore = { getCart, getLines, subtotal, count, add, setQuantity, remove, clear, money: (value) => money.format(value), refreshBadges };
  window.addEventListener('be:cartchange', refreshBadges);
  window.addEventListener('storage', refreshBadges);
  refreshBadges();
})();
