const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();

require('./models/dbConfig');
const {checkUser, requireAuth} = require('./tools/auth');

const usersRoutes = require('./routes/users');
const magazinesRoutes = require('./routes/magazines');
const articlesRoutes = require('./routes/articles');
const tagsRoutes = require('./routes/tags');
const newsRoutes = require('./routes/news');
const subsRoutes = require('./routes/subs');

app.use(cors({credentials: true, origin: process.env.BASE_URL_FRONT}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'))

app.get('*', checkUser);
app.get('/users/jwt', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user)
});

app.use('/users', usersRoutes);
app.use('/magazines', magazinesRoutes);
app.use('/articles', articlesRoutes);
app.use('/tags', tagsRoutes);
app.use('/news', newsRoutes);
app.use('/subs', subsRoutes);

const port = process.env.PORT || 5500;

app.listen(port, () => console.log("server started ! "));