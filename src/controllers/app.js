import express from "express";
import ProductManager from "../../Desafios/ProductManager.js"
import { routerCart } from "../routers/routerCart.js";
import { engine } from "express-handlebars";
import * as path from "path"
import __dirname from "../utils.js";

const app = express()
app.use(express.urlencoded({ extended: true }))

const productos = new ProductManager("products.json");
/*
productos.addProduct("Coca-Cola", "Es una gaseosa azucarada y vendida a nivel mundial", 950, "https://coca-colafemsa.com/wp-content/uploads/2020/02/1-40.png", 45454, 10)
productos.addProduct("Cotonetes", "es un instrumento utilizado para recoger muestras, para su posterior estudio, normalmente en medicina se usa para saber que germen afecta a una infección, también se usa en cosméticos y aunque también se suele usar en la limpieza de la oreja", 400, "https://tekielar.vtexassets.com/arquivos/ids/168479/6030941.jpg?v=637975102718330000", 23435, 9)
*/


app.get("/products", (req, res) => {

    const allProducts = productos.getProducts();
    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(allProducts);
    const productLimit = allProducts.slice(0, limit);
    res.send(productLimit);
});



app.get("/products/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const productById = productos.getProductById(id);
    if (productById) {
        res.send(productById);
    } else {
        res.status(404).send({ error: "Producto no encontrado" });
    }
});

app.use("/products/cart", routerCart)

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res) => {
    const allProducts = productos.getProducts();
    res.render("home",{
        title: "Express Avanzado | Handlebars",
        products : allProducts
    })
})

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Express por local host ${server.address().port}`)
})
server.on("error", (error) => console.log(`Error del servdor ${error}`))