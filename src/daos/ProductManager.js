import fs from 'fs';

export class ProductManager {

	constructor(path) {
		this.path = path;
		if (fs.existsSync(path)) {
			try {
				const productos = fs.readFileSync(path, "utf-8");
				this.products = JSON.parse(productos)
			} catch (error) {
				this.products = []
			}
		} else {
			this.products = []
		}
	}

	async saveFile() {
		try {
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(this.products, null, "\t")
			);
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	mostrarProductos() {
		return this.products;
	}

	async addProduct(product) {
		let maxId = 0;
		for (const prod of this.products) {
			if (prod.id > maxId) {
				maxId = prod.id;
			}
		}
		product.id = maxId + 1;

		const productos = this.products.find((prod) => prod.code === product.code);

		if (productos) {
			return console.log("[ERROR] Team code already exist");
		}

		this.products.push(product);

		const respuesta = await this.saveFile();

		if (respuesta) {
			console.log("Producto creado");
		} else {
			console.log("Hubo un error al crear el producto");
		}

	}

	async updateProduct(id, productData) {
		const productIndex = this.products.findIndex((product) => product.id === id);

		if (productIndex === -1) {
			console.log("El producto no existe");
			return;
		}

		this.products[productIndex] = { ...this.products[productIndex], ...productData };

		const success = await this.saveFile();

		if (success) {
			console.log("El producto se ha actualizado con éxito");
		} else {
			console.log("Hubo un error al actualizar el producto");
		}
	};


	async deleteProduct(id) {

		const productIndex = this.products.findIndex((prod) => prod.id === id);

		if (productIndex === -1) {
			console.log("El producto no existe");
			return;
		}

		this.products.splice(productIndex, 1);

		const success = await this.saveFile();

		if (success) {
			console.log("Producto eliminado con éxito");
		} else {
			console.log("Hubo un error al eliminar el producto");
		}
	}

	broadcastProducts() {
		socketServer.emit("realTimeProducts_list", this.mostrarProductos());
	}
}

export class Productos {
	constructor(title, description, price, category, thumbnail, stock, code) {
		this.title = title,
			this.description = description,
			this.price = price,
			this.category = category,
			this.status = true,
			this.thumbnail = thumbnail,
			this.stock = stock,
			this.code = code
	}
}

export default { ProductManager, Productos }