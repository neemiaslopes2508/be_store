# Bê Store

Landing page e catálogo estáticos e responsivos para a Bê Store.

## Visualização

Abra `index.html` no navegador. Não é necessário instalar dependências nem executar um build.

## Conteúdo

- Os botões de contato levam ao Instagram oficial `@_usebestore`.
- As categorias da página inicial abrem `catalogo.html` com os produtos da categoria correspondente.
- O catálogo contém 10 produtos fictícios, com fotos e preços ilustrativos. Não representa o estoque real nem permite compras reais.
- O fluxo de compra é uma demonstração: carrinho, identificação como visitante, endereço, escolha de entrega e forma de pagamento, revisão e confirmação fictícia.
- O carrinho guarda somente IDs e quantidades no armazenamento local do navegador. Dados de contato e endereço não são enviados nem salvos; nenhum dado de cartão é solicitado.
- As fotos de semijoias são imagens editoriais ilustrativas, não fotografias do estoque real.
- A logo em `assets/be-store-logo.png` é a imagem enviada pela marca.

Para atualizar os produtos, edite a lista em `products.js`. Os estilos do catálogo estão em `catalogo.css`; o carrinho e o checkout usam `shop.css`. A página inicial está em `index.html` e seus estilos em `styles.css`.
