const buttons = document.querySelectorAll(".add-to-cart");

buttons.forEach(button => {
    button.addEventListener("click", async () => {
        const productId = button.dataset.pid;

        await fetch(`/api/carts/1/products/${productId}`, {
            method: "POST"
        });

        window.location.href = "/api/carts/1";
    });
});
