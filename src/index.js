// src/index.js
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
const { parse: json2csv } = require('json2csv');
const xmlbuilder = require('xmlbuilder');

// Set locale for faker
function setLocale(locale) {
    faker.setLocale(locale);
}

// Set seed for reproducibility
function setSeed(seed) {
    if (seed) {
        faker.seed(seed);
    }
}

// Helper function to generate relationships
function generateDataWithRelationships(userCount, orderCount) {
    const users = generateMockUser(userCount);
    const orders = [];

    for (let i = 0; i < orderCount; i++) {
        const userId = faker.helpers.arrayElement(users).id;
        orders.push({
            id: faker.string.uuid(),
            userId,
            productList: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.string.uuid()),
            totalAmount: faker.finance.amount(),
            orderDate: faker.date.past(),
            deliveryDate: faker.date.future(),
        });
    }

    return { users, orders };
}

// Helper function to generate string values
function generateString(fieldSchema) {
    if (fieldSchema.pattern) {
        return faker.helpers.replaceSymbols(fieldSchema.pattern);
    } else if (fieldSchema.length) {
        return faker.string.alpha({ length: fieldSchema.length });
    } else {
        return faker.string.alpha();
    }
}

// Helper function to generate number values (integers and floats)
function generateNumber(fieldSchema) {
    const min = fieldSchema.min ?? 0;
    const max = fieldSchema.max ?? 100;

    if (fieldSchema.float) {
        return faker.number.float({ min, max, precision: fieldSchema.precision || 0.01 });
    } else {
        return faker.number.int({ min, max });
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
    return faker.date.between({ from: minDate, to: maxDate });
}

// Helper function to generate email values
function generateEmail() {
    return faker.internet.email();
}

// Helper function to generate phone number values
function generatePhoneNumber() {
    return faker.phone.number();
}

// Helper function to generate address values
function generateAddress() {
    return {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode(),
    };
}

// Helper function to generate user-generated content (e.g., sentences, paragraphs)
function generateUserContent(fieldSchema) {
    switch (fieldSchema.format) {
        case 'sentence':
            return faker.lorem.sentence();
        case 'paragraph':
            return faker.lorem.paragraph();
        default:
            return faker.lorem.word();
    }
}

// New data generation methods
function generateCreditCard() {
    return faker.finance.creditCardNumber();
}

function generateCompany() {
    return {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.bs()
    };
}

function generateIP() {
    return faker.internet.ip();
}

function generateURL() {
    return faker.internet.url();
}

function generateCurrency() {
    return {
        code: faker.finance.currencyCode(),
        name: faker.finance.currencyName(),
        symbol: faker.finance.currencySymbol()
    };
}

function generateColor() {
    return faker.color.human();
}

function generateUUID() {
    return faker.string.uuid();
}

function generateImage() {
    return faker.image.imageUrl();
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
                case 'number':
                    value = generateNumber(fieldSchema);
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
                // New data types
                case 'creditCard':
                    value = generateCreditCard();
                    break;
                case 'company':
                    value = generateCompany();
                    break;
                case 'ip':
                    value = generateIP();
                    break;
                case 'url':
                    value = generateURL();
                    break;
                case 'currency':
                    value = generateCurrency();
                    break;
                case 'color':
                    value = generateColor();
                    break;
                case 'uuid':
                    value = generateUUID();
                    break;
                case 'image':
                    value = generateImage();
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

// Updated function to include seeding and relationships
function generateMockUser(count = 1, locale = 'en', seed = null) {
    setLocale(locale);
    setSeed(seed);

    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
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
                    if (typeof item[key] === 'object' && item[key] !== null) {
                        const nestedElement = entry.ele(key);
                        for (const nestedKey in item[key]) {
                            nestedElement.ele(nestedKey, item[key][nestedKey]);
                        }
                    } else {
                        entry.ele(key, String(item[key]));
                    }
                }
            });
            output = root.end({ pretty: true });
            fs.writeFileSync(`${filePath}.xml`, output);
            break;
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}

// Load configuration from .datacraftrc file
function loadConfig() {
    const configPath = path.join(process.cwd(), '.datacraftrc');
    if (fs.existsSync(configPath)) {
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(configContent);
        } catch (error) {
            console.error('Error loading configuration file:', error);
            return null;
        }
    }
    return null;
}

// Validate schema
function validateSchema(schema) {
    // Basic schema validation
    if (!schema || typeof schema !== 'object') {
        return false;
    }

    for (const [field, fieldSchema] of Object.entries(schema)) {
        if (!fieldSchema.type) {
            return false;
        }
        
        const validTypes = [
            'string', 'number', 'boolean', 'date', 'email', 'phone', 'address', 'content',
            'creditCard', 'company', 'ip', 'url', 'currency', 'color', 'uuid', 'image'
        ];
        
        if (!validTypes.includes(fieldSchema.type)) {
            return false;
        }
    }
    
    return true;
}

// Generate data from template
function generateFromTemplate(templateName, count) {
    const config = loadConfig();
    if (!config || !config.templates || !config.templates[templateName]) {
        throw new Error(`Template '${templateName}' not found in configuration`);
    }

    const templatePath = path.join(process.cwd(), config.templates[templateName]);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found: ${templatePath}`);
    }

    try {
        const schemaContent = fs.readFileSync(templatePath, 'utf-8');
        const schema = JSON.parse(schemaContent);
        return generateCustomSchemaData(schema, count);
    } catch (error) {
        throw new Error(`Error loading template '${templateName}': ${error.message}`);
    }
}

// List available templates
function listTemplates() {
    const config = loadConfig();
    if (!config || !config.templates) {
        return [];
    }
    return Object.keys(config.templates);
}

module.exports = {
    generateMockUser,
    generateCustomSchemaData,
    exportData,
    generateDataWithRelationships,
    loadConfig,
    validateSchema,
    generateFromTemplate,
    listTemplates
};