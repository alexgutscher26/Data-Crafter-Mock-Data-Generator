import { DataSchema, ConfigSchema } from './types';
export declare class DataGenerator {
    private seed;
    private locale;
    private fakerInstance;
    constructor(options?: {
        locale?: string;
        seed?: number;
    });
    setLocale(locale: string): void;
    setSeed(seed: number): void;
    private generateString;
    private generateNumber;
    private generateBoolean;
    private generateDate;
    private generateEmail;
    private generatePhoneNumber;
    private generateAddress;
    private generateUserContent;
    private generateCreditCard;
    private generateCompany;
    private generateIP;
    private generateURL;
    private generateCurrency;
    private generateColor;
    private generateUUID;
    private generateImage;
    generate(schema: DataSchema, count?: number): Record<string, any>[];
    generateWithRelationships(userSchema: DataSchema, orderSchema: DataSchema, userCount: number, orderCount: number): {
        users: Record<string, any>[];
        orders: Record<string, any>[];
    };
    exportData(data: Record<string, any>[], format: 'json' | 'csv' | 'xml'): string;
    loadConfig(): ConfigSchema | null;
    validateSchema(schema: DataSchema): boolean;
    generateFromTemplate(templateName: string, count: number): Record<string, any>[];
    listTemplates(): string[];
}
