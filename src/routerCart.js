import { Router } from "express";
import cartManager from "./cartManger";

const routerCart = Router()

routerCart.post("/", async (req, res) => {
    try {
        const response = await cartManager.NewCart()
        res.json(response)
    } catch (error) {
        res.send("Error al ingresar al carrito")
    }
})

routerCart.get("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const response = await cartManager.getCartProducts(cid)
        res.json(response)
    } catch (error) {
        res.send("Error al intentar enviar los productos del carrito.")
    }
})

routerCart.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        await cartManager.addProductToCart(cid, pid)
        res.send("Se logro agregar el producto")
    } catch (error) {
        res.send("Error:No se logro agregar el producto en el carrito")
    }
})

export { routerCart }