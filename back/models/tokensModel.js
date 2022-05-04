const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokensSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
    },
});

const Tokens = mongoose.model("token", tokensSchema);

module.exports = { Tokens };