const { app } = require('../server');
const request = require('supertest');
const hotelAdministration = require('../models/hotelAdministration.model');
test('database should be working Create/Read', async () => {
    await hotelAdministration.deleteMany({});
    let HotelAdministration = new hotelAdministration({
        name:{firstName : 'abc', lastName : 'def',},
        email: 'xyz@w.com',
        password: 'password',
        hotelId: 'qrs',
    });
    await HotelAdministration.save();
    let result = await hotelAdministration.findOne({ email: 'xyz@w.com' });
    expect(result.email).toBe('xyz@w.com');
});

test('database should be working Update', async () => {
    await hotelAdministration.updateOne({ email: 'xyz@w.com' }, { $set: { "email": 'xy@w.com' } });
    let result = await hotelAdministration.findOne({ email: 'xy@w.com' });
    expect(result.email).toBe('xy@w.com');
});

test('database should be working (Delete)', async () => {
    await hotelAdministration.deleteOne({ email: 'xy@w.com' });
    let result = await hotelAdministration.findOne({ email: 'xy@w.com' });
    expect(result).toBe(null);
});