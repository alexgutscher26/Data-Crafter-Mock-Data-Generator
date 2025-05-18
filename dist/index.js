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
class DataGenerator {
    constructor(options = {}) {
        this.seed = options.seed;
        this.locale = options.locale || 'en';
        this.fakerInstance = faker_1.faker;
        this.fakerInstance.setLocale(this.locale);
    }
    setLocale(locale) {
        this.locale = locale;
        this.fakerInstance.setLocale(locale);
    }
    setSeed(seed) {
        this.seed = seed;
        faker_1.faker.seed(seed);
    }
    generateString(fieldSchema) {
        if (fieldSchema.pattern) {
            return faker_1.faker.helpers.replaceSymbols(fieldSchema.pattern);
        }
        else if (fieldSchema.length) {
            return faker_1.faker.string.alpha({ length: fieldSchema.length });
        }
        else {
            return faker_1.faker.string.alpha();
        }
    }
    generateNumber(fieldSchema) {
        const min = fieldSchema.min ?? 0;
        const max = fieldSchema.max ?? 100;
        if (fieldSchema.float) {
            return faker_1.faker.number.float({ min, max, precision: fieldSchema.precision || 0.01 });
        }
        else {
            return faker_1.faker.number.int({ min, max });
        }
    }
    generateBoolean() {
        return faker_1.faker.datatype.boolean();
    }
    generateDate(fieldSchema) {
        const minDate = fieldSchema.min ? new Date(fieldSchema.min) : new Date(2000, 0, 1);
        const maxDate = fieldSchema.max ? new Date(fieldSchema.max) : new Date();
        return faker_1.faker.date.between({ from: minDate, to: maxDate }).toISOString();
    }
    generateEmail() {
        return faker_1.faker.internet.email();
    }
    generatePhoneNumber() {
        return faker_1.faker.phone.number();
    }
    generateAddress() {
        return {
            street: faker_1.faker.location.streetAddress(),
            city: faker_1.faker.location.city(),
            country: faker_1.faker.location.country(),
            zipCode: faker_1.faker.location.zipCode()
        };
    }
    generateUserContent(fieldSchema) {
        switch (fieldSchema.format) {
            case 'sentence':
                return faker_1.faker.lorem.sentence();
            case 'paragraph':
                return faker_1.faker.lorem.paragraph();
            default:
                throw new Error('Invalid content format');
        }
    }
    generate(schema, count = 1) {
        const results = [];
        for (let i = 0; i < count; i++) {
            const record = {};
            for (const [field, fieldSchema] of Object.entries(schema)) {
                switch (fieldSchema.type) {
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
            const userId = faker_1.faker.helpers.arrayElement(users).id;
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
                        element.ele(key).txt(value);
                    });
                });
                return root.end({ pretty: true });
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
}
exports.DataGenerator = DataGenerator;
