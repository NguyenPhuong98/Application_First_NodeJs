const Course = require("../models/Course")
const {mongooseToObject, multipleMongooseToObject} = require('../../util/mongoose')
class MeController {
    // [GET] /me/stored/courses
    storedCourses(req, res, next) {
        let courses = Course.find({});
        if(req.query.hasOwnProperty('_sort')) {
            courses : courses.sort({
                [req.query.column]: req.query.type
            });

        }
        Promise.all([courses, Course.countDocumentsDeleted()])
            .then(([courses, deletedAcount]) => res.render('me/stored_Courses', {
                deletedAcount,
                courses: multipleMongooseToObject(courses),
            }));
    }

    // [GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted()
            .then(courses => res.render('me/trash_Courses', {
                courses: multipleMongooseToObject(courses),
            }))
            .catch(next)
    }
}

module.exports = new MeController();
