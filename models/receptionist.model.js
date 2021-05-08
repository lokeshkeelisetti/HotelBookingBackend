const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Receptionist = new Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    default:''
  },
  hotel:Hotel,
},{
  timestamps:true
})
