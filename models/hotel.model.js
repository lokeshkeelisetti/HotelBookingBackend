const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotel = new Schema({
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
