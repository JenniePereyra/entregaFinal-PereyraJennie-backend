import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const productManager = new ProductManager("./src/data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use("/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(8080);
const io = new Server(httpServer);

io.on("connection", async socket => {
    const products = await productManager.getProducts();
    socket.emit("products", products);
});

export { io };
