const express = require('express')
const router = express.Router();
const { unlink } = require('fs');

const { Magazines } = require('../models/magazinesModel');
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
    Magazines.find().
        populate('tags', '-magazines -articles').
        limit(12).
        skip(12 * (page - 1)).
        sort({ date: 'desc' }).
        exec(function (err, magazines) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention des magazines"
            });
            res.send(magazines)
        });
});

router.get('/page/:page/word/:word', (req, res) => {
    const page = req.params.page;
    const word = req.params.word;
    Magazines.find({ title: { $regex: word, $options: 'i' } }).
        populate('tags', '-magazines -articles').
        limit(12).
        skip(12 * (page - 1)).
        sort({ date: 'desc' }).
        exec(function (err, magazines) {
            if (err) res.status(200).json({
                error: "Erreur lors de l'obtention des magazines"
            });
            res.send(magazines)
        });
});

router.get('/items', async (req, res) => {
    const nbr = await Magazines.estimatedDocumentCount();
    res.json(nbr);
});

router.get('/items/word/:word', async (req, res) => {
    const word = req.params.word;
    const mag = await Magazines.find({ title: { $regex: word, $options: 'i' } })
    res.json(mag.length);
});

router.get('/home', (req, res) => {
    Magazines.find().
        populate('tags', '-magazines -articles').
        limit(3).
        sort({ date: 'desc' }).
        exec(function (err, magazines) {
            if (err) return res.status(400).json({
                error: "Erreur lors de l'obtention des magazines"
            });
            res.send(magazines)
        });
});

router.get('/:id', (req, res) => {
    Magazines.findOne({ _id: req.params.id }).
        populate('tags', '-magazines -articles').
        exec(function (err, magazine) {
            if (err) return res.status(200).json({
                error: "Erreur lors de l'obtention du magazine"
            });
            res.send(magazine)
        });
})

router.post('/', upload.single('cover'), async (req, res) => {

    let arrayTag = [];
    const tags = req.body.tags;

    const newMag = new Magazines({
        title: req.body.title,
        price: req.body.price,
        stock: req.body.stock,
        summary: req.body.summary,
        isbn: req.body.isbn,
        cover: req.body.path_file,
        id_paypal: req.body.id_paypal
    });

    await Promise.all((tags).map(async (tag) => {
        let tagExist = await Tags.findOne({ name: tag.toLowerCase() });
        if (tagExist) {
            arrayTag.push(tagExist._id);
            tagExist.magazines = [...tagExist.magazines, newMag._id]
            await tagExist.save((err) => {
                if (err) return res.status(200).json({
                    error: "Erreur lors de la création du magazine"
                });
            })
        }
        else {
            const newTag = new Tags({
                name: tag.toLowerCase(),
                magazines: [newMag._id]
            })
            arrayTag.push(newTag._id)
            await newTag.save((err) => {
                if (err) return res.status(200).json({
                    error: "Erreur lors de la création du magazine"
                });
            })
        }
    }))

    arrayTag.forEach(tag => {
        newMag.tags = [...newMag.tags, tag]
    });

    newMag.save((err) => {
        if (err) return res.status(200).json({
            error: "Erreur lors de la création du magazine"
        });
        res.status(201).json({
            success: "Magazine créé !"
        });
    });
}
);

router.patch('/:id', upload.single('cover'), async (req, res) => {

    const updateMag = req.body;
    let tagsDelete = updateMag.tagsDelete;
    let tagsAdd = updateMag.tags;

    const magazine = await Magazines.findById(req.params.id).populate('tags');
    let tags = magazine.tags;

    if (req.body.path_file || tagsDelete || tagsAdd) {

        if (req.body.path_file) {
            updateMag.cover = req.body.path_file;
            unlink('./public/' + magazine.cover, (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        if (tagsDelete) {
            await Promise.all(tagsDelete.map(async (tag) => {
                let tagExist = await Tags.findOne({ name: tag });
                let listeMag = tagExist.magazines;
                for (let index = 0; index < listeMag.length; index++) {
                    if (listeMag[index]._id == req.params.id) {
                        tagExist.magazines.splice(index, 1);
                    }
                }
                await tagExist.save((err) => {
                    if (err) return res.status(200).json({
                        error: "Erreur lors de la création du magazine"
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
            await Promise.all((updateMag.tags).map(async (tag) => {
                let tagExist = await Tags.findOne({ name: tag.toLowerCase() });
                if (tagExist) {
                    arrayTag.push(tagExist._id);
                    tagExist.magazines = [...tagExist.magazines, req.params.id]
                    await tagExist.save((err) => {
                        if (err) return res.status(200).json({
                            error: "Erreur lors de la création du magazine"
                        });
                    })
                }
                else {
                    const newTag = new Tags({
                        name: tag.toLowerCase(),
                        magazines: [req.params.id]
                    })
                    arrayTag.push(newTag._id)
                    await newTag.save((err) => {
                        if (err) return res.status(200).json({
                            error: "Erreur lors de la création du magazine"
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

    updateMag.tags = t;

    Magazines.findByIdAndUpdate(
        req.params.id,
        { $set: updateMag },
        { new: true },
        (err) => {
            if (err) res.status(200).json({
                error: "Erreur lors de la modification du magazine"
            });
            res.status(200).json({
                success: "Magazine modifié !"
            });
        }
    )
});

router.delete('/:id', async (req, res) => {

    const magazine = await Magazines.findById(req.params.id).populate('tags');
    const tags = magazine.tags;

    deleteFile(magazine.cover)

    await Promise.all(tags.map(async (tag) => {
        let t = await Tags.findById(tag._id).populate('magazines');
        for (let index = 0; index < t.magazines.length; index++) {
            t.magazines.splice(index, 1);
        }
        await t.save((err) => {
            if (err) return res.status(200).json({
                error: "Erreur lors de la suppression du magazine"
            });
        })
    }));

    Magazines.findByIdAndRemove(req.params.id, (err) => {
        if (!err) {
            res.status(200).json({
                success: "Magazine supprimé !"
            });
        }
        else {
            res.status(200).json({
                error: "Erreur lors de la suppression du magazine"
            });
        }
    });
});

module.exports = router;