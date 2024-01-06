import { productModel } from '../../Models/products.model.js';
import { io } from '../../servidor.js';

class ProductsDao {
    async getAllProduct({ limit = 10, page = 1, sort, query, category, availability }) {
        const options = {
            limit,
            skip: (page - 1) * limit,
        };

        if (sort) {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        const queryFilter = {
            ...(query ? { title: query } : {}),
            ...(category ? { category } : {}),
            stock: { $gt: 0 },
        };

        if (availability === "disponible") {

            queryFilter.stock = { $gt: 0 };
        }

        const products = await productModel.find(queryFilter, null, options);

        const count = await productModel.countDocuments(queryFilter);
        const hasPrevPage = page > 1;
        const hasNextPage = page * limit < count;

        return {
            products,
            total: count,
            hasPrevPage,
            hasNextPage,
        };
    }


    async getProductById(id) {
        return await productModel.findById(id)
    }

    async createProduct(product) {
        return await productModel.create(product)
    }

    async updateProduct(id, product) {
        return await productModel.findByIdAndUpdate(id, product)
    }

    async deleteProduct(id) {
        try {
            console.log('Intentando encontrar el producto...');
            const existingProduct = await productModel.findById(id);

            if (!existingProduct) {
                console.log('Producto no encontrado.');
                return null; // Producto no encontrado
            }

            console.log('Producto encontrado, intentando eliminar...');
            const result = await productModel.findByIdAndDelete(id);

            console.log('Producto eliminado exitosamente.');
            return result;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async broadcastProducts() {
        try {
            const products = await this.getAllProduct();
            io.emit("realTimeProducts_list", products);
        } catch (e) {
            console.error("Hubo un error al emitir la lista de productos en tiempo real:", e.message);
        }
    }
}

export default new ProductsDao()