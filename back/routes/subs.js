const express = require('express')
const router = express.Router();

const { Subs } = require('../models/subsModel');
const { Users } = require('../models/usersModel');
const {requireAuth} = require('../tools/auth');

router.get('/', requireAuth, (req, res) => {
    const user = res.locals.user;
    Subs.findOne({user: user._id}).
        select('-user').
        exec(function (err, sub) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention de l'abonnement"
            });
            res.send(sub)
        });
})

router.post('/', requireAuth, (req, res) => {
    const user = res.locals.user;

    const newSub = new Subs({
        user: user._id
    })

    Users.findByIdAndUpdate(
        user._id,
        { $set: {isSub: true} },
        { new: true },
        (err) => {
            if (err) return res.status(200).json({
                error: "Erreur lors de la création de l'abonnement"
            });
        }
    )
    
    newSub.save((err) => {
        if (err) res.status(200).json({
            error: "Erreur lors de la création de l'abonnement"
        });
        res.status(201).json({
            success: "Vous êtes abonné(e) !"
        });
    })
    
});

module.exports = router;