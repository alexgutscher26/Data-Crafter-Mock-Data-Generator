import { faker, Faker } from '@faker-js/faker';
import xmlbuilder = require('xmlbuilder');
import { FieldSchema, DataSchema, ConfigSchema } from './types';
import * as json2csv from 'json2csv';
import * as fs from 'fs';
import * as path from 'path';

export class DataGenerator {
    private seed: number | undefined;
    private locale: string;
    private fakerInstance: Faker;

    constructor(options: { locale?: string; seed?: number } = {}) {
        this.seed = options.seed;
        this.locale = options.locale || 'en';
        
        // For now, we'll use the default faker instance and set the locale
        this.fakerInstance = faker;
        
        if (this.seed) {
            this.fakerInstance.seed(this.seed);
        }
    }

    public setLocale(locale: string): void {
        this.locale = locale;
        // In the newer version of faker, we can't change the locale of an existing instance
        // We'll need to create a new approach for locale handling
        console.warn('Locale setting is not fully supported in this version. Using default locale.');
    }

    public setSeed(seed: number): void {
        this.seed = seed;
        this.fakerInstance.seed(seed);
    }

    private generateString(fieldSchema: FieldSchema): string {
        if (fieldSchema.pattern) {
            return this.fakerInstance.helpers.replaceSymbols(fieldSchema.pattern);
        } else if (fieldSchema.length) {
            return this.fakerInstance.string.alpha({ length: fieldSchema.length });
        } else {
            return this.fakerInstance.string.alpha();
        }
    }

    private generateNumber(fieldSchema: FieldSchema): number {
        const min = fieldSchema.min ?? 0;
        const max = fieldSchema.max ?? 100;

        if (fieldSchema.float) {
            return this.fakerInstance.number.float({ min, max, precision: fieldSchema.precision || 0.01 });
        } else {
            return this.fakerInstance.number.int({ min, max });
        }
    }

    private generateBoolean(): boolean {
        return this.fakerInstance.datatype.boolean();
    }

    private generateDate(fieldSchema: FieldSchema): string {
        const minDate = fieldSchema.min ? new Date(fieldSchema.min) : new Date(2000, 0, 1);
        const maxDate = fieldSchema.max ? new Date(fieldSchema.max) : new Date();
        return this.fakerInstance.date.between({ from: minDate, to: maxDate }).toISOString();
    }

    private generateEmail(): string {
        return this.fakerInstance.internet.email();
    }

    private generatePhoneNumber(): string {
        return this.fakerInstance.phone.number();
    }

    private generateAddress(): Record<string, string> {
        return {
            street: this.fakerInstance.location.streetAddress(),
            city: this.fakerInstance.location.city(),
            country: this.fakerInstance.location.country(),
            zipCode: this.fakerInstance.location.zipCode()
        };
    }

    private generateUserContent(fieldSchema: FieldSchema): string {
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
    private generateCreditCard(): string {
        return this.fakerInstance.finance.creditCardNumber();
    }

    private generateCompany(): Record<string, string> {
        return {
            name: this.fakerInstance.company.name(),
            catchPhrase: this.fakerInstance.company.catchPhrase(),
            bs: this.fakerInstance.company.bs()
        };
    }

    private generateIP(): string {
        return this.fakerInstance.internet.ip();
    }

    private generateURL(): string {
        return this.fakerInstance.internet.url();
    }

    private generateCurrency(): Record<string, string | number> {
        return {
            code: this.fakerInstance.finance.currencyCode(),
            name: this.fakerInstance.finance.currencyName(),
            symbol: this.fakerInstance.finance.currencySymbol()
        };
    }

    private generateColor(): string {
        return this.fakerInstance.color.human();
    }

    private generateUUID(): string {
        return this.fakerInstance.string.uuid();
    }

    private generateImage(): string {
        return this.fakerInstance.image.imageUrl();
    }

    public generate(schema: DataSchema, count: number = 1): Record<string, any>[] {
        const results: Record<string, any>[] = [];

        for (let i = 0; i < count; i++) {
            const record: Record<string, any> = {};
            
            for (const [field, fieldSchema] of Object.entries(schema)) {
                // Map legacy types to new types
                let fieldType = fieldSchema.type as string;
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

    public generateWithRelationships(
        userSchema: DataSchema,
        orderSchema: DataSchema,
        userCount: number,
        orderCount: number
    ): { users: Record<string, any>[]; orders: Record<string, any>[] } {
        const users = this.generate(userSchema, userCount);
        const orders: Record<string, any>[] = [];

        for (let i = 0; i < orderCount; i++) {
            const userId = this.fakerInstance.helpers.arrayElement(users).id;
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
                        if (typeof value === 'object' && value !== null) {
                            const nestedElement = element.ele(key);
                            Object.entries(value).forEach(([nestedKey, nestedValue]) => {
                                nestedElement.ele(nestedKey).txt(String(nestedValue));
                            });
                        } else {
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
    public loadConfig(): ConfigSchema | null {
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

    public validateSchema(schema: DataSchema): boolean {
        // Basic schema validation
        if (!schema || typeof schema !== 'object') {
            return false;
        }

        for (const [field, fieldSchema] of Object.entries(schema)) {
            if (!fieldSchema.type) {
                return false;
            }
            
            // Map legacy types to new types
            let fieldType = fieldSchema.type as string;
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

    public generateFromTemplate(templateName: string, count: number): Record<string, any>[] {
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
        } catch (error: any) {
            throw new Error(`Error loading template '${templateName}': ${error.message}`);
        }
    }

    public listTemplates(): string[] {
        const config = this.loadConfig();
        if (!config || !config.templates) {
            return [];
        }
        return Object.keys(config.templates);
    }
}