export interface FieldSchema {
    type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone' | 'address' | 'content' | 'creditCard' | 'company' | 'ip' | 'url' | 'currency' | 'color' | 'uuid' | 'image';
    pattern?: string;
    length?: number;
    min?: number;
    max?: number;
    float?: boolean;
    precision?: number;
    format?: 'sentence' | 'paragraph';
    provider?: string;
    options?: any[];
}
export interface DataSchema {
    [key: string]: FieldSchema;
}
export interface DataGeneratorOptions {
    locale?: string;
    seed?: number;
    count?: number;
    format?: 'json' | 'csv' | 'xml';
}
export interface ConfigSchema {
    locale: string;
    defaultFormat: 'json' | 'csv' | 'xml';
    outputDir: string;
    templates: {
        [key: string]: string;
    };
}
