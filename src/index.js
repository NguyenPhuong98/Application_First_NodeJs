const express = require('express');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
// const { dirname } = require('path');
const SortMiddleware = require('./app/middlewares/SortMiddleware');

// const { response } = require("express");

const app = express();
const port = 3000;
const route = require('./routes');
const router = require('./routes/news');
const db = require('./config/db');

// Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app/controllers')));
// app.use(express.static(path.join(__dirname, 'public/img')));

//HTTP logger
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Custom Middlewares
app.use(SortMiddleware);

// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            increase: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';
                const icons = {
                    default: 'oi oi-elezvator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                };

                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                };

                const type = types[sortType];
                const icon = icons[sortType];
                return `<a href="?_sort&column=${field}&type=${type}">
                    <span class="${icon}"></span>
                </a>`;
            },
            stringToArray: (data) => {
                console.log(data.toString().split(','));
                return data.toString().split(',');
            },
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
