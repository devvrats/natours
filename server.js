/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(app.get('env'));

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
