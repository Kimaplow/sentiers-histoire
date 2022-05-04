const mongoose = require('mongoose');
const { Schema } = mongoose;

const magazinesSchema = Schema({
    title: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    summary: {
        type: String,
        require: true
    },
    isbn: {
        type: String,
        require: true
    },
    tags: {
        type: Array(
            {
                type: Schema.Types.ObjectId,
                ref: 'tags'
            }
        ),
        require: true
    },
    cover: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    id_paypal: {
        type: String,
        require: true
    }
});

const Magazines = mongoose.model('magazines', magazinesSchema);

module.exports = { Magazines };