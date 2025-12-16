import fs from "fs";
import ProductManager from "./ProductManager.js";

class CartManager {
    constructor(path = "./carts.json") {
        this.path = path;
        this.productManager = new ProductManager();
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    async getAll() {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data);
    }

    async getById(id) {
        const carts = await this.getAll();
        return carts.find(c => c.id === Number(id)) || null;
    }

    async add(cart = { products: [] }) {
        const carts = await this.getAll();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: cart.products
        };
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProduct(cartId, productId, quantity = 1) {
        const carts = await this.getAll();
        const cart = carts.find(c => c.id === Number(cartId));
        if (!cart) return null;

        const product = await this.productManager.getById(productId);
        if (!product) throw new Error("Producto no encontrado");

        const existing = cart.products.find(p => p.productId === Number(productId));
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.products.push({ productId: Number(productId), quantity });
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async delete(id) {
        const carts = await this.getAll();
        const index = carts.findIndex(c => c.id === Number(id));
        if (index === -1) return null;
        const deleted = carts.splice(index, 1);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return deleted[0];
    }
}

export default CartManager;