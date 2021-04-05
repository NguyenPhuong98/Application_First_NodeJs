const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    home(req, res, next) {
        // Course.find({}, function (err, courses) {
        //     if(!err) {
        //         res.json(courses);
        //     } else {
        //         res.status(400).json({error: 'ERROR'});
        //     }
        //   });

        //   Course.find({})
        //     .then(courses => {
        //         const context = {
        //             cours: courses.map(course => {
        //                 return {
        //                     name: course.name,
        //                     description: course.description,
        //                     image: course.image
        //                 }
        //             })
        //         }
        //     res.render('home', {courses: context.cours});
        //     })
        Course.find({})
            .then((courses) => {
                res.render('home', {
                    courses: multipleMongooseToObject(courses),
                });
            })
            .catch(next);
        // return res.render('home');
    }

    // [GET] /search
    search(req, res, next) {
        return res.render('search');
    }

    // [GET] /login
    login(req, res, next) {
        return res.render('login');
    }
}

module.exports = new SiteController();
