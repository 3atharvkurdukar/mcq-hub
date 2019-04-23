const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
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
    rollno: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        valid: {
            validator: validator.isNumeric,
            message: '{VALUE} is not a valid roll no.'
        }
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
    }],
    //  TODO: Add results array
});

StudentSchema.statics.findByToken = function (token) {
    const Student = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject();
    }
    return Student.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

StudentSchema.statics.findByCredentials = function (rollno, password) {
    const Student = this;
    return Student.findOne({ rollno }).then((student) => {
        if (!student) {
            Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, student.password, (err, res) => {
                if (!res) {
                    reject();
                }
                resolve(student);
            });
        });
    });
};

StudentSchema.methods.generateAuthToken = function () {
    const student = this;
    const access = 'auth';
    const token = jwt.sign({ _id: student._id.toHexString(), access }, process.env.JWT_SECRET);

    student.tokens.push({ access, token });

    return student.save().then(() => {
        return token;
    });
};

StudentSchema.methods.removeToken = function (token) {
    const student = this;

    return student.update({
        $pull: {
            tokens: { token }
        }
    });
};

StudentSchema.methods.toJSON = function () {
    const student = this;
    const userObject = student.toObject();

    return _.pick(userObject, ['_id', 'firstname', 'lastname', 'rollno']);
};

StudentSchema.pre('save', function () {
    const student = this;

    if (student.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(student.password, salt);
        student.password = hash;
        next();
    } else {
        next();
    }
});

// mongoose generates a DB model for validating the input
const Student = mongoose.model('Student', StudentSchema);


module.exports = {
    Student
};
