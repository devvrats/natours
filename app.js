// const fs = require('fs');
const express = require('express');

const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorcontroller');

const tourRoute = require(`./routes/tourRoutes.js`);
const userRoute = require(`./routes/userRoutes.js`);
// console.log(__dirname);

// middleware, it is function that can modify the incoming request data. It stand in the middle of request and response.
// 1. Middleware

if (process.env.NODE_ENV === 'development') {
  // console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
}
app.use(express.json()); //express.json also called body perser
app.use(express.static(`${__dirname}/public`));

//creating our own middleware
app.use((req, res, next) => {
  // console.log('Helle from the middleware😀');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toDateString();
  // console.log(req.headers);
  next();
});

// const userRouter = express.Router();

// Route
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
// );

// 2. ROUTE HANDLER
// const getAllTours = (req, res) => {
//   console.log(req.requestTime);

//   res.status(200).json({
//     status: 'success',
//     requestAT: req.requestTime,
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };
// const getTour = (req, res) => {
//   const tour = tours.find((tour) => tour.id === Number(req.params.id));

//   if (Number(req.params.id) >= tours.length) {
//     // if(!tour){
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: tour,
//   });
// };
// const createTour = (req, res) => {
//   console.log(req.body);
//   const newId = tours.at(-1).id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'sucess',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };
// const updateTour = (req, res) => {
//   if (Number(req.params.id) >= tours.length) {
//     // if(!tour){
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<updated tour here...>',
//     },
//   });
// };
// const deleteTour = (req, res) => {
//   console.log(req.params.id);
//   console.log(tours.length);
//   if (Number(req.params.id) >= tours.length) {
//     // if(!tour){
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3. ROUTE

// router.route('/').get(getAllTours).post(createTour);
// router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

//4. START SERVER
// const port = 3000;
// app.listen(port, () => {
//   console.log(`app running on port ${port}...`);
// });
module.exports = app;
