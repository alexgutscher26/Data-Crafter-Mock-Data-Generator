import { DataSchema } from './types';
export declare class DataGenerator {
    private seed;
    private locale;
    private readonly fakerInstance;
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
    generate(schema: DataSchema, count?: number): Record<string, any>[];
    generateWithRelationships(userSchema: DataSchema, orderSchema: DataSchema, userCount: number, orderCount: number): {
        users: Record<string, any>[];
        orders: Record<string, any>[];
    };
    exportData(data: Record<string, any>[], format: 'json' | 'csv' | 'xml'): string;
}
