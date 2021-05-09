const express = require('express');
const mongoose = require('mongoose');
const router = require("express").Router();
let Hotel = require("../models/hotel.model");
let HotelAdministration = require("../models/hotelAdministration.model");
router.route("/").get((req, res) => {
	Hotel.find()
		.then((hotels) => res.json(hotels))
		.catch((err) => res.status(400).json("Error: " + err));
});
router.route("/addnewhotel").post((req, res) => {
const hotel = {
  hotel_name : req.body.hotel_name,
  address : {
    street : req.body.address.street,
    city : req.body.address.city,
    pinCode : req.body.address_pinCode,
  },};
  const hoteladmin ={
    name : {
      firstName : req.body.firstName,
      lastName : req.body.lastName,
    },
    email : req.body.email,
    password : req.body.password,
    hotel : req.body.hotel_name,
  };
const newhotel = new Hotel(hotel);
const newhotelAdmibistration = new HotelAdministration(hoteladmin);
newhotel.save()
  .then(() => res.json({success : "hotel added"}))
  .catch((err) => res.status(400).json({failure : "unable to add hotel ", error : err}));
newhotelAdmibistration.save()
     .then(() => res.json({success : "hoteladmin added"}))
     .catch((err) => res.status(400).json({failure : "unable to add hotel admin", error : err}));
});
router.route('/removehotel/:id').delete((req,res) =>
{
  Hotel.findByIdAndDelete(req.params.id)
  .then(() => res.json('hotel deleted'))
  .catch(err => res.status(400).json("Error : " + err) );
});


module.exports = router;