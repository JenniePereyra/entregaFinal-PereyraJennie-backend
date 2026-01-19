import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/products", async (req, res) => {
    const result = await productManager.paginateProducts(req.query);
    res.render("home", result);
});

export default router;