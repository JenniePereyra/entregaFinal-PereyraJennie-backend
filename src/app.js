import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

mongoose.connect("mongodb+srv://jenniepereyra:Infinite8@cluster0.4wlhfcq.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});