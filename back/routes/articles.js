const express = require('express')
const router = express.Router();
const { unlink } = require('fs');

const { Articles } = require('../models/articlesModel');
const { Tags } = require('../models/tagsModel');
const { requireAuth } = require('../tools/auth');

const upload = require('../tools/upload');

const deleteFile = (path) => {
    unlink('./public/' + path, (err) => {
        if (err) {
            res.status(200).json({
                error: "Erreur lors de la suppression du fichier"
            });
        }
    });
}

router.get('/page/:page', (req, res) => {
    const page = req.params.page;
    Articles.find().
        populate('tags', '-magazines -articles').
        limit(12).
        skip(12 * (page - 1)).
        sort({ date: 'desc' }).
        exec(function (err, articles) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention des articles"
            });
            res.send(articles)
        });
})

router.get('/items', async (req, res) => {
    const nbr = await Articles.estimatedDocumentCount();
    res.json(nbr);
});

router.get('/page/:page/word/:word', (req, res) => {
    const page = req.params.page;
    const word = req.params.word;
    Articles.find({ title: { $regex: word, $options: 'i' } }).
        populate('tags', '-magazines -articles').
        limit(12).
        skip(12 * (page - 1)).
        sort({ date: 'desc' }).
        exec(function (err, articles) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention des articles"
            });
            res.send(articles)
        });
});

router.get('/items/word/:word', async (req, res) => {
    const word = req.params.word;
    const art = await Articles.find({ title: { $regex: word, $options: 'i' } })
    console.log(art);
    res.json(art.length);
});

router.get('/:id', (req, res) => {
    Articles.findOne({ _id: req.params.id }).
        populate('tags', '-magazines -articles').
        exec(function (err, article) {
            if (err) return res.status(200).json({
                error: "Erreur lors de l'obtention de l'article"
            });
            res.send(article)
        });
})

router.post('/', upload.single('pdf'), async (req, res) => {

    let arrayTag = [];
    const tags = req.body.tags;

    const newArticle = new Articles({
        title: req.body.title,
        pdf: req.body.path_file
    });

    await Promise.all(tags.map(async (tag) => {
        let tagExist = await Tags.findOne({ name: tag.toLowerCase() });
        if (tagExist) {
            arrayTag.push(tagExist._id)
            tagExist.articles = [...tagExist.articles, newArticle._id]
            tagExist.save((err) => {
                if (err) return res.status(200).json({
                    error: "Erreur lors de la création de l'article"
                });
            })
        }
        else {
            const newTag = new Tags({
                name: tag.toLowerCase(),
                articles: [newArticle._id]
            })
            arrayTag.push(newTag._id)
            newTag.save((err) => {
                if (err) return res.status(200).json({
                    error: "Erreur lors de la création de l'article"
                });
            })
        }
    }))

    arrayTag.forEach(tag => {
        newArticle.tags = [...newArticle.tags, tag]
    });

    newArticle.save((err) => {
        if (err) return res.status(200).json({
            error: "Erreur lors de la création de l'article"
        });
        res.status(201).json({
            success: "Article créé !"
        });
    });
})

router.patch('/:id', upload.single('pdf'), async (req, res) => {

    const updateArticle = req.body;
    let tagsDelete = updateArticle.tagsDelete;
    let tagsAdd = updateArticle.tags;

    const article = await Articles.findById(req.params.id).populate('tags');
    let tags = article.tags;

    if (req.body.path_file || tagsDelete || tagsAdd) {

        if (req.body.path_file) {
            updateArticle.pdf = req.body.path_file;
            unlink('./public/' + article.pdf, (err) => {
                if (err) {
                    throw err;
                }
            });

        }

        if (tagsDelete) {
            await Promise.all(tagsDelete.map(async (tag) => {
                let tagExist = await Tags.findOne({ name: tag });
                let listeMag = tagExist.articles;
                for (let index = 0; index < listeMag.length; index++) {
                    if (listeMag[index]._id == req.params.id) {
                        tagExist.articles.splice(index, 1);
                    }
                }
                await tagExist.save((err) => {
                    if (err) return res.status(200).json({
                        error: "Erreur lors de la création de l'article"
                    });
                })

                for (let i = 0; i < tags.length; i++) {
                    for (let j = 0; j < tagsDelete.length; j++) {
                        if (tags[i].name == tagsDelete[j]) {
                            tags.splice(i, 1);
                        }
                    }
                }
            }));
        }

        if (tagsAdd) {
            let arrayTag = [];
            await Promise.all((updateArticle.tags).map(async (tag) => {
                let tagExist = await Tags.findOne({ name: tag.toLowerCase() });
                if (tagExist) {
                    arrayTag.push(tagExist._id);
                    tagExist.articles = [...tagExist.articles, req.params.id]
                    await tagExist.save((err) => {
                        if (err) return res.status(200).json({
                            error: "Erreur lors de la création de l'article"
                        });
                    })
                }
                else {
                    const newTag = new Tags({
                        name: tag.toLowerCase(),
                        articles: [req.params.id]
                    })
                    arrayTag.push(newTag._id)
                    await newTag.save((err) => {
                        if (err) return res.status(200).json({
                            error: "Erreur lors de la création de l'article"
                        });
                    })
                }
            }))

            arrayTag.forEach(tag => {
                tags = [...tags, tag]
            });
        }

    }

    let t = [];
    tags.forEach(tag => {
        if (!!tag._id) {
            t.push(tag._id);
        }
        else {
            t.push(tag)
        }
    })

    updateArticle.tags = t;

    Articles.findByIdAndUpdate(
        req.params.id,
        { $set: updateArticle },
        { new: true },
        (err) => {
            if (err) return res.status(400).json({
                error: "Erreur lors de la modification de l'article"
            });
            res.status(200).json({
                success: "Article modifié !"
            });
        }
    )
});

router.delete('/:id', async (req, res) => {

    const article = await Articles.findById(req.params.id).populate('tags');
    const tags = article.tags;

    deleteFile(article.pdf)

    await Promise.all(tags.map(async (tag) => {
        let t = await Tags.findById(tag._id).populate('articles');
        for (let index = 0; index < t.articles.length; index++) {
            t.articles.splice(index, 1);
        }
        await t.save((err) => {
            if (err) return res.status(200).json({
                error: "Erreur lors de la suppression de l'article"
            });
        })
    }));

    Articles.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.status(200).json({
                success: "Actualité supprimée !"
            });
        }
        else {
            res.status(200).json({
                error: "Erreur lors de la suppression de l'article"
            });
        }
    });
});

module.exports = router;