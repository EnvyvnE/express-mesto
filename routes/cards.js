const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCards, createCard, deleteCardById, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),

  }).unknown(true),
}), deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;

