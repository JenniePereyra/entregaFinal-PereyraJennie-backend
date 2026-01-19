import fs from "fs/promises";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const updated = products.filter(p => p.id !== id);
        await fs.writeFile(this.path, JSON.stringify(updated, null, 2));
    }

    async paginateProducts({ limit = 10, page = 1, sort, query }) {
        const products = await this.getProducts();
        let filtered = products;

        if (query) {
            if (query === "true" || query === "false") {
                filtered = filtered.filter(
                    p => p.status === (query === "true")
                );
            } else {
                filtered = filtered.filter(
                    p => p.category === query
                );
            }
        }

        if (sort) {
            filtered.sort((a, b) =>
                sort === "asc" ? a.price - b.price : b.price - a.price
            );
        }

        limit = Number(limit);
        page = Number(page);

        const totalPages = Math.ceil(filtered.length / limit);
        const start = (page - 1) * limit;
        const end = start + limit;

        const payload = filtered.slice(start, end);

        return {
            status: "success",
            payload,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?page=${page - 1}` : null,
            nextLink: page < totalPages ? `/api/products?page=${page + 1}` : null
        };
    }
}