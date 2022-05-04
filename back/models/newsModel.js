const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    content: {
        type: String,
        require: true
    }
});

const News = mongoose.model('news', newsSchema);

module.exports = { News };