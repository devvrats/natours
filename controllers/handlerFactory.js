const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('hello');

    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
    //   try {} catch (error) {
    //   res.status(404).json({
    //     status: 'success',
    //     error: error,
    //   });
    // }
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'sucess',
      data: {
        data: doc,
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
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: { doc },
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
exports.getAll = (Model, popOptions) => 

catchAsync(async (req, res, next) => {
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

  //To allow for Nested GET reviews on tour (hack)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let doc = features.query.populate(popOptions);
  doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestedAT: req.requestTime,
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
