class SiteController {
    home(req, res) {
        return res.render('home');
    }

    search(req, res) {
        return res.render('search');
    }
}

module.exports = new SiteController();
