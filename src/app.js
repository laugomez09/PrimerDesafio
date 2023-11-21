import express from "express"
import ProductManager from "../Desafios/ProductManager.js"

const app = express()
app.use(express.urlencoded({ extended: true }))

const productos = new ProductManager;
productos.addProduct("Coca-Cola", "Es una gaseosa azucarada y vendida a nivel mundial", 950, "https://coca-colafemsa.com/wp-content/uploads/2020/02/1-40.png", 45454, 10)
productos.addProduct("Cotonetes", "es un instrumento utilizado para recoger muestras, para su posterior estudio, normalmente en medicina se usa para saber que germen afecta a una infección, también se usa en cosméticos y aunque también se suele usar en la limpieza de la oreja", 400, "https://tekielar.vtexassets.com/arquivos/ids/168479/6030941.jpg?v=637975102718330000", 23435, 9)

const getProducts = productos.getProducts()

app.get("/products", (req, res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(getProducts)
    let allProducts = getProducts;
    let productLimit = allProducts.slice(0, limit)
    res.send(productLimit)
})

app.get("/products/:id", (req, res) => {
    let id = parseInt(req.params.id)
    let allProducts = getProducts;
    let productById = allProducts.find(product => product.id === id)
    res.send(productById)
})

const POST = 8080
const server = app.listen(PORT, () => {
    console.log(`Express por local host ${server.address().port}`)
})
server.on("error", (error) => console.log(`Error del servdor ${error}`))