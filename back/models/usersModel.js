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
    if(u === false) {
        user.save()
    }
}

const mauny = new Users({
    lastName: "Carpentier",
    firstName: "Mauny",
    email: "lessentiersdelhistoire@gmail.com",
    password: "mauny",
    isSub: true,
    isAdmin: true
});

const tony = new Users({
    lastName: "Facq",
    firstName: "Tony",
    email: "facqtony4@gmail.com",
    password: "tony",
    isSub: true,
    isAdmin: true
});

if_exist(mauny);
if_exist(tony);

module.exports = { Users };