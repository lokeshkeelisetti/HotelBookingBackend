const { app } = require('../server');
const request = require('supertest');
const receptionist = require('../models/receptionist.model');
test('database should be working Create/Read', async () => {
    await receptionist.deleteMany({});
    let Receptionist = new receptionist({
        name:{firstName : 'abc', lastName : 'def',},
        email: 'mno@w.com',
        password: 'password',
        hotelId: 'qrs',
    });
    await Receptionist.save();
    let result = await receptionist.findOne({ email: 'mno@w.com' });
    expect(result.email).toBe('mno@w.com');
});

test('database should be working Update', async () => {
    await receptionist.updateOne({ email: 'mno@w.com' }, { $set: { "email": 'mn@w.com' } });
    let result = await receptionist.findOne({ email: 'mn@w.com' });
    expect(result.email).toBe('mn@w.com');
});

test('database should be working (Delete)', async () => {
    await receptionist.deleteOne({ email: 'mn@w.com' });
    let result = await receptionist.findOne({ email: 'mn@w.com' });
    expect(result).toBe(null);
});