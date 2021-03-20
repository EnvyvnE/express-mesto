const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards =>
      res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}


module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }

    });
}

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найден' })
      }
        res.send({ data: card })

    })
    .catch((err) => {
       if (err.name === 'CastError') {
      res.status(400).send({ message: err.message })
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
})
}


module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card =>{
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найден' })
      }
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err.message })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    })
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card =>{
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найден' })
      }
      res.send({ data: card })
    })
    .catch(() => {
      if (err.name === 'CastError') {
      res.status(400).send({ message: err.message })
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
})
}
