const mongoose = require('mongoose');
const { Schema } = mongoose;

const articlesSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    pdf: {
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
    }
}
);

const Articles = mongoose.model('articles', articlesSchema);

module.exports = { Articles };