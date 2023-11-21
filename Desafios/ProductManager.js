const fs = require("node:fs");

class ProductManager {

	static id = 0;

	constructor(fileName) {
		this.path = fileName;
		if (fs.existsSync(this.path)) {
			try {
				const fileText = fs.readFileSync(this.path, "utf-8");
				this.products = JSON.parse(fileText);
			} catch {
				this.products = [];
			}
		} else {
			this.products = [];
		}
	}


	async addProduct(product) {
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
	}

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
			// Actualizar los campos proporcionados
			Object.assign(productToUpdate, updatedFields);
			// Guardar el archivo actualizado
			this.saveFile();
		} else {
			console.log("Error: Producto no encontrado.");
		}
	}
}



/*const productos = new ProductManager;

productos.addProduct("Coca-Cola", "Es una gaseosa azucarada y vendida a nivel mundial", 950, "https://coca-colafemsa.com/wp-content/uploads/2020/02/1-40.png", 45454, 10)
productos.addProduct("Cotonetes", "es un instrumento utilizado para recoger muestras, para su posterior estudio, normalmente en medicina se usa para saber que germen afecta a una infección, también se usa en cosméticos y aunque también se suele usar en la limpieza de la oreja", 400, "https://tekielar.vtexassets.com/arquivos/ids/168479/6030941.jpg?v=637975102718330000", 23435, 9)
*/

console.log(productos.getProducts())

productos.deleteProduct(1)

console.log(productos.getProducts())

export default ProductManager;