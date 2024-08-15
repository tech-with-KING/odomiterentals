#!/usr/bin/Node
const mongoose = require('mongoose')
const AdminDetailSchema = new mongoose.Schema(
  {
    id: String,
    adminPin: String,
    user_name: String,
    passwd: String,
    _image: String,
    first_name: String,
    last_name: String,
    date: {
      type: Date,
      default: Date.now
    },
  }
)
const Admin = mongoose.model('Admin', AdminDetailSchema);
module.exports.AdminDetail = Admin;
