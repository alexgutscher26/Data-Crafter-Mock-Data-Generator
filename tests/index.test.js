// tests/index.test.js
const { 
    generateMockUser, 
    generateMockProduct, 
    generateMockAddress, 
    generateMockTransaction, 
    generateMockReview, 
    generateMockOrder, 
    generateCustomData 
} = require('../src/index');

// Test to generate a single mock user
test('generates one mock user', () => {
    const users = generateMockUser(1);
    expect(users.length).toBe(1);
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
});

// Test to generate multiple mock products
test('generates multiple mock products', () => {
    const products = generateMockProduct(3);
    expect(products.length).toBe(3);
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
});

// Test to generate multiple mock addresses
test('generates multiple mock addresses', () => {
    const addresses = generateMockAddress(2);
    expect(addresses.length).toBe(2);
    expect(addresses[0]).toHaveProperty('street');
    expect(addresses[0]).toHaveProperty('city');
});

// Test to generate multiple mock transactions
test('generates multiple mock transactions', () => {
    const transactions = generateMockTransaction(2);
    expect(transactions.length).toBe(2);
    expect(transactions[0]).toHaveProperty('userId');
    expect(transactions[0]).toHaveProperty('amount');
});

// Test to generate multiple mock reviews
test('generates multiple mock reviews', () => {
    const reviews = generateMockReview(2);
    expect(reviews.length).toBe(2);
    expect(reviews[0]).toHaveProperty('userId');
    expect(reviews[0]).toHaveProperty('rating');
});

// Test to generate multiple mock orders
test('generates multiple mock orders', () => {
    const orders = generateMockOrder(2);
    expect(orders.length).toBe(2);
    expect(orders[0]).toHaveProperty('userId');
    expect(orders[0]).toHaveProperty('totalAmount');
});

// Test to generate custom mock data based on a schema
test('generates custom data', () => {
    const schema = {
        id: '{{datatype.uuid}}',
        username: '{{internet.userName}}',
        job: '{{name.jobTitle}}',
    };
    const data = generateCustomData(schema, 2);
    expect(data.length).toBe(2);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('username');
    expect(data[0]).toHaveProperty('job');
});
