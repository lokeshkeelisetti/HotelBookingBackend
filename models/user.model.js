const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
        validate : (value) => {
            let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return value.match(reg);
        }
    },
    userType : {
        type: String,
        required: true,
        enum: ['customer','admin','receptionist','maintainer']
    },
    details: {
        type: mongoose.Schema.Types.ObjectId
    }
},
{
    timestamps:true
});