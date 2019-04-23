const express = require('express');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('./public'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

module.exports = {
    app
};
