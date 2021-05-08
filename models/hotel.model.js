const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Hotel = new Schema({
  hotel_name:{
    type:String,
    required: true
  },
  address:{
    street: String,
    city: String,
    zip:Number
  },
  rooms: [hotel_room]
},{
  timestamps: true
})
