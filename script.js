// =========================
// CARRITO + RENDER PRODUCTOS
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // ------- Catálogo de ejemplo (puedes cambiar precios/nombres) -------
  const catalogo = [
    { 
  id: 1, 
  nombre: 'PC Oficina Esentials', 
  precio: 18990,
  img: 'pc oficina esencial.png'
},
 { 
  id: 2, 
  nombre: 'AMD Ryzen 5 5600', 
  precio: 49990,
  img: 'amd ryzen 7 5600x.png'
},
 { 
  id: 3, 
  nombre: 'PC Gaming RTX', 
  precio: 18990,
  img: 'Pc Gaming rtx.png'
},
 { 
  id: 4, 
  nombre: 'SSD NVMe 1TB', 
  precio: 2700,
  img: 'ssd nvme 1tb.png'
},
{ 
  id: 5, 
  nombre: 'RAM 16GB (2x8) 3200MHz', 
  precio: 1850,
  img: 'ram 16gb 2x8 3200 mhz.png'
},
{ 
  id: 5, 
  nombre: 'GeForce RTX 4060', 
  precio: 12900,
  img: 'geforce rtx 4060.png'
},

  ];

  // ------- Referencias DOM (algunas pueden no existir) -------
  const $lista = document.getElementById('productos-lista');   // contenedor productos
  const $buscador = document.getElementById('buscador');        // input búsqueda
  const $contador = document.getElementById('contador-carrito');// span contador en nav
  const $toggleCart = document.getElementById('toggle-cart');   // botón abrir/cerrar carrito
  const $cartModal = document.getElementById('cart-modal');     // mini-modal
  const $cartBody = document.getElementById('cart-body');       // items
  const $cartTotal = document.getElementById('cart-total');     // total
  const $btnVaciar = document.getElementById('btn-vaciar');     // vaciar
  const $btnPagar = document.getElementById('btn-pagar');       // pagar

  // ------- Estado: carrito {id: cantidad} -------
  let carrito = cargarCarrito();

  // ------- Utilidades -------
  function formatear(n) { return 'L ' + n.toLocaleString('es-HN'); }
  function guardarCarrito() { localStorage.setItem('carritoTechStore', JSON.stringify(carrito)); }
  function cargarCarrito() {
    try { return JSON.parse(localStorage.getItem('carritoTechStore')) || {}; }
    catch { return {}; }
  }
  function contarItems() {
    const total = Object.values(carrito).reduce((a,b) => a + b, 0);
    if ($contador) $contador.textContent = total;
  }

  // ------- Render de productos (solo si estamos en productos.html) -------
  function renderProductos(filtro = '') {
    if (!$lista) return;
    $lista.innerHTML = '';
    const data = catalogo.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));
    if (!data.length) {
      $lista.innerHTML = `<p>No se encontraron productos.</p>`;
      return;
    }
    data.forEach(p => {
      const article = document.createElement('article');
      article.className = 'card product';
      article.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="price">${formatear(p.precio)}</p>
        <button class="btn" data-add="${p.id}">Agregar al carrito</button>
      `;
      $lista.appendChild(article);
    });


  // ------- Carrito: agregar, quitar, eliminar -------
  function agregar(id, cant=1) {
    carrito[id] = (carrito[id] || 0) + cant;
    if (carrito[id] <= 0) delete carrito[id];
    guardarCarrito(); contarItems(); renderCarrito();
  }
  function eliminar(id) {
    delete carrito[id];
    guardarCarrito(); contarItems(); renderCarrito();
  }

  // ------- Render mini-modal -------
  function renderCarrito() {
    if (!$cartBody || !$cartTotal) return;
    const ids = Object.keys(carrito);
    if (!ids.length) {
      $cartBody.innerHTML = `<div class="cart-empty">Tu carrito está vacío.</div>`;
      $cartTotal.textContent = formatear(0);
      return;
    }
    let total = 0;
    $cartBody.innerHTML = ids.map(id => {
      const prod = catalogo.find(p => p.id == id);
      const qty = carrito[id];
      const subtotal = prod.precio * qty;
      total += subtotal;
      return `
        <div class="cart-item">
          <h4>${prod.nombre}</h4>
          <div class="cart-qty">
            <button data-dec="${id}" title="Quitar uno">–</button>
            <span>${qty}</span>
            <button data-inc="${id}" title="Agregar uno">+</button>
            <strong>${formatear(subtotal)}</strong>
            <button data-del="${id}" title="Eliminar">✕</button>
          </div>
        </div>`;
    }).join('');
    $cartTotal.textContent = formatear(total);
  }

  // ------- Eventos -------
  if ($lista) {
    $lista.addEventListener('click', e => {
      const btnAdd = e.target.closest('button[data-add]');
      if (btnAdd) agregar(Number(btnAdd.dataset.add), 1);
    });
  }

  if ($buscador) {
    $buscador.addEventListener('input', e => renderProductos(e.target.value));
  }

  if ($toggleCart && $cartModal) {
    $toggleCart.addEventListener('click', (e) => {
      e.preventDefault();
      $cartModal.classList.toggle('open');
      renderCarrito();
    });
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!$cartModal.classList.contains('open')) return;
      const clickDentro = e.target.closest('#cart-modal') || e.target.closest('#toggle-cart');
      if (!clickDentro) $cartModal.classList.remove('open');
    });
  }

  if ($cartModal) {
    $cartModal.addEventListener('click', e => {
      const dec = e.target.closest('button[data-dec]');
      const inc = e.target.closest('button[data-inc]');
      const del = e.target.closest('button[data-del]');
      if (dec) agregar(Number(dec.dataset.dec), -1);
      if (inc) agregar(Number(inc.dataset.inc), +1);
      if (del) eliminar(Number(del.dataset.del));
    }); 
  }

  if ($btnVaciar) {
    $btnVaciar.addEventListener('click', () => {
      carrito = {};
      guardarCarrito(); contarItems(); renderCarrito();
    });
  }
  if ($btnPagar) {
    $btnPagar.addEventListener('click', () => {
      if (!Object.keys(carrito).length) return alert('Tu carrito está vacío.');
      alert('¡Gracias por tu compra! (Demo)');
      carrito = {};
      guardarCarrito(); contarItems(); renderCarrito();
    });
  }

  // ------- Inicializaciones -------
  }renderProductos();
  contarItems();
  renderCarrito();
});
