const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers, getUserById, updateUser, updateAvatar, getUserInfo } = require('../controllers/users');

router.get('/', getUsers);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
  }),
}), updateUser);
router.get('/me', getUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);
router.get('/:id', getUserById);

module.exports = router;

