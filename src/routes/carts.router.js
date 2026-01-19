import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
    const cart = { id: Date.now().toString(), products: [] };
    await cartManager.createCart(cart);
    res.json(cart);
});

router.post("/:cid/products/:pid", async (req, res) => {
    await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.json({ status: "success" });
});

router.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
    await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    res.json({ status: "success" });
});

router.put("/:cid", async (req, res) => {
    await cartManager.updateCart(req.params.cid, req.body.products);
    res.json({ status: "success" });
});

router.put("/:cid/products/:pid", async (req, res) => {
    await cartManager.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        req.body.quantity
    );
    res.json({ status: "success" });
});

router.delete("/:cid", async (req, res) => {
    await cartManager.clearCart(req.params.cid);
    res.json({ status: "success" });
});

export default router;
