const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const usersSchema = Schema({
    lastName: {
        type: String,
        require: true,
        maxlength: 50
    },
    firstName: {
        type: String,
        require: true,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        require: true,
        validate: [isEmail],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    isSub: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

usersSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Users = mongoose.model('users', usersSchema);

const if_exist = async(user) => {
    const u = await Users.exists({email : user.email});
    if(u === null) {
        user.save()
    }
}

const admin = new Users({
    lastName: "admin",
    firstName: "admin",
    email: "admin@admin.fr",
    password: "admin",
    isSub: true,
    isAdmin: true
});

const abo = new Users({
    lastName: "abo",
    firstName: "abo",
    email: "abo@abo.fr",
    password: "abo",
    isSub: true
});

const test = new Users({
    lastName: "test",
    firstName: "test",
    email: "test@test.fr",
    password: "test"
});

if_exist(admin);
if_exist(abo);
if_exist(test);

module.exports = { Users };