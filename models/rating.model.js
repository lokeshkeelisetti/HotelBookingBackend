const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Rating = new Schema({
  rating_value:Number,
  customer:Customer,
  hotel:Hotel,
  comment:String
},{
  timestamps:true
})
