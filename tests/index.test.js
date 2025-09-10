// tests/index.test.js
const { 
    generateMockUser, 
    generateCustomSchemaData,
    exportData,
    loadConfig,
    validateSchema,
    generateFromTemplate,
    listTemplates
} = require('../src/index');
const fs = require('fs');
const path = require('path');

describe('Mock Data Generator Tests', () => {
    // Cleanup exported files after tests
    afterAll(() => {
        const files = ['output.json', 'output.csv', 'output.xml'];
        files.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    });

    // Test to generate a single mock user
    test('generates one mock user', () => {
        const users = generateMockUser(1);
        expect(users.length).toBe(1);
        expect(users[0]).toHaveProperty('name');
        expect(users[0]).toHaveProperty('email');
    });

    // Test to generate localized mock user data (e.g., German locale)
    test('generates mock users with German localization', () => {
        const users = generateMockUser(3, 'de');
        expect(users.length).toBe(3);
        users.forEach((user) => {
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('phone');
            expect(user).toHaveProperty('address');
        });
    });

    // Test to generate custom schema data with types and constraints
    test('generates custom schema data with specific types and constraints', () => {
        const userSchema = {
            id: { type: 'string', pattern: '####-####-####' },  // Custom pattern
            username: { type: 'string', length: 8 },            // String of length 8
            age: { type: 'integer', min: 18, max: 99 },         // Integer between 18 and 99
            salary: { type: 'float', min: 30000, max: 150000, precision: 0.01 },  // Float with precision
            isActive: { type: 'boolean' },                     // Boolean value
            birthDate: { type: 'date', min: '1990-01-01', max: '2030-12-31' },  // Date within range
            email: { type: 'email' },                          // Email value
            phone: { type: 'phone' },                          // Phone number
            address: { type: 'address' },                      // Address object
            bio: { type: 'content', format: 'paragraph' },     // User-generated content
        };

        const customData = generateCustomSchemaData(userSchema, 3);
        expect(customData.length).toBe(3);

        customData.forEach((item) => {
            expect(item).toHaveProperty('id');
            expect(item.id).toMatch(/^\d{4}-\d{4}-\d{4}$/);  // Verify pattern

            expect(item).toHaveProperty('username');
            expect(item.username.length).toBe(8);  // Verify length

            expect(item).toHaveProperty('age');
            expect(typeof item.age).toBe('number');
            expect(item.age).toBeGreaterThanOrEqual(18);
            expect(item.age).toBeLessThanOrEqual(99);

            expect(item).toHaveProperty('salary');
            expect(typeof item.salary).toBe('number');
            expect(item.salary).toBeGreaterThanOrEqual(30000);
            expect(item.salary).toBeLessThanOrEqual(150000);

            expect(item).toHaveProperty('isActive');
            expect(typeof item.isActive).toBe('boolean');

            expect(item).toHaveProperty('birthDate');
            const birthDate = new Date(item.birthDate);
            expect(birthDate.getTime()).toBeGreaterThanOrEqual(new Date('1990-01-01').getTime());
            expect(birthDate.getTime()).toBeLessThanOrEqual(new Date('2030-12-31').getTime());

            expect(item).toHaveProperty('email');
            expect(item.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

            expect(item).toHaveProperty('phone');
            expect(typeof item.phone).toBe('string');

            expect(item).toHaveProperty('address');
            expect(item.address).toHaveProperty('street');
            expect(item.address).toHaveProperty('city');
            expect(item.address).toHaveProperty('country');
            expect(item.address).toHaveProperty('zipCode');

            expect(item).toHaveProperty('bio');
            expect(typeof item.bio).toBe('string');
        });
    });

    // Test exporting data in JSON format
    test('exports data in JSON format', () => {
        const data = generateMockUser(2);
        exportData(data, 'json', 'output');
        const fileExists = fs.existsSync('output.json');
        expect(fileExists).toBe(true);

        const jsonData = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
        expect(jsonData.length).toBe(2);
    });

    // Test exporting data in CSV format
    test('exports data in CSV format', () => {
        const data = generateMockUser(2);
        exportData(data, 'csv', 'output');
        const fileExists = fs.existsSync('output.csv');
        expect(fileExists).toBe(true);

        const csvData = fs.readFileSync('output.csv', 'utf-8');
        expect(csvData).toContain('"id","name","email","phone","address"');  // Verify CSV headers with quotes
    });

    // Test exporting data in XML format
    test('exports data in XML format', () => {
        const data = generateMockUser(2);
        exportData(data, 'xml', 'output');
        const fileExists = fs.existsSync('output.xml');
        expect(fileExists).toBe(true);

        const xmlData = fs.readFileSync('output.xml', 'utf-8');
        expect(xmlData).toContain('<?xml');  // Verify that XML header exists
        expect(xmlData).toContain('<entry>'); // Verify that data is structured as XML
    });

    // Test schema validation
    test('validates schema correctly', () => {
        const validSchema = {
            name: { type: 'string' },
            age: { type: 'integer' },
            email: { type: 'email' }
        };

        const invalidSchema = {
            name: { type: 'string' },
            age: { type: 'invalidtype' }
        };

        expect(validateSchema(validSchema)).toBe(true);
        expect(validateSchema(invalidSchema)).toBe(false);
    });

    // Test new data types
    test('generates new data types', () => {
        const schema = {
            creditCard: { type: 'creditCard' },
            company: { type: 'company' },
            ip: { type: 'ip' },
            url: { type: 'url' },
            currency: { type: 'currency' },
            color: { type: 'color' },
            uuid: { type: 'uuid' },
            image: { type: 'image' }
        };

        const data = generateCustomSchemaData(schema, 1);
        expect(data.length).toBe(1);

        const item = data[0];
        expect(item).toHaveProperty('creditCard');
        expect(item).toHaveProperty('company');
        expect(item).toHaveProperty('ip');
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('currency');
        expect(item).toHaveProperty('color');
        expect(item).toHaveProperty('uuid');
        expect(item).toHaveProperty('image');
    });
});