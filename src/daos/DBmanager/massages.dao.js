import { chatModel } from '../../Models/messages.model.js';

class MessagesDao {
    async getAllMessages() {
        try {
            const messages = await chatModel.find().sort({ timestamp: 1 });
            return messages;
        } catch (error) {
            throw new Error(`Error al obtener todos los mensajes: ${error.message}`);
        }
    }

    async addMessage(user, message) {
        try {
            const newMessage = new chatModel({ user, message });
            await newMessage.save();
            return newMessage;
        } catch (error) {
            throw new Error(`Error al agregar un nuevo mensaje: ${error.message}`);
        }
    }
}

export default new MessagesDao();