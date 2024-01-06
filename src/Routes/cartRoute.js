import { Router } from 'express';
import cartDao from '../daos/dbManager/cart.dao.js';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartDao.getAllCart();
        res.json(carts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/:cartId", async (req, res) => {

    const { cartId } = req.params;
    try {
        const cart = await cartDao.getCartById(cartId);
        res.json(cart);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/:cartId/products/:productId/:quantity', async (req, res) => {
    const { cartId, productId, quantity } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    const parsedQuantity = parseInt(quantity, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        const updatedCart = await cartDao.addProductToCart(cartId, productId, parsedQuantity);
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:cartId/products/:productId/:quantity', async (req, res) => {
    const { cartId, productId, quantity } = req.params;

    try {
        const updatedCart = await cartDao.updateProductQuantity(cartId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        const updatedCart = await cartDao.deleteProductFromCart(cartId, productId);

        if (!updatedCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        if (!updatedCart.products || updatedCart.products.length === 0) {

            const clearCart = await cartDao.clearCart(cartId);
            res.json(clearCart);

            return res.json({ message: 'Product deleted successfully, cart is now empty' });
        }

        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router