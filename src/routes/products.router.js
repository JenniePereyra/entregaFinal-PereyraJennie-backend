import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");


router.post("/", async (req, res) => {
    const product = await manager.addProduct(req.body);
    const io = req.app.get("io");
    io.emit("refreshProducts"); 
    res.status(201).json(product);
});


router.delete("/:id", async (req, res) => {
    await manager.deleteProduct(req.params.id);
    const io = req.app.get("io");
    io.emit("refreshProducts"); 
    res.sendStatus(204);
});


router.get("/", async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

export default router;

