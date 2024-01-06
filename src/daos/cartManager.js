import fs from 'fs';

export class CartManager {
    constructor(path) {
        this.path = path;
        if (fs.existsSync(path)) {
            try {
                const data = fs.readFileSync(path, 'utf-8');
                this.carts = JSON.parse(data).carts;
            } catch (error) {
                this.carts = [];
            }
        } else {
            this.carts = [];
        }
    }

    async saveFile() {
        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify({ carts: this.carts }, null, '\t')
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    mostrarCarrito() {
        return this.carts;
    }

    createNewCart() {
        const newCart = {
            id: this.generateUniqueId(),
            products: []
        };

        this.carts.push(newCart);
        return this.saveFile();
    }

    async addProductToCart(cartId, productId, quantity = 1) {

        const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);

        if (cartIndex !== -1) {
            const cart = this.carts[cartIndex];

            const existingProductIndex = cart.products.findIndex((product) => product.product === productId);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: quantity
                });
            }

            const saveCart = await this.saveFile();

            if (saveCart) {
                return true;
            } else {
                console.log('Error al guardar el carrito en el archivo.');
                return false;
            }

        } else {
            console.log('Carrito no encontrado.');
            return false;
        }
    }

    generateUniqueId() {
        return Math.floor(Math.random() * 9999999);
    }
}

export default CartManager;