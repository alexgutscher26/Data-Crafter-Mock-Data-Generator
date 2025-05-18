import { faker } from '@faker-js/faker';
import xmlbuilder = require('xmlbuilder');
import { FieldSchema, DataSchema } from './types';
import * as json2csv from 'json2csv';

export class DataGenerator {
    private seed: number | undefined;
    private locale: string;
    private readonly fakerInstance: any;

    constructor(options: { locale?: string; seed?: number } = {}) {
        this.seed = options.seed;
        this.locale = options.locale || 'en';
        this.fakerInstance = faker;
        this.fakerInstance.setLocale(this.locale);
    }

    public setLocale(locale: string): void {
        this.locale = locale;
        this.fakerInstance.setLocale(locale);
    }

    public setSeed(seed: number): void {
        this.seed = seed;
        faker.seed(seed);
    }

    private generateString(fieldSchema: FieldSchema): string {
        if (fieldSchema.pattern) {
            return faker.helpers.replaceSymbols(fieldSchema.pattern);
        } else if (fieldSchema.length) {
            return faker.string.alpha({ length: fieldSchema.length });
        } else {
            return faker.string.alpha();
        }
    }

    private generateNumber(fieldSchema: FieldSchema): number {
        const min = fieldSchema.min ?? 0;
        const max = fieldSchema.max ?? 100;

        if (fieldSchema.float) {
            return faker.number.float({ min, max, precision: fieldSchema.precision || 0.01 });
        } else {
            return faker.number.int({ min, max });
        }
    }

    private generateBoolean(): boolean {
        return faker.datatype.boolean();
    }

    private generateDate(fieldSchema: FieldSchema): string {
        const minDate = fieldSchema.min ? new Date(fieldSchema.min) : new Date(2000, 0, 1);
        const maxDate = fieldSchema.max ? new Date(fieldSchema.max) : new Date();
        return faker.date.between({ from: minDate, to: maxDate }).toISOString();
    }

    private generateEmail(): string {
        return faker.internet.email();
    }

    private generatePhoneNumber(): string {
        return faker.phone.number();
    }

    private generateAddress(): Record<string, string> {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            zipCode: faker.location.zipCode()
        };
    }

    private generateUserContent(fieldSchema: FieldSchema): string {
        switch (fieldSchema.format) {
            case 'sentence':
                return faker.lorem.sentence();
            case 'paragraph':
                return faker.lorem.paragraph();
            default:
                throw new Error('Invalid content format');
        }
    }

    public generate(schema: DataSchema, count: number = 1): Record<string, any>[] {
        const results: Record<string, any>[] = [];

        for (let i = 0; i < count; i++) {
            const record: Record<string, any> = {};
            
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

    public generateWithRelationships(
        userSchema: DataSchema,
        orderSchema: DataSchema,
        userCount: number,
        orderCount: number
    ): { users: Record<string, any>[]; orders: Record<string, any>[] } {
        const users = this.generate(userSchema, userCount);
        const orders: Record<string, any>[] = [];

        for (let i = 0; i < orderCount; i++) {
            const userId = faker.helpers.arrayElement(users).id;
            const order = this.generate(orderSchema, 1)[0];
            order.userId = userId;
            orders.push(order);
        }

        return { users, orders };
    }

    public exportData(
        data: Record<string, any>[],
        format: 'json' | 'csv' | 'xml'
    ): string {
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
