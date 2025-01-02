const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRoutes = require('./reviewRoutes');

// const fs = require('fs');
// const {getAllTours,createTour,getTour,updateTour,deleteTour} = require('../controllers/tourController.js');

const express = require('express');
// console.log(__dirname);
const router = express.Router();
// console.log(`${__dirname}/../controllers/tourController.js`);

// eslint-disable-next-line import/no-dynamic-require
const tourController = require(`${__dirname}/../controllers/tourController.js`);
// router.param('id', tourController.checkID);

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStates);
router.route('/monthly-plan/:year').get(
  authController.protect,
  authController.restrictTO('admin', 'tour-guide', 'guide'),
  tourController.getMonthlyPlan,
);

router.use('/:tourId/reviews', reviewRoutes);
//Post /tour/746hdu8/reviews
//Get /tour/746hdu8/reviews
//Get /tour/746hdu8/reviews/7643hdk4

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTO('user'),
//     reviewController.createReview,
//   );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTO('admin', 'lead-guides'),
    tourController.createTour,
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTO('admin', 'tour-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTO('admin', 'tour-guide'),
    tourController.deleteTour,
  );

module.exports = router;
