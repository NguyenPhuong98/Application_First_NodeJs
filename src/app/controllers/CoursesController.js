const Course = require("../models/Item")
const {mongooseToObject} = require('../../util/mongoose')
class CoursesController {
    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({slug: req.params.slug })
        .then(course => {
            res.render('courses/show',{
                course: mongooseToObject(course)
            });
            })
        .catch(next);
    }

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create')
    }

    // [POST] /courses/store
    store(req, res, next) {
        // res.render('courses/store')
    }
}

module.exports = new CoursesController();
