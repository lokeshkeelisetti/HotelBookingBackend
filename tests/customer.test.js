const { app } = require('../server');
const request = require('supertest');
const customer = require('../models/customer.model');
test('database should be working Create/Read', async () => {
    await User.deleteMany({});
    let Customer = new customer({
        name:{firstName : 'abc', lastName : 'def',},
        email: 'abc@w.com',
        password: 'password',
    });
    await Customer.save();
    let result = await customer.findOne({ email: 'abc@w.com' });
    expect(result.email).toBe('abc@w.com');
});
