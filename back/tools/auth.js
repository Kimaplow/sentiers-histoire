const jwt = require("jsonwebtoken");
const { Users } = require("../models/usersModel");
//const { Subs } = require("../models/subsModel");
const jwtSecret = process.env.JWT_SECRET;

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie("jwt", "", { maxAge: 1 });
                next();
            } else {
                let user = await Users.findById(decodedToken.id).select('-password');
                /*
                if (user && user.isSub) {
                    let abo = await Subs.findOne({user: user._id});
                    if(new Date(abo.endDate) < Date.now()){
                        user.isSub = false;
                        Users.findByIdAndUpdate(
                            user._id,
                            { $set: {isSub: false} },
                            { new: true },
                            (err) => {
                                if (err) res.status(200).json({
                                    error: "Erreur lors de la récupération du profil"
                                });
                            }
                        )
                    }
                }
                */
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtSecret, async (err, decodedToken) => {
            if (err) {
                res.sendStatus(200).json({
                    error: "no token"
                })
            } else {
                const user = await Users.findById(decodedToken.id).select('-password');
                /*
                if (user && user.isSub) {
                    let abo = await Subs.findOne({user: user._id});
                    if(new Date(abo.endDate) < Date.now()){
                        user.isSub = false;
                        Users.findByIdAndUpdate(
                            user._id,
                            { $set: {isSub: false} },
                            { new: true },
                            (err) => {
                                if (err) res.status(200).json({
                                    error: "Erreur lors de la récupération du profil"
                                });
                            }
                        )
                    }
                }
                */
                res.locals.user = user;
                next();
            }
        });
    } else {
        return;
    }

};