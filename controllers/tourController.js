const AppError = require('../utils/appError');
const Tour = require(`./../models/tourModels`);
const APIFeatures = require('./../utils/apiFeatures');

const catchAsync = require('./../utils/catchAsync');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.price || !req.body.name) {
//     res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestTime);

  // console.log(req.query);
  //BUILD QUERY
  // 1A) Filtering
  // const queryObj = { ...req.query };
  // const excludedField = ['page', 'sort', 'limit', 'fields'];
  // excludedField.forEach((el) => delete queryObj[el]);

  // // 1B) Advanced filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));

  // // {difficulty: 'easy', duration: {$gte:5}}
  // // {difficulty: 'easy', duration: {gte:'5'}}

  // let query = Tour.find(JSON.parse(queryStr));

  //2) SORTING
  // if (req.query.sort) {
  //   const sortyBy = req.query.sort.split(',').join(' ');

  //   query = query.sort(sortyBy);
  //   //{sort, ratingsAverage}
  // } else {
  //   query = query.sort('-createdAt');
  // }

  //3) Field limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   console.log(fields);
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  //4) Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   console.log(numTours);
  //   if (skip >= numTours) throw new Error('This page does not exists');
  // }

  //EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  console.log('hello4');

  // const tours =  Tour.find()
  //   .where('difficulty')
  //   .equals('easy')
  //   .where('duration')
  //   .equals(5);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestedAT: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
  //   try{
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
  //   try {} catch (error) {
  //   res.status(401).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
  // const tour = tours.find((tr) => tr.id === Number(req.params.id));
  // res.status(200).json({
  //   status: 'success',
  //   data: tour,
  // });
});

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      tours: newTour,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  //   try {} catch (error) {
  //   res.status(404).json({
  //     status: 'success',
  //     error: error,
  //   });
  // }
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) return next(new AppError('No tour found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
  //   try {} catch (error) {
  //   res.status(404).json({
  //     status: 'fail',
  //     err: error,
  //   });
  // }
});

exports.getTourStates = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
    // { $match: { _id: { $ne: 'EASY' } } },
  ]);

  res.status(200).json({ status: 'success', data: { stats } });
  //   try {} catch (error) {
  //   res.status(404).json({ satus: 'fail', err: error });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);
  res.status(200).json({
    message: 'success',
    data: {
      plan,
    },
  });
  //  try{} } catch (error) {
  //     res.status(404).json({
  //       status: 'fail',
  //       message: error,
  //     });
  //   }
});
