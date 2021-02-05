const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const { dirname } = require('path');

const app = express();
const port = 3000;
const route = require('./routes');
const router = require('./routes/news');

app.use(express.static(path.join(__dirname, 'public')));
//HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
