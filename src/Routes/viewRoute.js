import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";
import { io } from "../servidor.js";
import cartDao from "../daos/dbManager/cart.dao.js";
import Handlebars from "handlebars";

Handlebars.registerHelper('add', (a, b) => {
    return a + b;
});

const router = Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "Bienvenida",
        fileCss: "moduleBienvenida.css",
    })
})

router.get("/listProducts", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, availability } = req.query;

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        const result = await productsDao.getAllProduct({
            limit: limitInt,
            page: pageInt,
            sort,
            query,
            category,
            availability,
        });

        res.render("listProducts", {
            fileCss: "style.css",
            products: result.products,
            total: result.total,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            page: parseInt(pageInt),
            add: Handlebars.helpers.add
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});


router.get("/listProducts/details/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await productsDao.getProductById(id);
        res.render("productDetails", {
            title: "Detalle del producto",
            fileCss: "detailsProduct.css",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor",
        });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const limitInt = parseInt(limit);
        const pageInt = parseInt(page);

        const result = await productsDao.getAllProduct({
            limit: limitInt,
            page: pageInt,
        });

        res.render("realTimeProducts", {
            title: "Lista de Productos en Tiempo Real",
            fileCss: "style.css",
            products: result.products,
            total: result.total,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

router.post("/realtimeproducts", async (req, res) => {
    const { title, description, price, category, thumbnail, stock, code } = req.body;

    const newProduct = {
        title,
        description,
        price,
        category,
        thumbnail,
        stock,
        code,
    };

    try {

        await productsDao.createProduct(newProduct);

        io.emit("realTimeProducts_list", await productsDao.getAllProduct());

        const realTimeViewProducts = await productsDao.getAllProduct();

        res.status(201).render("realTimeProducts", {
            title: "Lista de Productos en Tiempo Real",
            fileCss: "style.css",
            realTimeViewProducts,
        });
    } catch (e) {
        res.status(500).json({
            message: "Hubo un error al crear el nuevo producto",
            error: e.message,
        });
    }
});

router.post("/deleteProduct/:id", (req, res) => {
    const { id } = req.params;

    try {
        productsDao.deleteProduct(id);
        productsDao.broadcastProducts();
        res.status(200).json({
            message: "Producto eliminado",
        });
    } catch (e) {
        res.status(500).json({
            message: "Hubo un error al eliminar el producto",
            error: e.message,
        });
    }
});

router.get("/chat", (req, res) => {
    res.render("chatAplication", {
        fileCss: "chatStyle.css"
    });
});

router.get("/carts/:cartId", async (req, res) => {
    try {
        const { cartId } = req.params;

        const cartProducts = await cartDao.getAllCart(cartId);

        res.render("cart", {
            title: "Vista del Carrito",
            fileCss: "cartStyle.css",
            cartProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;