const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('products');
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

cargarEventListeners();
let productosEnCarrito = [];

// Calcular subtotal
function calcularSubtotal() {
    let subtotal = 0;
    let totalProductos = 0;

    productosEnCarrito.forEach(producto => {
        const precioNumerico = parseFloat(producto.precio.replace('₡', '').replace(/\./g, '').replace(',', '').trim());
        subtotal += precioNumerico * producto.cantidad;
        totalProductos += producto.cantidad;
    });

    let subtotalFinal = subtotal;

    const mensajeDescuento = document.getElementById("mensaje-descuento");
    if (totalProductos >= 3) {
        const descuento = subtotal * 0.142857142857;
        subtotalFinal = subtotal - descuento;
        mensajeDescuento.style.display = "block";
    } else {
        mensajeDescuento.style.display = "none";
    }

    const subtotalSpan = document.getElementById("subtotal");
    subtotalSpan.textContent = `₡${formatoMiles(subtotalFinal.toFixed(2))}`;
}

// Función para formatear números con separador de miles
function formatoMiles(numero) {
    return numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function calcularSubtotalConDescuento(subtotal) {
    const descuento = subtotal * 0.14;
    return subtotal - descuento;
}

function obtenerProductosDelCarrito() {
    const productosEnCarrito = [];

    // Obtén todas las filas de la tabla
    const filas = document.querySelectorAll("#lista-carrito tbody tr");

    // Recorre las filas y obtén los datos de cada producto
    filas.forEach(fila => {
        const imagen = fila.querySelector("img").src;
        const titulo = fila.querySelector("td:nth-child(2)").textContent;
        const precio = fila.querySelector("td:nth-child(3)").textContent;
        const id = fila.querySelector(".borrar").getAttribute("data-id");

        // Crea un objeto con los datos y agrégalo al array
        const producto = {
            imagen,
            titulo,
            precio,
            id
        };

        productosEnCarrito.push(producto);
    });

    return productosEnCarrito;
}

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }

    const productoExistente = productosEnCarrito.find(producto => producto.id === infoElemento.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        infoElemento.cantidad = 1;
        productosEnCarrito.push(infoElemento);
    }

    insertarCarrito();
    calcularSubtotal(); // Asegurarse de recalcular el subtotal después de agregar un producto
}

function insertarCarrito() {
    lista.innerHTML = '';

    productosEnCarrito.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>
                ${producto.titulo}
            </td>
            <td>
                ${producto.precio}
            </td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" class="cantidad-producto">
            </td>
            <td>
                <a href="#" class="borrar" data-id="${producto.id}">X</a>
            </td>
        `;
        lista.appendChild(row);
    });

    // Guardar el carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

    calcularSubtotal();
}

lista.addEventListener('change', (e) => {
    if (e.target.classList.contains('cantidad-producto')) {
        const nuevaCantidad = parseInt(e.target.value);
        const productoId = e.target.parentElement.parentElement.querySelector('.borrar').getAttribute('data-id');
        const productoExistente = productosEnCarrito.find(producto => producto.id === productoId);

        if (productoExistente && !isNaN(nuevaCantidad) && nuevaCantidad >= 1) {
            productoExistente.cantidad = nuevaCantidad;
            insertarCarrito();
        } else {
            e.target.value = productoExistente.cantidad;
        }

        calcularSubtotal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos del carrito desde el almacenamiento local
    const carritoGuardado = localStorage.getItem('carrito');

    if (carritoGuardado) {
        productosEnCarrito = JSON.parse(carritoGuardado);
        insertarCarrito();
    }
});

function eliminarElemento(e) {
    e.preventDefault();

    if (e.target.classList.contains('borrar')) {
        const elementoId = e.target.getAttribute('data-id');
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== elementoId);

        insertarCarrito();
        calcularSubtotal();
    }
}

function vaciarCarrito() {
    while(lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }

    productosEnCarrito = []; // Reiniciar el array de productos en el carrito
    calcularSubtotal(); // Asegurarse de recalcular el subtotal después de vaciar el carrito
    return false;
}

const menuLinks = document.querySelectorAll(".navbar ul li a");

menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        const menuCheckbox = document.getElementById("menu");
        menuCheckbox.checked = false;
    });
});

cargarEventListeners();
