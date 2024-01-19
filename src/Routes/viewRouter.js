import { Router } from "express";
import { io } from "../servidor.js";
import productsDao from "../daos/dbManager/products.dao.js";
import cartDao from "../daos/dbManager/cart.dao.js";
import Handlebars from "handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";


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
            error: "Error",
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

// cookie sin firma
/* router.use(cookieParser()); */

//cookie con firma
router.use(cookieParser('palabraClave'));

router.get("/setCookie", async (req, res) => {
    try {
        // sin firma
        /*  res.cookie('myCookie' ,'Esta es un cookie sin firma', {
           //tiempo de vida
           maxAge: 30000
         }).send('cookie asignada con exito')
     
       } catch (error) {
        console.log("ocurrio un error en la pagina de cookies", error);
       } */

        //con firma
        res.cookie('myCookie', 'Esta es un cookie sin firma', {
            //tiempo de vida
            maxAge: 30000,
            signed: true
        }).send('cookie asignada con exito')

    } catch (error) {
        console.log("ocurrio un error en la pagina de cookies", error);
    }
})


router.get("/getCookie", async (req, res) => {
    try {
        //sin firma
        /* res.send(req.cookies); */

        //con firma
        res.send(req.signedCookies)

    } catch (error) {
        console.log("ocurrio un error en la pagina de cookies", error);
    }
})


router.get("/deleteCookie", async (req, res) => {
    try {
        //sin firma
        res.clearCookie('MyCookie').send('cookie boorada con exito')

    } catch (error) {
        console.log("ocurrio un error en la pagina de cookies", error);
    }
})

// CONFIGUERACION DE SESSION
router.use(session(
    {
        secret: "codigoSecreto190",
        resave: true,
        saveUninitialized: true
    }
))

router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Bienvenido devuelta a este sitio ${req.session.counter}`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido!!');
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send('Logout ok!')
        } else {
            res.send({ error: 'Error logout', msg: 'Error al cerrar la session' })
        }
    })
})

router.get('/login', (req, res) => {

    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(401).send('Usuario y contraseña son obligatorios.');
    }

    if (password.length < 8) {
        return res.status(401).send('La contraseña debe tener al menos 8 caracteres.');
    }

    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
        return res.status(401).send('La contraseña debe contener al menos una letra mayúscula y un número.');
    }

    if (username !== 'pepito123' || password !== 'Namepass4323') {
        res.status(401).send('Login failed, check your username and password')
    } else {
        req.session.user = username;
        req.session.admin = true;
        res.send('Login Successsful!!')
    }

    res.status(200).send('Inicio de sesión exitoso.');
})

function auth(req, res, next) {
    if (req.session.user === 'pepito123' && req.session.admin) {
        return next()
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso")
    }
}

router.get('/private', auth, (req, res) => {
    res.send('Si estas viendo esto es porque eres admin')
})

export default router;