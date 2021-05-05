const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        default: ''
    },
    previousBookings : [booking],
    upcomingBookings : [booking]
},{
    timestamps:true
})