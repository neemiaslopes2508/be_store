const products = [
  { id: 'brinco-argola-lumi', category: 'brincos', name: 'Argola Lumi', price: 79.90, image: 'assets/brincos.webp', description: 'Argolas de linhas suaves para iluminar as combinações do dia a dia.', tag: 'Favorito' },
  { id: 'brinco-perola-serena', category: 'brincos', name: 'Pérola Serena', price: 69.90, image: 'assets/products/brinco-perola.webp', description: 'Um ponto de delicadeza com pérolas que acrescentam luz ao visual.', tag: 'Novo' },
  { id: 'brinco-gota-dourada', category: 'brincos', name: 'Gota Dourada', price: 89.90, image: 'assets/products/brinco-gota.webp', description: 'Formato escultural de gota para um toque elegante e contemporâneo.', tag: '' },
  { id: 'colar-camadas', category: 'colares', name: 'Colar Camadas', price: 119.90, image: 'assets/colares.webp', description: 'Duas camadas delicadas que criam uma composição pronta para brilhar.', tag: 'Favorito' },
  { id: 'colar-aurora', category: 'colares', name: 'Colar Aurora', price: 109.90, image: 'assets/products/colar-aurora.webp', description: 'Corrente fina com pingente oval de desenho simples e marcante.', tag: '' },
  { id: 'colar-perola-clara', category: 'colares', name: 'Pérola Clara', price: 129.90, image: 'assets/products/colar-perola.webp', description: 'Uma pequena pérola em destaque para composições leves e românticas.', tag: 'Novo' },
  { id: 'anel-duo-delicado', category: 'aneis', name: 'Duo Delicado', price: 89.90, image: 'assets/aneis.webp', description: 'Uma dupla delicada para combinar, misturar e criar seu próprio estilo.', tag: 'Favorito' },
  { id: 'anel-organico', category: 'aneis', name: 'Anel Orgânico', price: 99.90, image: 'assets/products/anel-organico.webp', description: 'Curvas naturais e acabamento luminoso em uma peça cheia de personalidade.', tag: '' },
  { id: 'anel-solitario-luz', category: 'aneis', name: 'Solitário Luz', price: 109.90, image: 'assets/products/anel-solitario.webp', description: 'Um pequeno ponto de brilho em uma silhueta clássica e delicada.', tag: 'Novo' },
  { id: 'anel-duplo-harmonia', category: 'aneis', name: 'Duplo Harmonia', price: 94.90, image: 'assets/products/anel-duplo.webp', description: 'Linhas paralelas que trazem leveza e movimento para as mãos.', tag: '' },
];

const categories = {
  todos: { title: 'Todas as <em>peças.</em>', label: 'Todas as peças', description: 'Uma seleção para descobrir detalhes que combinam com o seu jeito de brilhar.', image: 'assets/hero-joias.webp', imageAlt: 'Semijoias douradas em composição editorial' },
  brincos: { title: 'Brincos que <em>iluminam.</em>', label: 'Brincos', description: 'Do detalhe discreto ao toque marcante, encontre uma forma de brilhar que é só sua.', image: 'assets/brincos.webp', imageAlt: 'Brincos dourados de argola sobre pedra clara' },
  colares: { title: 'Colares para <em>sentir.</em>', label: 'Colares', description: 'Peças delicadas que ficam perto do coração e completam sua expressão.', image: 'assets/colares.webp', imageAlt: 'Colares dourados delicados sobre seda clara' },
  aneis: { title: 'Anéis para <em>ser você.</em>', label: 'Anéis', description: 'Pequenos detalhes nas mãos para contar sua história de um jeito único.', image: 'assets/aneis.webp', imageAlt: 'Anéis dourados delicados sobre pedra clara' },
};

const requestedCategory = new URLSearchParams(window.location.search).get('categoria');
const currentCategory = Object.hasOwn(categories, requestedCategory) ? requestedCategory : 'todos';
const category = categories[currentCategory];
const filteredProducts = products.filter((product) => currentCategory === 'todos' || product.category === currentCategory);
const priceFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

document.title = `${category.label} | Bê Store`;
document.querySelector('#catalog-title').innerHTML = category.title;
document.querySelector('#catalog-description').textContent = category.description;
document.querySelector('#breadcrumb-current').textContent = category.label;
document.querySelector('#hero-count').textContent = filteredProducts.length;
document.querySelector('#product-count').textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? 'produto' : 'produtos'}`;
document.querySelector('#catalog-hero-image').src = category.image;
document.querySelector('#catalog-hero-image').alt = category.imageAlt;
const activeTab = document.querySelector(`[data-category-link="${currentCategory}"]`);
activeTab.setAttribute('aria-current', 'page');
requestAnimationFrame(() => {
  const tabs = document.querySelector('.category-tabs');
  const hiddenRight = activeTab.getBoundingClientRect().right - tabs.getBoundingClientRect().right;
  if (hiddenRight > 0) tabs.scrollLeft += hiddenRight + 18;
});

const grid = document.querySelector('#product-grid');
const sortSelect = document.querySelector('#sort-products');
const dialog = document.querySelector('#product-dialog');

function sortedProducts() {
  const list = [...filteredProducts];
  if (sortSelect.value === 'price-asc') list.sort((a, b) => a.price - b.price);
  if (sortSelect.value === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (sortSelect.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return list;
}

function renderProducts() {
  grid.innerHTML = sortedProducts().map((product) => `
    <article class="product-card">
      <button class="product-open" type="button" data-product-id="${product.id}" aria-label="Ver detalhes de ${product.name}">
        <span class="product-image-wrap"><img src="${product.image}" alt="${product.name}, semijoia ilustrativa" width="1024" height="1024" loading="lazy" />${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}<span class="product-quick-view" aria-hidden="true">↗</span></span>
        <span class="product-meta">${categories[product.category].label}</span>
        <span class="product-name">${product.name}</span>
        <span class="product-price">${priceFormat.format(product.price)} <small>preço ilustrativo</small></span>
      </button>
    </article>
  `).join('');
}

function openProduct(product) {
  document.querySelector('#dialog-image').src = product.image;
  document.querySelector('#dialog-image').alt = `${product.name}, semijoia ilustrativa`;
  document.querySelector('#dialog-category').textContent = categories[product.category].label;
  document.querySelector('#dialog-title').textContent = product.name;
  document.querySelector('#dialog-description').textContent = product.description;
  document.querySelector('#dialog-price').textContent = priceFormat.format(product.price);
  dialog.showModal();
}

sortSelect.addEventListener('change', renderProducts);
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-product-id]');
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.productId);
  if (product) openProduct(product);
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

renderProducts();
