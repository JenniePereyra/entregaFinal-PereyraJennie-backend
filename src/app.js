import express from "express";
import { Server as HttpServer } from "http";
import { Server as SocketIO } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";
import open from "open";

import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketIO(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use((req, res, next) => {
    req.app.set("io", io);
    next();
});


app.use("/api/products", productsRouter);
app.use("/", viewsRouter);


io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    open(`http://localhost:${PORT}/realtimeproducts`);
});
