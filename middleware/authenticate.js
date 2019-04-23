const { Faculty } = require('./../models/faculty');
const { Student } = require('./../models/student');

const authFaculty = (req, res, next) => {
        const token = req.header('x-auth');
        Faculty.findByToken(token).then((faculty) => {
            if (!faculty) {
                return Promise.reject();
            }
            req.faculty = faculty;
            req.token = token;
            next();
       }).catch((err) => {
           res.status(401).send();
       });
};

const authStudent = (req, res, next) => {
    const token = req.header('x-auth');
    Student.findByToken(token).then((student) => {
        if (!student) {
            return Promise.reject();
        }
        req.student = student;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send();
    });
};

module.exports = {
    authFaculty, 
    authStudent
};