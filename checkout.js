const checkoutFlow = document.querySelector('#checkout-flow');
const checkoutEmpty = document.querySelector('#checkout-empty');
const checkoutComplete = document.querySelector('#checkout-complete');
const contactForm = document.querySelector('#contact-form');
const addressForm = document.querySelector('#address-form');
const deliveryForm = document.querySelector('#delivery-form');
const stepPanels = [...document.querySelectorAll('[data-step]')];
const progressItems = [...document.querySelectorAll('[data-progress]')];
const shippingPrices = { standard: 14.90, express: 29.90 };
const paymentNames = { pix: 'Pix', card: 'Cartão', boleto: 'Boleto' };
let currentStep = 1;
let shippingSelected = false;
let completed = false;

function chosenShipping() { return deliveryForm.elements.shipping.value || 'standard'; }
function chosenPayment() { return deliveryForm.elements.payment.value || 'pix'; }

function renderSummary() {
  const lines = window.BEStore.getLines();
  document.querySelector('#checkout-summary-items').innerHTML = lines.map(({ product, quantity, total }) => `
    <div class="checkout-summary-item"><img src="${product.image}" alt="" width="1024" height="1024" /><span><strong>${product.name}</strong><small>Quantidade: ${quantity}</small></span><b>${window.BEStore.money(total)}</b></div>
  `).join('');
  const subtotal = window.BEStore.subtotal();
  const shipping = shippingSelected ? shippingPrices[chosenShipping()] : 0;
  document.querySelector('#checkout-subtotal').textContent = window.BEStore.money(subtotal);
  document.querySelector('#checkout-shipping').textContent = shippingSelected ? window.BEStore.money(shipping) : 'A escolher';
  document.querySelector('#checkout-total').textContent = window.BEStore.money(subtotal + shipping);
}

function showStep(step) {
  currentStep = step;
  if (step >= 3) shippingSelected = true;
  stepPanels.forEach((panel) => { panel.hidden = Number(panel.dataset.step) !== step; });
  progressItems.forEach((item) => {
    const number = Number(item.dataset.progress);
    item.classList.toggle('is-active', number === step);
    item.classList.toggle('is-complete', number < step);
    if (number === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  renderSummary();
  checkoutFlow.scrollIntoView({ block: 'start', behavior: 'instant' });
}

function updateReview() {
  const contact = new FormData(contactForm);
  const address = new FormData(addressForm);
  const complement = String(address.get('complement') || '').trim();
  document.querySelector('#review-contact').textContent = `${contact.get('name')}\n${contact.get('email')}\n${contact.get('phone')}`;
  document.querySelector('#review-address').textContent = `${address.get('street')}, ${address.get('number')}${complement ? ` — ${complement}` : ''}\n${address.get('district')} · ${address.get('city')}/${address.get('state')}\nCEP ${address.get('postalCode')}`;
  document.querySelector('#review-methods').textContent = `${chosenShipping() === 'express' ? 'Entrega expressa' : 'Entrega padrão'} · ${window.BEStore.money(shippingPrices[chosenShipping()])}\nPagamento: ${paymentNames[chosenPayment()]} (simulado)`;
}

contactForm.addEventListener('submit', (event) => { event.preventDefault(); showStep(2); });
addressForm.addEventListener('submit', (event) => { event.preventDefault(); showStep(3); });
deliveryForm.addEventListener('submit', (event) => { event.preventDefault(); updateReview(); showStep(4); });
deliveryForm.elements.shipping.forEach((input) => input.addEventListener('change', () => { shippingSelected = true; renderSummary(); }));

document.querySelectorAll('[data-back], [data-edit]').forEach((button) => button.addEventListener('click', () => showStep(Number(button.dataset.back || button.dataset.edit))));

document.querySelector('#complete-demo').addEventListener('click', () => {
  if (!window.BEStore.count()) return;
  completed = true;
  const code = `DEMO-${String(Date.now()).slice(-6)}`;
  document.querySelector('#demo-order-code').textContent = code;
  checkoutFlow.hidden = true;
  checkoutComplete.hidden = false;
  window.BEStore.clear();
  contactForm.reset();
  addressForm.reset();
  deliveryForm.reset();
  document.querySelector('#review-contact').textContent = '';
  document.querySelector('#review-address').textContent = '';
  document.querySelector('#review-methods').textContent = '';
  checkoutComplete.scrollIntoView({ block: 'start', behavior: 'instant' });
});

function refreshCheckout() {
  if (completed) return;
  const empty = window.BEStore.count() === 0;
  checkoutEmpty.hidden = !empty;
  checkoutFlow.hidden = empty;
  if (!empty) renderSummary();
}

window.addEventListener('be:cartchange', refreshCheckout);
refreshCheckout();
if (!checkoutFlow.hidden) showStep(currentStep);
