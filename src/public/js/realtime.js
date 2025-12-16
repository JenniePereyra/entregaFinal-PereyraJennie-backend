const socket = io();

const productsList = document.getElementById('productsList');


async function renderProducts() {
    const res = await fetch('/api/products');
    const products = await res.json();

    productsList.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${product.title} - $${product.price}
            <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        `;
        productsList.appendChild(li);
    });
}


async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    renderProducts(); 
}


socket.on('refreshProducts', () => {
    renderProducts();
});


const form = document.getElementById('productForm');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    form.reset();
    renderProducts(); 
});


renderProducts();
