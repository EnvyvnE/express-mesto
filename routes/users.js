const router = require('express').Router();

router.get('/users/:id', doesUserExist);

const router = require('express').Router();
const User = require('../models/user');

const { getUsers, createUser } = require('../controllers/users')
router.get('/users', getUsers);
router.get('/users/:userId', getUsers);

router.post('/sers', createUser);

module.exports = router;

