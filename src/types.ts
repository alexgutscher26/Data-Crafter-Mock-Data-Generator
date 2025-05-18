export interface FieldSchema {
    type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone' | 'address' | 'content';
    pattern?: string;
    length?: number;
    min?: number;
    max?: number;
    float?: boolean;
    precision?: number;
    format?: 'sentence' | 'paragraph';
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
