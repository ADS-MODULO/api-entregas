const express = require('express');
const { registrar, login, perfil } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.get('/perfil', authMiddleware, perfil);

module.exports = router;

