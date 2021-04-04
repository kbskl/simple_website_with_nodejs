const dotenv = require('dotenv').config() //When config is written, these values are included in the whole project!
const express = require('express')
const ejs = require('ejs')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')

const app = express()

//routers include
const authRouter = require('./src/routers/auth_routers')
const adminRouter = require('./src/routers/admin_routers')

//db connection
require('./src/config/database')


//session ve flash process
const sessionStore = new MongoDBStore({ //sessions stored in mongodb
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'mySessions'
})
app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //expire time 
        },
        store: sessionStore
    }
))

app.use(flash())
app.use((req, res, next) => { //Actions to show errors. Because the response is sent to the user, but the flash messages are in the request.
    res.locals.validation_error = req.flash('validation_error')
    res.locals.success_message = req.flash('success_message')
    res.locals.login_error = req.flash('error')
    next()
})

//Session authentication
app.use(passport.initialize())
app.use(passport.session())


app.use(express.urlencoded({ extended: true }))

//Template engine settings
app.use(expressLayouts)
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './src/views'))


app.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/admin')
    }
    else {
        res.redirect('/login')
    }
})

app.use('/', authRouter)
app.use('/admin', adminRouter)


app.listen(process.env.PORT, () => {
    console.log('Server running. Port:', process.env.PORT)
})