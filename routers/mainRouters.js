const express = require('express');
const router = express.Router();

const {validateRegister, validateLogin, authorize} = require('../middleware/validations');
const {register,login, gamble, getUserInfo,restartGame} = require('../controllers/mainControllers');

router.post('/register', validateRegister, register);
router.post('/login',validateLogin, login);
router.get('/play/:bid', authorize, gamble);
router.get('/getUserInfo', authorize, getUserInfo);
router.get('/newGame', authorize, restartGame);


module.exports = router;