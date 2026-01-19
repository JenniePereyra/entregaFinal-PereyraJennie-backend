const socket = io();

socket.on("products", products => {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
    <div>
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
    </div>
    `;
    });
});
