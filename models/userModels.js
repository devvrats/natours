const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcryptjs');

//name email photo password password confirm
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please tell us your name!'] },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validate.isEmail, ['Please provide a valid email']],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        //this only works on Save and create
        return el === this.password; //abc === abc
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actully modified
  if (!this.isModified('password')) return next();

  //Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword,
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
