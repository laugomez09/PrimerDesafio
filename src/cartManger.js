import { promise as fs } from "fs";
import { v4 as uuidv4 } from `uuid`

class cartManager {
    constructor() {
        this.path = cart.json;
        this.carts = [];
    }

    getCarts = async () => {
        const response = await fs.readFile(this.path, "utf8")
        const responseJSON = JSON.parse(response)
        return responseJSON
    }

    getCartProducts = async (id) => {
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id === id)
        if (cart) {
            return cart.products
        } else {
            console.log("No se ha encontrado el carrito")
        }
    }

    newCart = async () => {
        const id = uuidv4()

        const newCart = { id, products: [] }
        this.carts.push(newCart)

        await fs.writeFile(this.path, JSON.stringify(this.carts))
        return newCart
    }

    addProductToCart = async (cart_id, product_id) => {
        const carts = await this.getCarts()
        const index = carts.findIndex(cart => cart.id === cart_id)

        if (index !== -1) {
            const cartProducts = await this.getCartProducts(cart_id)
            const existingProductIndex = cartProducts.findIndex(product => product.product_id === product_id)

            if (existingProductIndex === -1) {
                cartProducts[existingProductIndex].quantify = cartProducts[existingProductIndex].quantify + 1
            } else {
                cartProducts.push({ product_id, quantify: 1 })
            }

            carts[index].products = cartProducts

            await fs.writeFile(this.path, JSON.stringify(cats))
            console.log("Se ha agregado el producto")
        } else {
            console.log("Error: carrito no encontrado")
        }
    }
}

export default cartManager;