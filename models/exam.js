const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const ExamSchema = new mongoose.Schema({
    questions: [{
        question: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        optionA: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        optionB: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        optionC: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        optionD: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        answer: {
            type: String,
            required: true,
            maxlength: 1,
            trim: true
        },
    }],
    courseName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    courseCode: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: false
    },
    marks: {
        type: Number,
        required: true,
        trim: true
    },
    questionCount: {
        type: Number,
        required: true,
        trim: true
    }
});

// mongoose generates a DB model for validating the input
const Exam = mongoose.model('Exam', ExamSchema);

module.exports = {
    Exam
};
