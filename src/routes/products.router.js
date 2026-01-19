import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("products", { products });
});

export default router;