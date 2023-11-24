const fs = require("node:fs");

class ProductManager {

	static id = 0;

	constructor(fileName) {
		this.path = fileName;
		if (fs.existsSync(this.path)) {
			try {
				const fileText = fs.readFileSync(this.path, "utf-8");
				this.products = JSON.parse(fileText);
			} catch (error) {
				console.log(`Error al parsear el archivo: ${error}`);
				this.products = [];
			}
		} else {
			this.products = [];
			this.saveFile();
		}
	}


	async addProduct(name, description, price, imageUrl, code, stock) {
		const newProduct = {
			id: ++ProductManager.id,
			name,
			description,
			price,
			imageUrl,
			code,
			stock,
		};
		this.products.push(newProduct);
		await this.saveFile();
	}

	/*async addProduct(product) {
	if (!this.isValidProduct(product)) {
		console.log("Error: Todos los campos del producto son obligatorios.");
	} else {
		if (this.products.some((p) => p.code === product.code)) {
			console.log(`Error: El producto con el código ${product.code} ya existe.`);
		} else {
			ProductManager.id++;
			product.id = ProductManager.id;
			this.products.push(product);
			await this.saveFile();
		}
	}
}*/

	getProducts() {
		return [...this.products];
	}

	getProductById(id) {
		const product = this.products.find((producto) => producto.id === id);
		if (product) {
			return product;
		} else {
			console.log("Not Found!");
		}
	}


	async saveFile() {
		try {
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(this.products, null, "\t"),
				"utf-8"
			);
		} catch (error) {
			console.log(`ERROR ${error}`);
		}
	}

	async deleteProduct(id) {
		const productElimined = this.products.find((p) => p.id == id);
		if (productElimined) {
			const newProductsArray = this.products.filter((p) => p.id != id);
			this.products = newProductsArray;
			await this.saveFile();
		} else {
			console.log("¡ERROR!");
		}
	}

	updateProduct(id, updatedFields) {
		const productToUpdate = this.products.find((p) => p.id === id);
		if (productToUpdate) {
			Object.assign(productToUpdate, updatedFields);
			this.saveFile();
		} else {
			console.log("Error: Producto no encontrado.");
		}
	}
}


console.log(productos.getProducts())

productos.deleteProduct(1)

console.log(productos.getProducts())

export default ProductManager;