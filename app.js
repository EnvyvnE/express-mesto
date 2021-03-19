const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index.js');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use((req, res, next) => {
  req.user = {
    _id: '60538e5c2708f52bfbc9c535' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(router);

router.use((req, res) => {
  res.status(404).send({ message: `Ресурс по адресу ${req.path} не найден` });
});

app.listen(PORT, () => {
  console.log('App start')
})