const productoContenedor = document.getElementById('producto-contenedor');
const carritoVentana = document.getElementById('carrito-ventana');
const carritoButton = document.getElementById('carrito-button');
const closeButton = document.querySelector('.close-button');
const carritoItemsContenedor = document.getElementById('carrito-items');
const checkoutButton = document.getElementById('checkout-button');

let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

async function fetchProductos() {
    try {
        const respuesta = await fetch('https://ecomerce-api-gte8.onrender.com/api/productos');
        if (!respuesta.ok) {
            throw new Error('Error al cargar los productos');
        }
        productos = await respuesta.json();
        displayProductos(productos);
    } catch (error) {
        console.error(error);
        productoContenedor.innerHTML = '<p>No se pudo cargar los productos</p>';
    }
}

function displayProductos(productos) {
    productoContenedor.innerHTML = '';
    productos.forEach(producto => {
        const productoCaja = document.createElement('div');
        productoCaja.classList.add('producto-caja');
        productoCaja.innerHTML = `
            <h3>${producto.name}</h3>
            <p>${producto.description}</p>
            <p>Precio: $${producto.price}</p>
            <p>Stock: ${producto.stock}</p>
            <button class="add-to-carrito-btn" data-id="${producto.id}" ${producto.stock === 0 ? 'disabled' : ''}>
                ${producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>`;
        productoContenedor.appendChild(productoCaja);
    });
}

function getProductoById(id) {
    return productos.find(p => p.id == id);
}

function updateCarritoDisplay() {
    carritoItemsContenedor.innerHTML = '';

    if (carrito.length === 0) {
        carritoItemsContenedor.innerHTML = '<p>El carrito esta vacio</p>';
        return;
    }

    carrito.forEach((producto, index) => {
        const item = document.createElement('div');
        item.classList.add('carrito-item');
        item.innerHTML = `
            <p><strong>${producto.name}</strong> - $${producto.price}</p>
            <button class="remove-btn" data-index="${index}">Eliminar</button>`;
        carritoItemsContenedor.appendChild(item);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            updateCarritoDisplay();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProductos();
    updateCarritoDisplay();

    carritoButton.addEventListener('click', () => {
        carritoVentana.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        carritoVentana.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === carritoVentana) {
            carritoVentana.style.display = 'none';
        }
    });

    productoContenedor.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-carrito-btn')) {
            const productoId = event.target.dataset.id;
            const producto = getProductoById(productoId);

            if (producto) {
                const enCarrito = carrito.filter(p => p.id == producto.id).length;

                if (enCarrito < producto.stock) {
                    carrito.push(producto);
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    updateCarritoDisplay();
                    alert(`${producto.name} se agrego al carrito`);
                } else {
                    alert(`No hay mas stock de ${producto.name}`);
                }
            }
        }
    });
    checkoutButton.addEventListener('click', () => {
        if (carrito.length > 0) {
            alert('¡Gracias por tu compra!');
            localStorage.removeItem('carrito');
            carrito = [];
            updateCarritoDisplay();
        } else {
            alert('El carrito esta vacio');
        }
    });
});