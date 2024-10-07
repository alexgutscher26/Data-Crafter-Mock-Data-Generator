// src/index.js
const faker = require('faker');

// Helper function to generate string values
function generateString(fieldSchema) {
    if (fieldSchema.pattern) {
        return faker.helpers.replaceSymbols(fieldSchema.pattern);
    } else if (fieldSchema.length) {
        return faker.random.alpha({ count: fieldSchema.length });
    } else {
        return faker.lorem.word();
    }
}

// Helper function to generate number values
function generateNumber(fieldSchema) {
    const min = fieldSchema.min ?? 0;
    const max = fieldSchema.max ?? 100;

    return faker.datatype.number({ min, max });
}

// Helper function to generate date values
function generateDate(fieldSchema) {
    const minDate = fieldSchema.min ? new Date(fieldSchema.min) : new Date(2000, 0, 1);
    const maxDate = fieldSchema.max ? new Date(fieldSchema.max) : new Date();
    
    return faker.date.between(minDate, maxDate);
}

// A function to generate data based on a user-defined schema
function generateCustomSchemaData(schema, count = 1) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        const item = {};
        
        // Iterate over each field defined in the schema
        for (const field in schema) {
            const fieldSchema = schema[field];
            let value;

            switch (fieldSchema.type) {
                case 'string':
                    value = generateString(fieldSchema);
                    break;
                case 'number':
                    value = generateNumber(fieldSchema);
                    break;
                case 'date':
                    value = generateDate(fieldSchema);
                    break;
                default:
                    throw new Error(`Unsupported type: ${fieldSchema.type}`);
            }
            item[field] = value;
        }

        data.push(item);
    }

    return data;
}

// A function to generate mock user data
function generateMockUser(count = 1) {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
        });
    }
    return users;
}

// A function to generate mock product data
function generateMockProduct(count = 1) {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
        });
    }
    return products;
}

// A function to generate mock address data
function generateMockAddress(count = 1) {
    const addresses = [];
    for (let i = 0; i < count; i++) {
        addresses.push({
            id: faker.datatype.uuid(),
            street: faker.address.streetAddress(),
            city: faker.address.city(),
            country: faker.address.country(),
        });
    }
    return addresses;
}

// A function to generate mock transaction data
function generateMockTransaction(count = 1) {
    const transactions = [];
    for (let i = 0; i < count; i++) {
        transactions.push({
            id: faker.datatype.uuid(),
            userId: faker.datatype.uuid(),
            productId: faker.datatype.uuid(),
            amount: faker.finance.amount(),
            date: faker.date.past(),
        });
    }
    return transactions;
}

// A function to generate mock review data
function generateMockReview(count = 1) {
    const reviews = [];
    for (let i = 0; i < count; i++) {
        reviews.push({
            id: faker.datatype.uuid(),
            userId: faker.datatype.uuid(),
            productId: faker.datatype.uuid(),
            rating: faker.datatype.number({ min: 1, max: 5 }),
            comment: faker.lorem.sentence(),
            date: faker.date.past(),
        });
    }
    return reviews;
}

// A function to generate mock order data
function generateMockOrder(count = 1) {
    const orders = [];
    for (let i = 0; i < count; i++) {
        orders.push({
            id: faker.datatype.uuid(),
            userId: faker.datatype.uuid(),
            productList: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => faker.datatype.uuid()),
            totalAmount: faker.finance.amount(),
            orderDate: faker.date.past(),
            deliveryDate: faker.date.future(),
        });
    }
    return orders;
}

// A general-purpose function to generate any kind of mock data
function generateMockData(type, count = 1) {
    switch (type) {
        case 'user':
            return generateMockUser(count);
        case 'product':
            return generateMockProduct(count);
        case 'address':
            return generateMockAddress(count);
        case 'transaction':
            return generateMockTransaction(count);
        case 'review':
            return generateMockReview(count);
        case 'order':
            return generateMockOrder(count);
        default:
            throw new Error('Unsupported data type');
    }
}

// A function to generate custom mock data based on user schema
function generateCustomData(schema, count = 1) {
    const data = [];
    for (let i = 0; i < count; i++) {
        const item = {};
        Object.keys(schema).forEach((key) => {
            item[key] = faker.fake(schema[key]);
        });
        data.push(item);
    }
    return data;
}

module.exports = {
    generateMockUser,
    generateMockProduct,
    generateMockAddress,
    generateMockTransaction,
    generateMockReview,
    generateMockOrder,
    generateMockData,
    generateCustomData,
    generateCustomSchemaData,
};
