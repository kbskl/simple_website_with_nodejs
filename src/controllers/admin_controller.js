const showHomePage = function (req, res, next) {
    res.render('index', { layout: './layout/admin_layout.ejs' })
}

module.exports = {
    showHomePage
}