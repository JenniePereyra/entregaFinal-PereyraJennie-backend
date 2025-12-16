import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

router.get("/test", (req, res) => {
    res.send("Router de carritos funciona!");
});

router.get("/", async (req, res) => {
    const carts = await manager.getAll();
    res.json(carts);
});

router.get("/:id", async (req, res) => {
    const cart = await manager.getById(req.params.id);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
});

router.post("/", async (req, res) => {
    const newCart = await manager.add(req.body);
    res.status(201).json(newCart);
});

router.post("/:id/products", async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const updatedCart = await manager.addProduct(req.params.id, productId, quantity);
        if (!updatedCart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const deleted = await manager.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json({ message: "Carrito eliminado correctamente" });
});

export default router;