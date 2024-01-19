import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";

const router = Router();

router.get("/", async (req, res) => {
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

        const totalPages = Math.ceil(result.total / limitInt);

        const response = {
            status: "success",
            payload: result.products,
            totalPages,
            prevPage: result.hasPrevPage ? pageInt - 1 : null,
            nextPage: result.hasNextPage ? pageInt + 1 : null,
            page: pageInt,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(req.baseUrl, pageInt - 1, limitInt, sort, query, category, availability) : null,
            nextLink: result.hasNextPage ? buildLink(req.baseUrl, pageInt + 1, limitInt, sort, query, category, availability) : null,
        };

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: "Error interno del servidor",
        });
    }
});

router.get("/:id", async (req, res) => {

    const { id } = req.params;

    try {
        const product = await productsDao.getProductById(id);
        res.json({
            product
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/", async (req, res) => {

    const { title, description, price, thumbnail, category, stock, code } = req.body;

    const newProduct = {
        title,
        description,
        price,
        thumbnail,
        category,
        stock,
        code
    }

    try {
        const createProduct = await productsDao.createProduct(newProduct);
        res.json({
            createProduct
        })
    } catch (error) {
        console.log(error);
        res.json({ info: "Error creating product", error });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    try {
        const result = await productsDao.updateProduct(id, product);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error.' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        console.log('eliminando el producto...');
        const result = await productsDao.deleteProduct(id);

        if (result) {
            console.log('¡Producto eliminado exitosamente!');
            res.json({ message: '¡Producto eliminado exitosamente!' });
        } else {
            console.log('No se encontró el producto.');
            res.status(404).json({ error: 'No se encontró el producto.' });
        }
    } catch (error) {
        console.error('Error en la ruta de eliminación:', error);
        res.status(500).json({ error: 'Hubo un error al eliminar el producto.' });
    }
});

function buildLink(baseUrl, page, limit, sort, query, category, availability) {
    const queryParams = new URLSearchParams({
        page,
        limit,
        sort,
        query,
        category,
        availability,
    });
    return `${baseUrl}?${queryParams.toString()}`;
}

export default router;