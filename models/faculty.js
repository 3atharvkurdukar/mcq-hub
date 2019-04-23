const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const FacultySchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: false,
    },
    lastname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: false,
    },
    gender: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: false
    },
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

FacultySchema.statics.findByToken = function (token) {
    const Faculty = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject();
    }
    return Faculty.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

FacultySchema.statics.findByCredentials = function (username, password) {
    const Faculty = this;
    return Faculty.findOne({ username }).then((faculty) => {
        if (!faculty) {
            Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, faculty.password, (err, res) => {
                if (!res) {
                    reject();
                }
                resolve(faculty);
            });
        });
    });
};

FacultySchema.methods.generateAuthToken = function () {
    const faculty = this;
    const access = 'auth';
    const token = jwt.sign({ _id: faculty._id.toHexString(), access }, process.env.JWT_SECRET);

    faculty.tokens.push({ access, token });

    return faculty.save().then(() => {
        return token;
    });
};

FacultySchema.methods.removeToken = function (token) {
    const faculty = this;

    return faculty.update({
        $pull: {
            tokens: { token }
        }
    });
};

FacultySchema.methods.toJSON = function () {
    const faculty = this;
    const userObject = faculty.toObject();

    return _.pick(userObject, ['_id', 'firstname', 'lastname', 'username']);
};

FacultySchema.pre('save', function () {
    const faculty = this;

    if (faculty.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(faculty.password, salt);
        faculty.password = hash;
        next();
    } else {
        next();
    }
});

// mongoose generates a DB model for validating the input
const Faculty = mongoose.model('Faculty', FacultySchema);


module.exports = {
    Faculty
};
