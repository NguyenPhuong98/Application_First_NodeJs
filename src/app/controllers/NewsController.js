class NewsController {
    // [GET] /news
    news(req, res) {
        return res.render('news');
    }

    // [GET] /new/:slug
    show(req, res) {
        return res.send('NEWS DETAIL!!!');
    }
}

module.exports = new NewsController();
