const express = require('express');
const router = express.Router();
const { createUser, getUser, updateUser } = require('../controller/userController');

router.post('/register', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;
