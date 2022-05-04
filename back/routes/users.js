const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { sendEmailContact } = require("../tools/sendEmail");
const { sendEmailPassword } = require("../tools/sendEmail");

const jwtSecret = process.env.JWT_SECRET;
const jwtExp = 1000 * 60 * 60 * 24 * 21; //21 jours

const { requireAuth } = require('../tools/auth');
const { Users } = require('../models/usersModel');
const { Tokens } = require('../models/tokensModel');

router.get('/logout', async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
})

router.get('/reset-password/:id/:token', async (req, res) => {
    Tokens.findOne({ user: req.params.id, token: req.params.token }).
        exec(function (err, token) {
            if (err) return res.status(200).json({
                error: "Erreur lors du traitement"
            });
            res.send(token)
        });
})

router.post('/reset/:id/:token', async (req, res) => {
    const user = await Users.findById(req.params.id);

    if(user){
        const token = await Tokens.findOne({
            user: user._id,
            token: req.params.token,
        });

        if(token){
            user.password = req.body.password;
            await user.save();
            await token.delete();

            res.status(200).json({
                success: "Mot de passe modifié !"
            });

        }
        else{
            res.status(200).json({
                error: "Erreur lors du traitement"
            });
        }
    }
    else{
        res.status(200).json({
            error: "Erreur lors du traitement"
        });
    }
    
})

router.get('/:id', (req, res) => {
    Users.findOne({ _id: req.params.id }).
        select('-password').
        exec(function (err, user) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention des utilisateurs"
            });
            res.send(user)
        });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        const compare = await bcrypt.compare(password, user.password);
        if (user && compare) {
            const token = jwt.sign(
                { id: user._id },
                jwtSecret,
                { expiresIn: jwtExp }
            );
            res.cookie('jwt', token, { httpOnly: true, maxAge: jwtExp });
            res.status(200).json({
                success: "Connexion réussie !",
                user: user._id
            })
        }
        else {
            res.status(200).send({
                error: "email ou mdp invalide"
            });
        }
    }
    catch (err) {
        res.status(200).send({
            error: "email ou mdp invalide"
        });
    }
})

router.post('/mail', async (req, res) => {

    try {
        console.log(req.body);
        await sendEmailContact(req.body);

        res.status(200).send({
            success: "Message envoyé !"
        });
    }
    catch (err) {
        res.status(200).send({
            error: "Erreur lors de l'envoi du message"
        });
    }
})

router.post('/reset-password', async (req, res) => {

    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user)
            res.status(200).send({
                error: "Cette adresse mail n'est pas dans notre base de données"
            });

        let token = await Tokens.findOne({ user: user._id });
        if (!token) {
            token = await new Tokens({
                user: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const site = process.env.BASE_URL_FRONT;
        const link = site + "/reset-password/" + user._id + "/" + token.token;
        console.log(link);
        await sendEmailPassword(user.email, link);

        res.status(200).send({
            success: "Un mail a été envoyé à votre adresse mail"
        });
    } catch (error) {
        null;
    }
})

router.post('/', async (req, res) => {

    const { lastName, firstName, email, password } = req.body;

    try {
        const user = await Users.create({ lastName, firstName, email, password });
        res.status(201).json({
            success: "Compte créé",
            user: user._id
        });
    }
    catch (err) {
        res.status(200).json({
            error: "Erreur lors de la création du compte"
        });
    }

})

router.patch('/:id', requireAuth, async (req, res) => {
    const updateUser = req.body;

    if (updateUser.password) {
        const salt = await bcrypt.genSalt();
        updateUser.password = await bcrypt.hash(updateUser.password, salt);
    }

    Users.findByIdAndUpdate(
        req.params.id,
        { $set: updateUser },
        { new: true },
        (err) => {
            if (err) return res.status(400).json({
                error: "Erreur lors de la modification du profil"
            });
            res.status(200).json({
                success: "Profil modifié !"
            });
        }
    )
});

router.delete('/:id', async (req, res) => {

    Users.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.status(200).json({
                success: "Compte supprimé !"
            });
        }
        else {
            res.status(200).json({
                error: "Erreur lors de la suppression du compte"
            });
        }
    });
});

module.exports = router;