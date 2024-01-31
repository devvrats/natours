/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const dotenv = require('dotenv');
// NODE_ENV = development
// USER = devvrat
// PASSWORD = 12345
// PORT = 8000
// DATABASE = mongodb+srv://devvrat:<PASSWORD>@cluster0.in30cdx.mongodb.net/natours?retryWrites=true&w=majority
// DATABASE_LOCAL = mongodb://localhost:27017/natours
// DATABASE_PASSWORD = PYCqRJApbCYFykno

dotenv.config({ path: './config.env' });
const app = require('./app');
// const express = require('express');

// const app = express();
// const morgan = require('morgan');

// const tourRoute = require(`./routes/tourRoutes.js`);
// const userRoute = require(`./routes/userRoutes.js`);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use('/api/v1/tours', tourRoute);
// eslint-disable-next-line import/no-dynamic-require
const router = express.Router();

// eslint-disable-next-line import/no-dynamic-require
const tourController = require(`${__dirname}/../controllers/tourController.js`);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

app.use('/api/v1/users', userRoute);
module.exports = app;

////////////////////////////////////////////

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful');
  });

// console.log(process.env);

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
