const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    content: {
        type: String,
        require: true
    }
});

const News = mongoose.model('news', newsSchema);

const if_exist = async(news) => {
    const u = await News.exists({_id : news._id});
    if(u === null) {
        news.save()
    }
}

const n = new News({
    _id : new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
    title: "Le site est lancé !",
    content: "Bienvenue sur Les sentiers de l'histoire !\nJ'espère que le site vous plaira, il reste encore quelques petites choses à ajouter/améliorer mais le principal est là :)"
});

const ne = new News({
    _id : new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb'),
    title: "Testez le site comme vous le souhaitez !",
    content: "Il y a 3 comptes par défaut :\n - l'admin : admin@admin.fr / admin\n - l'abonné : abo@abo.fr / abo\n - l'utilisateur : test@test.fr / test"
})

if_exist(n);
if_exist(ne);

module.exports = { News };