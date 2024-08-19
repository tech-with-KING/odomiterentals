#!/usr/bin/Node
const mongoose = require('mongoose')
const UserDetailSchema = new mongoose.Schema(
  {
    id: String,
    email: String, 
    user_name: String,
    passwd: {type: String, required: false},
    _image: {
      type: String,
      default: 'https://avatars.githubusercontent.com/u/214020?s=40&v=4'
    },
    first_name:{type: String, default: "first_name"},
    last_name:{type: String, default: "last_name"},
    date: {
      type: Date,
      default: Date.now
    },
  }
)
const User = mongoose.model('User', UserDetailSchema);
module.exports.UserDetail = User;
