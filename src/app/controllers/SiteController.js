const Course = require('../models/Course');
const Account = require('../models/Account');
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

    // [POST] /register
    register(req, res, next) {
        res.render('register');
    }

    // [POST] /store
    storeAccount(req, res, next) {
        const formData = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password,
        };
        const account = new Account(formData);
        account
            .save()
            .then(() => res.redirect('/login'))
            .catch(next);
    }

    // [GET] /login
    login(req, res, next) {
        // res.send('Welcome');
        res.render('login');
    }

    // [POST] /authentic
    authentic(req, res, next) {
        // res.send('Welcome');
        const query = Account.where({ email: req.body.email });
        query.findOne(function (error, account) {
            if (error) return handleError(error);
            if (account) {
                if (account.password === req.body.password) {
                    res.redirect('/');
                } else {
                    var formLogin = document.querySelector('form-2');
                    console.log(formLogin);
                }
            } else {
                res.redirect('/register');
            }
        });
    }
}

module.exports = new SiteController();
