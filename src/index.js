// src/index.js
const faker = require('faker');
const fs = require('fs');
const json2csv = require('json2csv').parse;
const xmlbuilder = require('xmlbuilder');

// Set locale for faker
function setLocale(locale) {
    faker.locale = locale;
}

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

// Helper function to generate number values (integers and floats)
function generateNumber(fieldSchema) {
    const min = fieldSchema.min ?? 0;
    const max = fieldSchema.max ?? 100;

    if (fieldSchema.float) {
        return faker.datatype.float({ min, max, precision: fieldSchema.precision || 0.01 });
    } else {
        return faker.datatype.number({ min, max });
    }
}

// Helper function to generate boolean values
function generateBoolean() {
    return faker.datatype.boolean();
}

// Helper function to generate date values
function generateDate(fieldSchema) {
    const minDate = fieldSchema.min ? new Date(fieldSchema.min) : new Date(2000, 0, 1);
    const maxDate = fieldSchema.max ? new Date(fieldSchema.max) : new Date();
    return faker.date.between(minDate, maxDate);
}

// Helper function to generate email values
function generateEmail() {
    return faker.internet.email();
}

// Helper function to generate phone number values
function generatePhoneNumber() {
    return faker.phone.phoneNumber();
}

// Helper function to generate address values
function generateAddress() {
    return {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        country: faker.address.country(),
        zipCode: faker.address.zipCode(),
    };
}

// Helper function to generate user-generated content (e.g., sentences, paragraphs)
function generateUserContent(fieldSchema) {
    switch (fieldSchema.format) {
        case 'sentence':
            return faker.lorem.sentence();
        case 'paragraph':
            return faker.lorem.paragraph();
        case 'word':
        default:
            return faker.lorem.word();
    }
}

// A function to generate data based on a user-defined schema with localization support
function generateCustomSchemaData(schema, count = 1, locale = 'en') {
    setLocale(locale);
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
                case 'integer':
                    value = generateNumber({ ...fieldSchema, float: false });
                    break;
                case 'float':
                    value = generateNumber({ ...fieldSchema, float: true });
                    break;
                case 'boolean':
                    value = generateBoolean();
                    break;
                case 'date':
                    value = generateDate(fieldSchema);
                    break;
                case 'email':
                    value = generateEmail();
                    break;
                case 'phone':
                    value = generatePhoneNumber();
                    break;
                case 'address':
                    value = generateAddress();
                    break;
                case 'content':
                    value = generateUserContent(fieldSchema);
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

// A function to generate mock user data with localization support
function generateMockUser(count = 1, locale = 'en') {
    setLocale(locale);
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

// Export generated data to different formats
function exportData(data, format = 'json', filePath = 'output') {
    let output;
    switch (format) {
        case 'json':
            output = JSON.stringify(data, null, 2);
            fs.writeFileSync(`${filePath}.json`, output);
            break;
        case 'csv':
            output = json2csv(data);
            fs.writeFileSync(`${filePath}.csv`, output);
            break;
        case 'xml':
            const root = xmlbuilder.create('root');
            data.forEach(item => {
                const entry = root.ele('entry');
                for (const key in item) {
                    entry.ele(key, item[key]);
                }
            });
            output = root.end({ pretty: true });
            fs.writeFileSync(`${filePath}.xml`, output);
            break;
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}

module.exports = {
    generateMockUser,
    generateCustomSchemaData,
    exportData,
};
