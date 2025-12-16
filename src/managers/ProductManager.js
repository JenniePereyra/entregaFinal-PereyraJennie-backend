import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];

        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, "utf-8");
            this.products = data ? JSON.parse(data) : [];
        }
    }

    async saveProducts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }

    generateId() {
        return this.products.length > 0
            ? Math.max(...this.products.map(p => p.id)) + 1
            : 1;
    }

    async addProduct({ title, price }) {
        const newProduct = {
            id: this.generateId(),
            title,
            price: Number(price)
        };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async deleteProduct(id) {
        this.products = this.products.filter(p => p.id != id);
        await this.saveProducts();
    }

    async getProducts() {
        return this.products;
    }
}