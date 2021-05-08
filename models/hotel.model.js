const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotel = new Schema({
  hotel_name:{
    type:String,
    required: true
  },
  address:{
    type:String,
    required: true
  },
  rooms: [hotel_room]
},{
  timestamps: true
})
