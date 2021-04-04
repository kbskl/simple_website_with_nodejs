const onlyLoggedIn = function (req, res, next) {

    if (req.isAuthenticated()) { //Since we are using passport, this method is available, otherwise there is no such method!
        return next()
    } else {
        req.flash('error', ["Please sign in first"])
        res.redirect('/login')
    }
}

const onlyNotLoggedIn = function (req, res, next) {

    if (!req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/admin')
    }
}

module.exports = {
    onlyLoggedIn, onlyNotLoggedIn

}