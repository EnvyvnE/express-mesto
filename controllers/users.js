const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yandexpraktikum';
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const UnuniqueEmailError = require('../errors/ununique-email-error');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(next)
}

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      console.log(user)
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден')
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError("Ошибка валидации данных")
      }
    })
    .catch(next)
}

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден')
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError("Ошибка валидации данных")
      }
    })
    .catch(next)
}

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash })
    })
    .then((({ _id }) => User.findById(_id)))
    .then((user) => {
      res.send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError("Ошибка валидации данных")
      }
      if (err.name === "MongoError" && err.code === 11000) {
        throw new UnuniqueEmailError('Пользователь с такой почтой уже существует');
      }
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id
      }, JWT_SECRET, { expiresIn: '7d' })
      return res.cookie('jwt', token, { httpOnly: true, sameSite: true }).status(200).send({ user: user })
    })
    .catch((err) => {
      throw new UnauthorizedError('Отсутствует авторизация');
    })
    .catch(next)
}

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true, upsert: true })
    .then(user => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден')
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError("Ошибка валидации данных")
      }

    })
    .catch(next)
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true, upsert: true })
    .then(user => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден')
      }
      res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError("Ошибка валидации данных")
      }

    })
    .catch(next)
}