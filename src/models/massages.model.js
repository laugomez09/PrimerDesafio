import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    user: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const chatModel = model('chatModel', chatSchema);

export { chatModel };