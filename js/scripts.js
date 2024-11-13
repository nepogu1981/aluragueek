const API_URL = 'http://localhost:3000/products';

// Función para mostrar mensajes en el DOM
function showMessage(containerId, message, duration = 3000) {
    const container = document.getElementById(containerId);
    container.innerText = message;
  
    setTimeout(() => (container.style.display = 'none'), duration);
}

// Función para manejar errores.
function showError(message) {
    showMessage('error-container', message);
}

// Función para manejar mensajes de éxito
function showSuccess(message) {
    showMessage('success-container', message);
}

// Función para obtener productos de la API y mostrarlos
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener productos');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        showError('Error al cargar productos.');
        console.error(error);
    }
}

// Función para renderizar productos en el DOM
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
        
    productCard.innerHTML = ` 
       <img alt="${product.name}" height="150" src="${product.image}" width="150"/>
        <div class="product-info">
            <p>${product.name}</p>
            <p class="price">${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.price)}</p>
            <i class="fas fa-trash delete"></i>
        </div>
    `;
           
        // Añadir el evento de clic para eliminar el producto
        productCard.querySelector('.delete').addEventListener('click', () => confirmDelete(product.id, product.name));

        productList.appendChild(productCard);
    });
}

// Función para confirmar y eliminar un producto
function confirmDelete(id, productName) {
    const confirmation = confirm(`¿Estás seguro de que deseas eliminar el producto "${productName}"?`);
    if (confirmation) {
        deleteProduct(id);
    }
}

// Función para agregar un producto a la API
async function addProduct(name, price, image) {
    const product = { name, price, image };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        
        showSuccess('Producto agregado correctamente');
        fetchProducts();
       
    } catch (error) {
        showError('No se pudo agregar el producto.');
        console.error(error);
    }
}

// Función para eliminar un producto
async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Error al eliminar producto');
        showSuccess('Producto eliminado correctamente');
        fetchProducts();
    } catch (error) {
        showError('No se pudo eliminar el producto.');
        console.error(error);
    }
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('add-product-form').reset();
}

// Manejador para limpiar el formulario
document.querySelector('.reset').addEventListener('click', clearForm);

// Manejar el envío del formulario
document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value;
    addProduct(name, price, image);

    // Mostrar mensaje de éxito debajo del formulario
    showSuccess('Producto agregado exitosamente');
    this.reset(); // Limpiar el formulario después de enviar
});

// Cargar productos al inicio
fetchProducts();

