const { app } = require('../server');
const request = require('supertest');
const maintainer = require('../models/maintainer.model');
test('database should be working Create/Read', async () => {
    await maintainer.deleteMany({});
    let Maintainer = new maintainer({
        name:{firstName : 'abc', lastName : 'def',},
        email: 'ijk@w.com',
        password: 'password',
    });
    await Maintainer.save();
    let result = await maintainer.findOne({ email: 'ijk@w.com' });
    expect(result.email).toBe('ijk@w.com');
});

test('database should be working Update', async () => {
    await maintainer.updateOne({ email: 'ijk@w.com' }, { $set: { "email": 'ij@w.com' } });
    let result = await maintainer.findOne({ email: 'ij@w.com' });
    expect(result.email).toBe('ij@w.com');
});

test('database should be working (Delete)', async () => {
    await maintainer.deleteOne({ email: 'ij@w.com' });
    let result = await maintainer.findOne({ email: 'ij@w.com' });
    expect(result).toBe(null);
});