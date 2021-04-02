const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards =>
      res.send({ data: cards }))
    .catch(next)
}


module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError("Ошибка валидации данных")
      }
    })
    .catch(next);
}



module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((card) => {
            if (!card) {
              throw new NotFoundError('Запрашиваемая карточка не найдена')
            }
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError("Ошибка валидации данных")
            }
          })
      } else {
        throw new ForbiddenError("Нельзя удалять чужие карточки");
      }
      return res.status(200).send({ card: card })
    })
    .catch(next)

}


module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена')
      }
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError("Ошибка валидации данных")
      }
    })
    .catch(next)
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена')
      }
      res.send({ data: card })
    })
    .catch(() => {
      if (err.name === 'CastError') {
        throw new BadRequestError("Ошибка валидации данных")
      }
    })
    .catch(next);
}
