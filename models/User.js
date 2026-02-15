const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-type-email')
const Utils = require('../utils')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true})

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = Utils.hashPassword(this.password);
  }
});

const userModel = mongoose.model('user', userSchema)
module.exports = userModel