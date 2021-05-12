const { app } = require('../server');
const request = require('supertest');
const hotel = require('../models/hotel.model');
test('database should be working Create/Read', async () => {
    await hotel.deleteMany({});
    let Hotel = new hotel({
        hotelName:'abc',
		address: {
			street: 'def',
			city: 'delhi',
			pinCode: '344056',
		},
    });
    await Hotel.save();
    let result = await hotel.findOne({ hotelName:'abc' });
    expect(result.hotelName).toBe('abc');
});

test('database should be working Update', async () => {
    await hotel.updateOne({ hotelName:'abc' }, { $set: { hotelName:'ab'} });
    let result = await hotel.findOne({ hotelName:'ab' });
    expect(result.email).toBe('ab');
});

test('database should be working (Delete)', async () => {
    await hotel.deleteOne({ hotelName:'ab'});
    let result = await hotel.findOne({ hotelName:'ab'});
    expect(result).toBe(null);
});