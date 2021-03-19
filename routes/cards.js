const router = require('express').Router();
const Card = require('../models/film');
const { getCards, createFilm } = require('../controllers/films')
router.get('/', getFilms);

router.post('/', createFilm);

router.delete('')
module.exports = router;

