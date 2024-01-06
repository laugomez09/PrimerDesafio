const socket = io();

const chatbox = document.querySelector("#chatbox");
const messagesContainer = document.querySelector("#messages");
let user;

Swal.fire({
    title: "Bienvenido",
    text: "Ingrese su nombre para continuar",
    input: "text",
    inputValidator: (value) => {
        return !value && "Necesitás identificarte";
    },
    allowOutsideClick: false,
}).then((value) => {
    user = value.value;
    socket.emit("inicio", user);
});

chatbox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const message = e.target.value;
        socket.emit("message", { user, message });
        chatbox.value = "";
    }
});

socket.on("connected", (data) => {
    if (user !== undefined) {
        Swal.fire({
            text: `Nuevo usuario conectado: ${data}`,
            toast: true,
            position: "top-right",
        });
    }
});

socket.on("messages", (data) => {
    const messages = data.map((message) => `<strong>${message.user}</strong>: ${message.message}<br>`).join("");
    messagesContainer.innerHTML = messages;
});