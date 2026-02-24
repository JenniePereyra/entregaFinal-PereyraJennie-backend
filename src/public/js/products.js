const buttons = document.querySelectorAll(".add-to-cart");

buttons.forEach(button => {
    button.addEventListener("click", async () => {
        const productId = button.dataset.pid;

        try {
            const response = await fetch(`/api/carts/699d7eb82e1b862718cbacd4/products/${productId}`, {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta");
            }

            window.location.href = `/carts/699d7eb82e1b862718cbacd4`;

        } catch (error) {
            alert("Hubo un error al agregar el producto al carrito");
        }
    });
});