const cartItems = document.querySelector('#cart-items');
const cartLayout = document.querySelector('#cart-layout');
const cartEmpty = document.querySelector('#cart-empty');

function renderCart() {
  const lines = window.BEStore.getLines();
  cartEmpty.hidden = lines.length > 0;
  cartLayout.hidden = lines.length === 0;
  if (!lines.length) return;

  cartItems.innerHTML = lines.map(({ id, quantity, product, total }) => `
    <article class="cart-item" data-id="${id}">
      <img src="${product.image}" alt="${product.name}, semijoia ilustrativa" width="1024" height="1024" />
      <div class="cart-item-details">
        <span class="cart-item-category">${product.category === 'aneis' ? 'Anéis' : product.category === 'colares' ? 'Colares' : 'Brincos'}</span>
        <h3>${product.name}</h3>
        <p>${window.BEStore.money(product.price)} por unidade <span>· preço ilustrativo</span></p>
        <div class="cart-item-actions"><div class="quantity-control" role="group" aria-label="Quantidade de ${product.name}"><button type="button" data-action="decrease" aria-label="Diminuir quantidade de ${product.name}">−</button><output>${quantity}</output><button type="button" data-action="increase" aria-label="Aumentar quantidade de ${product.name}" ${quantity >= 20 ? 'disabled' : ''}>+</button></div><button class="remove-item" type="button" data-action="remove">Remover</button></div>
      </div>
      <strong class="cart-line-total">${window.BEStore.money(total)}</strong>
    </article>
  `).join('');

  document.querySelector('#cart-item-count').textContent = `${window.BEStore.count()} ${window.BEStore.count() === 1 ? 'item' : 'itens'}`;
  document.querySelector('#cart-subtotal').textContent = window.BEStore.money(window.BEStore.subtotal());
  document.querySelector('#cart-total').textContent = window.BEStore.money(window.BEStore.subtotal());
}

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const id = button.closest('[data-id]').dataset.id;
  const item = window.BEStore.getCart().find((entry) => entry.id === id);
  if (!item) return;
  if (button.dataset.action === 'increase') window.BEStore.setQuantity(id, item.quantity + 1);
  if (button.dataset.action === 'decrease') window.BEStore.setQuantity(id, item.quantity - 1);
  if (button.dataset.action === 'remove') window.BEStore.remove(id);
});

window.addEventListener('be:cartchange', renderCart);
renderCart();
