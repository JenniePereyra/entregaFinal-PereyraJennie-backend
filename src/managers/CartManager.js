import fs from "fs/promises";

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async createCart(cart) {
        const carts = await this.getCarts();
        carts.push(cart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        const product = cart.products.find(p => p.product === pid);

        if (product) {
            product.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async removeProductFromCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        cart.products = cart.products.filter(p => p.product !== pid);

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async updateCart(cid, products) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        cart.products = products;

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async updateProductQuantity(cid, pid, quantity) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        const product = cart.products.find(p => p.product === pid);
        product.quantity = quantity;

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    async clearCart(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        cart.products = [];

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
}
