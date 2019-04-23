require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const { mongoose } = require('./db/mongoose');
const { Faculty } = require('./models/faculty');
const { Student } = require('./models/student');
const { authFaculty, authStudent } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('./public'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/faculty/', authFaculty, (req, res) => {
    res.sendFile(__dirname + '/public/faculty/index.html');
});

app.get('/student/', authStudent, (req, res) => {
    res.sendFile(__dirname + '/public/student/index.html');
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

module.exports = {
    app
};
