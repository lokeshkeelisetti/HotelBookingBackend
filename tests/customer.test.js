const { app } = require('../server');
const request = require('supertest');
const customer = require('../models/customer.model');
test('database should be working Create/Read', async () => {
    await customer.deleteMany({});
    let Customer = new customer({
        name:{firstName : 'abc', lastName : 'def',},
        email: 'abc@w.com',
        password: 'password',
    });
    await Customer.save();
    let result = await customer.findOne({ email: 'abc@w.com' });
    expect(result.email).toBe('abc@w.com');
});

test('database should be working Update', async () => {
    await customer.updateOne({ email: 'abc@w.com' }, { $set: { "email": 'ab@w.com' } });
    let result = await customer.findOne({ email: 'ab@w.com' });
    expect(result.email).toBe('ab@w.com');
})

test('database should be working (Delete)', async () => {
    await customer.deleteOne({ email: 'ab@d.com' });
    let result = await customer.findOne({ email: 'ab@d.com' });
    expect(result).toBe(null);
})
