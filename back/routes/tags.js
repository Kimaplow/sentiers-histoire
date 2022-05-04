const express = require('express')
const router = express.Router();
const ObjectID = require('mongoose').Types.ObjectId;

const { Tags } = require('../models/tagsModel');

router.get('/', (req, res) => {
    Tags.find().
        populate('magazines').
        populate('articles').
        exec(function (err, tags) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention des tags"
            });
            res.send(tags)
        });
})

router.get('/:name', (req, res) => {
    Tags.
        findOne({ name: req.params.name }).
        populate('magazines').
        populate('articles').
        exec(function (err, tag) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention du tag"
            });
            res.send(tag)
        });
})

router.get('/:name/magazines/page/:page', (req, res) => {
    const page = req.params.page;
    Tags.
        findOne({ name: req.params.name }).
        populate({
            path: 'magazines',
            options: {
                limit: 12,
                skip: 12 * (page - 1)
            },
            populate: { path: 'tags' }
        }).
        exec(function (err, tag) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention du tag"
            });
            res.send(tag.magazines)
        });
})

router.get('/:name/magazines/items', (req, res) => {
    Tags.
        findOne({ name: req.params.name }).
        populate('magazines').
        exec(function (err, tag) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention du tag"
            });
            const nbr = tag.magazines.length;
            res.status(200).json({
                items: nbr
            });
        });
})

router.get('/:name/articles/page/:page', (req, res) => {
    const page = req.params.page;
    Tags.
        findOne({ name: req.params.name }).
        populate({
            path: 'articles',
            options: {
                limit: 12,
                skip: 12 * (page - 1)
            },
            populate: { path: 'tags' }
        }).
        exec(function (err, tag) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention du tag"
            });
            res.send(tag.articles)
        });
})

router.get('/:name/articles/items', (req, res) => {
    Tags.
        findOne({ name: req.params.name }).
        populate('articles').
        exec(function (err, tag) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention du tag"
            });
            const nbr = tag.articles.length;
            res.status(200).json({
                items: nbr
            });
        });
})

module.exports = router;