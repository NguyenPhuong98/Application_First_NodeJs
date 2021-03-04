const Item = require('../models/Item')
const {multipleMongooseToObject} = require('../../util/mongoose')

class SiteController {
    home(req, res, next) {

        // Item.find({}, function (err, items) {
        //     if(!err) {
        //         res.json(items);
        //     } else {
        //         res.status(400).json({error: 'ERROR'});
        //     }
        //   });

        //   Item.find({})
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
        Item.find({})
            .then(courses => {
                res.render('home', {
                    courses: multipleMongooseToObject(courses)
                });
            })
            .catch(next);
        // return res.render('home');
    }

    search(req, res) {
        return res.render('search');
    }
}

module.exports = new SiteController();
