const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB,
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if(!err) {
            console.log("MongoDB connected !");
        }
        else {
            console.log("Connection error : " + err);
        }
    }
)