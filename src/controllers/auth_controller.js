const { validationResult } = require('express-validator')
const passport = require('passport')
const User = require('../model/user_model')
require('../config/passport_local')(passport)
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const mailService = require('../services/mail_service')


const sendLoginForm = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layout.ejs' })
}

const login = (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('validation_error', errors.array())
        res.redirect('/login')
    } else {
        passport.authenticate('local', { //We use the local strategy, we can say that this depends on email-password, facebook, etc. means local email-password
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next)
    }
}

const sendRegisterForm = (req, res, next) => {
    res.render('register', { layout: './layout/auth_layout.ejs' })
}

const register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('validation_error', errors.array())
        res.redirect('/register')
    } else {
        try {
            const _user = await User.findOne({ email: req.body.email })
            if (_user && _user.emailActive == true) {
                req.flash('validation_error', [{ msg: "e-mail address is available in the system" }])
                res.redirect('/register')
            } else if ((_user && _user.emailActive == false) || _user == null) {
                if (_user) {
                    await User.findByIdAndRemove({ _id: _user._id })
                }
                const newUser = new User({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: await bcrypt.hash(req.body.password, 10)
                })
                await newUser.save()

                const jwtInformations = {
                    id: newUser.id,
                    mail: newUser.email
                }
                const jwtToken = jwt.sign(jwtInformations, process.env.CONFIRM_MAIL_JWT_SECRET, { expiresIn: '1d' })
                const url = process.env.WEB_SITE_URL + 'verify?id=' + jwtToken

                const mailResult = await mailService.sendMailToUser(newUser.email, "Welcome", "To confirm mail:" + url)
                if (mailResult) {
                    req.flash('success_message', [{ msg: 'User added. Please check your mailbox.' }])
                    res.redirect('/login')
                } else {
                    req.flash('validation_error', [{ msg: "Something is wrong! Please try later again!" }])
                    res.redirect('/login')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

}

const sendForgetPass = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layout.ejs' })
}

const forgetPass = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('validation_error', errors.array())
        res.redirect('/forget-password')
    } else {
        try {
            const _user = await User.findOne({ email: req.body.email, emailActive: true })

            if (_user) {
                const jwtInformations = {
                    id: _user.id,
                    mail: _user.email
                }
                const secretKey = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password
                const jwtToken = jwt.sign(jwtInformations, secretKey, { expiresIn: '1d' })
                const url = process.env.WEB_SITE_URL + 'reset-password/' + _user.id + "/" + jwtToken

                const mailResult = await mailService.sendMailToUser(_user.email, "Change Password", "To change password:" + url)
                if (mailResult) {
                    req.flash('success_message', [{ msg: 'Password change link has been sent. Please check your mailbox.' }])
                    res.redirect('/login')
                } else {
                    req.flash('validation_error', [{ msg: "Something is wrong! Please try later again!" }])
                    res.redirect('/forget-password')
                }

            } else {
                req.flash('validation_error', [{ msg: "Incorrect e-mail address" }])
                res.redirect('/forget-password')
            }
        }
        catch (error) {
            console.log(error)
        }
    }

}

const verifyEmail = (req, res, next) => {
    const token = req.query.id
    if (token) {
        try {
            jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET, async (err, decoded) => {
                if (err) {
                    req.flash('error', 'The code is incorrect or out of date!')
                    res.redirect('/login')
                } else {
                    const idInToken = decoded.id
                    const result = await User.findByIdAndUpdate(idInToken, {
                        emailActive: true
                    })
                    if (result) {
                        req.flash('success_message', [{ msg: 'Mail verification successful!' }])
                        res.redirect('/login')
                    } else {
                        req.flash('error', "Error! Please re-create a user!")
                        res.redirect('/login')
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    } else {
        req.flash('error', "Error! Invalid token!")
        res.redirect('/login')
    }
}

const logout = (req, res, next) => {
    req.logout()//This code only clears the userID field in the session in the database. In terms of a cleaner structure, the session can be deleted and changed completely!
    req.session.destroy((error) => { //We are deleting the session from the cookie. later, when redirect is logged in, a different new session is given!
        res.clearCookie('connect.sid')
        res.render('login', { layout: './layout/auth_layout.ejs', success_message: [{ msg: 'Logout is successful' }] })
    })

}

const newPasswordFormShow = async (req, res, next) => {
    const url_id = req.params.id
    const url_token = req.params.token
    if (url_id && url_token) {
        try {
            const _user = await User.findOne({ _id: url_id })
            const secretKey = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password
            jwt.verify(url_token, secretKey, async (err, decoded) => {
                if (err) {
                    req.flash('error', 'The code is incorrect or out of date!')
                    res.redirect('/forget-password')
                } else {
                    res.render('new_password', { id: url_id, token: url_token, layout: './layout/auth_layout.ejs' })
                }
            })
        } catch (error) {
            console.log('Error:' + error)
            res.redirect('/forget-password')
        }
    }
    else {
        req.flash('validation_error', [{ msg: "Incorrect operation! Please repeat the process!" }])
        res.redirect('/forget-password')
    }
}

const saveNewPassword = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('validation_error', errors.array())
        res.redirect('/reset-password/' + req.body.id + "/" + req.body.token)
    } else {
        const _findedUser = await User.findOne({ _id: req.body.id, emailActive: true })
        const secretKey = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _findedUser.password
        try {
            jwt.verify(req.body.token, secretKey, async (err, decoded) => {
                if (err) {
                    req.flash('error', 'The code is incorrect or out of date!')
                    res.redirect('/forget-password')
                } else {
                    const hashedPass = await bcrypt.hash(req.body.password, 10)
                    const result = await User.findByIdAndUpdate(req.body.id, {
                        password: hashedPass
                    })
                    if (result) {
                        req.flash('success_message', [{ msg: 'The password has been successfully updated.' }])
                        res.redirect('/login')
                    } else {
                        req.flash('error', "Error! Please do the password reset steps again.")
                        res.redirect('/login')
                    }
                }
            })
        } catch (error) {
            console.log('Error:' + error)
        }
    }
}

module.exports = { sendLoginForm, sendRegisterForm, sendForgetPass, register, login, forgetPass, verifyEmail, logout, newPasswordFormShow, saveNewPassword }