import { Schema, model } from 'mongoose';
import { productModel } from './products.model.js';

const cartSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    products: [{
        _id: { type: Schema.Types.ObjectId, auto: false },
        product: { type: Schema.Types.ObjectId, ref: productModel },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
    }],
});


const cartModel = model("Cart", cartSchema);

export { cartModel };