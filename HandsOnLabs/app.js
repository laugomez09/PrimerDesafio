class ProductManager {

	constructor() {
		this.products=[];
	}

    static id = 0;

	addProduct(title, description, price, thumbnail, code, stock) {
		ProductManager.id++
		this.products.push({ title, description, price, thumbnail, code, stock, id:ProductManager.id });
	}

	getProduct(){
		return this.products;
	}

	getProductById(id){
		if(!this.products.find((producto) => producto.id === id)){
			console.log("Not found!")
		}
	}

}

const productos =  new ProductManager;

productos.addProduct("Coca-Cola", "Es una gaseosa azucarada y vendida a nivel mundial", 950, "https://coca-colafemsa.com/wp-content/uploads/2020/02/1-40.png", 45454, 10)
productos.addProduct("Cotonetes", "es un instrumento utilizado para recoger muestras, para su posterior estudio, normalmente en medicina se usa para saber que germen afecta a una infección, también se usa en cosméticos y aunque también se suele usar en la limpieza de la oreja", 400, "https://tekielar.vtexassets.com/arquivos/ids/168479/6030941.jpg?v=637975102718330000", 23435, 9)

console.log(productos.getProduct())
