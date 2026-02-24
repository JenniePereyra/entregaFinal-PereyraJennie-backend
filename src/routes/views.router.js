import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render("products", { products });
    } catch (error) {
        res.status(500).send("Error cargando productos");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate("products.product")
            .lean();

        res.render("cart", { cart });
    } catch (error) {
        res.status(500).send("Error cargando carrito");
    }
});

export default router;