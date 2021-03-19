const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { getUsers, getUserById, createUser, updateUser, updateAvatar } = require('./controllers/users');

const { getCards, createCard, deleteCardById, likeCard, dislikeCard } = require('./controllers/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});


const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '60538e5c2708f52bfbc9c535' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
//routes for user
app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.post('/users', createUser);
app.patch('/users/me', updateUser);
app.patch('/users/me/avatar', updateAvatar);
// routes for cards
app.get('/cards', getCards);
app.post('/cards', createCard);
app.delete('/cards/:cardId', deleteCardById);
app.put('/cards/:cardId/likes', likeCard);
app.delete('/cards/:cardId/likes', dislikeCard);
