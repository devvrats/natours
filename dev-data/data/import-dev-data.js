const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const Tour = require('../../models/tourModel.js');
const Review = require('../../models/reviewModel.js');
const User = require('../../models/userModel.js');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

//IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log('Data sucessfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
console.log(process.argv);
if (process.argv[2] === '--import') {
  console.log('import');
  importData();
} else if (process.argv[2] === '--delete') {
  console.log('delete');
  deleteData();
}
