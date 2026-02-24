import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate("products.product");

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const productIndex = cart.products.findIndex(
            p => p.product.toString() === pid
        );

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        res.status(200).json({ message: "Producto agregado al carrito" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;