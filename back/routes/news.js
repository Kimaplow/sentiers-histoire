const express = require('express')
const router = express.Router();

const { News } = require('../models/newsModel');
const { requireAuth } = require('../tools/auth');

router.get('/page/:page', (req, res) => {
    const page = req.params.page;
    News.find().
        limit(4).
        skip(4 * (page - 1)).
        sort({ date: 'desc' }).
        exec(function (err, news) {
            if (err) return res.status(400).json({
                error: "Erreur lors de l'obtention des actualités"
            });
            res.send(news)
        });
});

router.get('/items', async (req, res) => {
    const nbr = await News.estimatedDocumentCount();
    res.json(nbr);
});

router.get('/:id', (req, res) => {
    News.findOne({ _id: req.params.id }).
        exec(function (err, magazine) {
            if (err) return res.status(200).json({
                error: "Erreur lors de l'obtention du magazine"
            });
            res.send(magazine)
        });
})

router.post('/', (req, res) => {
    const newRecord = new News({
        title: req.body.title,
        content: req.body.content
    })

    newRecord.save((err) => {
        if (err) res.status(200).json({
            error: "Erreur lors de la création de l'actualité"
        });
        res.status(201).json({
            success: "Actualité créé !"
        });
    })
})

router.patch('/:id', (req, res) => {
    const updateRecord = req.body;

    News.findByIdAndUpdate(
        req.params.id,
        { $set: updateRecord },
        { new: true },
        (err) => {
            if (err) return res.status(200).json({
                error: "Erreur lors de la modification de l'actualité"
            });
            res.status(200).json({
                success: "Actualité modifiée !"
            });
        }
    )
});

router.delete('/:id', (req, res) => {
    News.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.status(200).json({
                success: "Actualité supprimée !"
            });
        }
        else {
            res.status(200).json({
                error: "Erreur lors de la suppression"
            });
        }
    });
});

module.exports = router;