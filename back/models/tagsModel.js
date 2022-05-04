const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagsSchema = Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    magazines: {
        type: Array(
            {
                type: Schema.Types.ObjectId,
                ref: 'magazines'
            }
        ),
        require: true,
        default: []
    },
    articles: {
        type: Array(
            {
                type: Schema.Types.ObjectId,
                ref: 'articles'
            }
        ),
        require: true,
        default: []
    }
}
);

const Tags = mongoose.model('tags', tagsSchema);

module.exports = { Tags };