const { body } = require('express-validator')

const validateNewUser = () => {
    return [
        body('email').trim().isEmail().withMessage('Please enter a valid e-mail address'),
        body('password').trim().isLength({ min: 3 }).withMessage('Password must be at least 3 characters').isLength({ max: 7 }).withMessage('Password must be max 6 characters'),
        body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters').isLength({ max: 10 }).withMessage('First name must be max 20 characters'),
        body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters').isLength({ max: 10 }).withMessage('Last name must be max 20 characters'),
        body('repassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('The entered passwords are not the same')
            }
            return true
        })
    ]
}


const validateLogin = () => {
    return [
        body('email').trim().isEmail().withMessage('Please enter a valid e-mail address'),
        body('password').trim().isLength({ min: 3 }).withMessage('Password must be at least 3 characters').isLength({ max: 7 }).withMessage('Password must be max 6 characters'),
    ]
}

const validateEmail = () => {
    return [
        body('email').trim().isEmail().withMessage('Please enter a valid e-mail address')
    ]
}


const validateNewPassword = () => {
    return [
        body('password').trim().isLength({ min: 3 }).withMessage('Password must be at least 3 characters').isLength({ max: 7 }).withMessage('Password must be max 6 characters'),
        body('repassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('The entered passwords are not the same')
            }
            return true
        })
    ]
}

module.exports = {
    validateNewUser, validateLogin, validateEmail, validateNewPassword
}
