"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataGenerator = void 0;
const faker_1 = require("@faker-js/faker");
const xmlbuilder = require("xmlbuilder");
const json2csv = __importStar(require("json2csv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DataGenerator {
    constructor(options = {}) {
        this.seed = options.seed;
        this.locale = options.locale || 'en';
        // For now, we'll use the default faker instance and set the locale
        this.fakerInstance = faker_1.faker;
        if (this.seed) {
            this.fakerInstance.seed(this.seed);
        }
    }
    setLocale(locale) {
        this.locale = locale;
        // In the newer version of faker, we can't change the locale of an existing instance
        // We'll need to create a new approach for locale handling
        console.warn('Locale setting is not fully supported in this version. Using default locale.');
    }
    setSeed(seed) {
        this.seed = seed;
        this.fakerInstance.seed(seed);
    }
    generateString(fieldSchema) {
        if (fieldSchema.pattern) {
            return this.fakerInstance.helpers.replaceSymbols(fieldSchema.pattern);
        }
        else if (fieldSchema.length) {
            return this.fakerInstance.string.alpha({ length: fieldSchema.length });
        }
        else {
            return this.fakerInstance.string.alpha();
        }
    }
    generateNumber(fieldSchema) {
        const min = fieldSchema.min ?? 0;
        const max = fieldSchema.max ?? 100;
        if (fieldSchema.float) {
            return this.fakerInstance.number.float({ min, max, precision: fieldSchema.precision || 0.01 });
        }
        else {
            return this.fakerInstance.number.int({ min, max });
        }
    }
    generateBoolean() {
        return this.fakerInstance.datatype.boolean();
    }
    generateDate(fieldSchema) {
        const minDate = fieldSchema.min ? new Date(fieldSchema.min) : new Date(2000, 0, 1);
        const maxDate = fieldSchema.max ? new Date(fieldSchema.max) : new Date();
        return this.fakerInstance.date.between({ from: minDate, to: maxDate }).toISOString();
    }
    generateEmail() {
        return this.fakerInstance.internet.email();
    }
    generatePhoneNumber() {
        return this.fakerInstance.phone.number();
    }
    generateAddress() {
        return {
            street: this.fakerInstance.location.streetAddress(),
            city: this.fakerInstance.location.city(),
            country: this.fakerInstance.location.country(),
            zipCode: this.fakerInstance.location.zipCode()
        };
    }
    generateUserContent(fieldSchema) {
        switch (fieldSchema.format) {
            case 'sentence':
                return this.fakerInstance.lorem.sentence();
            case 'paragraph':
                return this.fakerInstance.lorem.paragraph();
            default:
                throw new Error('Invalid content format');
        }
    }
    // New data generation methods
    generateCreditCard() {
        return this.fakerInstance.finance.creditCardNumber();
    }
    generateCompany() {
        return {
            name: this.fakerInstance.company.name(),
            catchPhrase: this.fakerInstance.company.catchPhrase(),
            bs: this.fakerInstance.company.bs()
        };
    }
    generateIP() {
        return this.fakerInstance.internet.ip();
    }
    generateURL() {
        return this.fakerInstance.internet.url();
    }
    generateCurrency() {
        return {
            code: this.fakerInstance.finance.currencyCode(),
            name: this.fakerInstance.finance.currencyName(),
            symbol: this.fakerInstance.finance.currencySymbol()
        };
    }
    generateColor() {
        return this.fakerInstance.color.human();
    }
    generateUUID() {
        return this.fakerInstance.string.uuid();
    }
    generateImage() {
        return this.fakerInstance.image.imageUrl();
    }
    generate(schema, count = 1) {
        const results = [];
        for (let i = 0; i < count; i++) {
            const record = {};
            for (const [field, fieldSchema] of Object.entries(schema)) {
                // Map legacy types to new types
                let fieldType = fieldSchema.type;
                if (fieldType === 'integer' || fieldType === 'float') {
                    fieldType = 'number';
                }
                switch (fieldType) {
                    case 'string':
                        record[field] = this.generateString(fieldSchema);
                        break;
                    case 'number':
                        record[field] = this.generateNumber(fieldSchema);
                        break;
                    case 'boolean':
                        record[field] = this.generateBoolean();
                        break;
                    case 'date':
                        record[field] = this.generateDate(fieldSchema);
                        break;
                    case 'email':
                        record[field] = this.generateEmail();
                        break;
                    case 'phone':
                        record[field] = this.generatePhoneNumber();
                        break;
                    case 'address':
                        record[field] = this.generateAddress();
                        break;
                    case 'content':
                        record[field] = this.generateUserContent(fieldSchema);
                        break;
                    // New data types
                    case 'creditCard':
                        record[field] = this.generateCreditCard();
                        break;
                    case 'company':
                        record[field] = this.generateCompany();
                        break;
                    case 'ip':
                        record[field] = this.generateIP();
                        break;
                    case 'url':
                        record[field] = this.generateURL();
                        break;
                    case 'currency':
                        record[field] = this.generateCurrency();
                        break;
                    case 'color':
                        record[field] = this.generateColor();
                        break;
                    case 'uuid':
                        record[field] = this.generateUUID();
                        break;
                    case 'image':
                        record[field] = this.generateImage();
                        break;
                    default:
                        throw new Error(`Unsupported field type: ${fieldSchema.type}`);
                }
            }
            results.push(record);
        }
        return results;
    }
    generateWithRelationships(userSchema, orderSchema, userCount, orderCount) {
        const users = this.generate(userSchema, userCount);
        const orders = [];
        for (let i = 0; i < orderCount; i++) {
            const userId = this.fakerInstance.helpers.arrayElement(users).id;
            const order = this.generate(orderSchema, 1)[0];
            order.userId = userId;
            orders.push(order);
        }
        return { users, orders };
    }
    exportData(data, format) {
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return json2csv.parse(data, { fields: Object.keys(data[0]) });
            case 'xml':
                const root = xmlbuilder.create('data');
                data.forEach(item => {
                    const element = root.ele('record');
                    Object.entries(item).forEach(([key, value]) => {
                        if (typeof value === 'object' && value !== null) {
                            const nestedElement = element.ele(key);
                            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                                nestedElement.ele(nestedKey).txt(String(nestedValue));
                            });
                        }
                        else {
                            element.ele(key).txt(String(value));
                        }
                    });
                });
                return root.end({ pretty: true });
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
    // New methods for configuration and templates
    loadConfig() {
        const configPath = path.join(process.cwd(), '.datacraftrc');
        if (fs.existsSync(configPath)) {
            try {
                const configContent = fs.readFileSync(configPath, 'utf-8');
                return JSON.parse(configContent);
            }
            catch (error) {
                console.error('Error loading configuration file:', error);
                return null;
            }
        }
        return null;
    }
    validateSchema(schema) {
        // Basic schema validation
        if (!schema || typeof schema !== 'object') {
            return false;
        }
        for (const [field, fieldSchema] of Object.entries(schema)) {
            if (!fieldSchema.type) {
                return false;
            }
            // Map legacy types to new types
            let fieldType = fieldSchema.type;
            if (fieldType === 'integer' || fieldType === 'float') {
                fieldType = 'number';
            }
            const validTypes = [
                'string', 'number', 'boolean', 'date', 'email', 'phone', 'address', 'content',
                'creditCard', 'company', 'ip', 'url', 'currency', 'color', 'uuid', 'image'
            ];
            if (!validTypes.includes(fieldType)) {
                return false;
            }
        }
        return true;
    }
    generateFromTemplate(templateName, count) {
        const config = this.loadConfig();
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
            return this.generate(schema, count);
        }
        catch (error) {
            throw new Error(`Error loading template '${templateName}': ${error.message}`);
        }
    }
    listTemplates() {
        const config = this.loadConfig();
        if (!config || !config.templates) {
            return [];
        }
        return Object.keys(config.templates);
    }
}
exports.DataGenerator = DataGenerator;
