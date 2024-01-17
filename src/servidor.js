import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './dirname.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import productsRoute from './Routes/productsRoute.js';
import cartRoute from './Routes/cartRoute.js';
import viewRouter from './Routes/viewRouter.js'
import MessagesDao from './daos/dbManager/messages.dao.js'

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));

mongoose.connect('mongodb://127.0.0.1:27017/ecommers')
    .then(() => {
        console.log("Connected DB");
    })
    .catch((error) => {
        console.log(error);
    });

const io = new Server(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "main",
        handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

app.use(express.static(`${__dirname}/public`));

app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use("/api", viewRouter);


io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async (data) => {
        try {
            const newMessage = await MessagesDao.addMessage(data.user, data.message);
            io.emit("messages", await MessagesDao.getAllMessages());
        } catch (error) {
            console.error(`Hubo un error al procesar el mensaje del formulario en tiempo real: ${error.message}`);
        }
    });

    socket.on("inicio", async (data) => {
        io.emit("messages", await MessagesDao.getAllMessages());
        socket.broadcast.emit("connected", data);
    });

});

export { io }

