import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};

        if (query) {
            if (query === "true" || query === "false") {
                filter.status = query === "true";
            } else {
                filter.category = query;
            }
        }

        let sortOption = {};
        if (sort === "asc") sortOption.price = 1;
        if (sort === "desc") sortOption.price = -1;

        const result = await Product.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true
        });

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `http://localhost:8080/api/products?page=${result.prevPage}&limit=${limit}`
                : null,
            nextLink: result.hasNextPage
                ? `http://localhost:8080/api/products?page=${result.nextPage}&limit=${limit}`
                : null
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.pid, req.body);
        res.json({ message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

export default router;