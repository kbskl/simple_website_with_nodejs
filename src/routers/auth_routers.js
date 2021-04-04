const router = require('express').Router()
const auth_controller = require('../controllers/auth_controller')
const validatorMiddleware = require('../middlewares/validation_middleware')
const authMiddleware = require('../middlewares/auth_middleware')



router.get('/login', authMiddleware.onlyNotLoggedIn, auth_controller.sendLoginForm)
router.post('/login', authMiddleware.onlyNotLoggedIn, validatorMiddleware.validateLogin(), auth_controller.login)

router.get('/register', authMiddleware.onlyNotLoggedIn, auth_controller.sendRegisterForm)
router.post('/register', authMiddleware.onlyNotLoggedIn, validatorMiddleware.validateNewUser(), auth_controller.register)

router.get('/forget-password', authMiddleware.onlyNotLoggedIn, auth_controller.sendForgetPass)
router.post('/forget-password', authMiddleware.onlyNotLoggedIn, validatorMiddleware.validateEmail(), auth_controller.forgetPass)
router.get('/verify', auth_controller.verifyEmail)

router.get('/reset-password/:id/:token', auth_controller.newPasswordFormShow)
router.get('/reset-password', auth_controller.newPasswordFormShow)
router.post('/reset-password', validatorMiddleware.validateNewPassword(), auth_controller.saveNewPassword)

router.get('/logout', authMiddleware.onlyLoggedIn, auth_controller.logout)

module.exports = router