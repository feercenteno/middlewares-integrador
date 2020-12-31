const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const validator = require('../middlewares/validator');
const guest = require('../middlewares/guest');
const auth = require('../middlewares/auth');


// ***** Multer *****

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/users')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   
  const upload = multer({ storage: storage })


// Muestra la vista de registro
router.get('/register', guest, userController.showRegister);

// Procesa la vista de registro
router.post('/register', guest, upload.any(), validator.register, userController.processRegister);

// Muestra la vista de login
router.get('/login', guest, userController.showLogin);

// Procesa la vista de login
router.post('/login', guest, validator.login, userController.processLogin);

// Muestra el perfil del usuario
router.get('/profile', auth,  userController.showProfile);

// Cierra la sesión
router.get('/logout', auth, userController.logout);

module.exports = router;