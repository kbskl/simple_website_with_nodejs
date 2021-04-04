const LocalStrategy = require('passport-local').Strategy
const User = require('../model/user_model')
const bcrypt = require('bcrypt')
module.exports = function (passport) {
    const options = {
        //The variables entered here must be the same as the name of the input fields in the ejs file, so we say no usernameField but I have email.
        usernameField: 'email',
        passwordField: 'password'
    }
    passport.use(new LocalStrategy(options, async (email, password, done) => {
        try {
            const _findedUser = await User.findOne({ email: email })
            if (!_findedUser) {
                return done(null, false, { message: 'User not found' })// Done usage => (Error or not?, User found?, Warning message)
            }

            const checkPassword = await bcrypt.compare(password, _findedUser.password)
            if (!checkPassword) {
                return done(null, false, { message: 'Wrong password' })
            } else {
                if (_findedUser.emailActive == false) {
                    return done(null, false, { message: 'Please confirm your mail!' })
                }
                else {
                    return done(null, _findedUser)
                }
            }
        } catch (error) {
            return done(error)
        }
    }))

    //The function to store the found user's id in the cookie
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    //This function takes the user's id stored in the cookie, finds it in the database and performs the return operations!
    //After this process, we can access the user in the form of req.user.
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user)
        })
    })
}