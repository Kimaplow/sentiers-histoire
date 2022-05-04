const mongoose = require('mongoose');
const { Schema } = mongoose;

const subsSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    startDate: {
        type: Date,
        default: Date.now,
        require: true
    },
    endDate: {
        type: Date,
        default: new Date().setFullYear(new Date().getFullYear() + 1),
        require: true
    }
}
);

const Subs = mongoose.model('subs', subsSchema);

module.exports = { Subs };