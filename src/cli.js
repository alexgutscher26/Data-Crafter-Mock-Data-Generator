// src/cli.js
const { DataGenerator } = require('../dist/index');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

// Command-line interface using yargs
yargs
    .scriptName('mock-data-generator')
    .usage('$0 <cmd> [args]')
    .command(
        'generate:user',
        'Generate mock user data',
        (yargs) => {
            yargs.option('count', {
                type: 'number',
                describe: 'Number of users to generate',
                default: 1,
            });
            yargs.option('locale', {
                type: 'string',
                describe: 'Locale for user data',
                default: 'en',
            });
            yargs.option('output', {
                type: 'string',
                describe: 'Output file path',
            });
        },
        (argv) => {
            const generator = new DataGenerator({ locale: argv.locale });
            const users = generator.generate({
                id: { type: 'uuid' },
                name: { type: 'string' },
                email: { type: 'email' },
                phone: { type: 'phone' },
                address: { type: 'address' }
            }, argv.count);
            
            if (argv.output) {
                const filePath = path.resolve(argv.output);
                const data = generator.exportData(users, 'json');
                fs.writeFileSync(filePath, data);
                console.log(`User data exported to ${filePath}`);
            } else {
                console.log(JSON.stringify(users, null, 2));
            }
        }
    )
    .command(
        'generate:custom',
        'Generate custom schema data',
        (yargs) => {
            yargs.option('schema', {
                type: 'string',
                describe: 'Path to schema JSON file',
                demandOption: true,
            });
            yargs.option('count', {
                type: 'number',
                describe: 'Number of data items to generate',
                default: 1,
            });
            yargs.option('locale', {
                type: 'string',
                describe: 'Locale for data',
                default: 'en',
            });
            yargs.option('output', {
                type: 'string',
                describe: 'Output file path',
            });
            yargs.option('format', {
                type: 'string',
                describe: 'Output format (json, csv, xml)',
                default: 'json',
                choices: ['json', 'csv', 'xml']
            });
        },
        (argv) => {
            try {
                const schemaPath = path.resolve(argv.schema);
                
                // Check if schema file exists
                if (!fs.existsSync(schemaPath)) {
                    throw new Error(`Schema file not found at ${schemaPath}`);
                }

                const schema = require(schemaPath);
                const generator = new DataGenerator({ locale: argv.locale });
                
                // Validate schema
                if (!generator.validateSchema(schema)) {
                    throw new Error('Invalid schema format');
                }
                
                const data = generator.generate(schema, argv.count);
                
                if (argv.output) {
                    const filePath = path.resolve(argv.output);
                    const exportedData = generator.exportData(data, argv.format);
                    fs.writeFileSync(filePath, exportedData);
                    console.log(`Custom data exported to ${filePath}`);
                } else {
                    if (argv.format === 'json') {
                        console.log(JSON.stringify(data, null, 2));
                    } else {
                        console.log(generator.exportData(data, argv.format));
                    }
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    )
    .command(
        'generate:template',
        'Generate data from predefined templates',
        (yargs) => {
            yargs.option('template', {
                type: 'string',
                describe: 'Template name to use',
                demandOption: true,
            });
            yargs.option('count', {
                type: 'number',
                describe: 'Number of data items to generate',
                default: 1,
            });
            yargs.option('locale', {
                type: 'string',
                describe: 'Locale for data',
                default: 'en',
            });
            yargs.option('output', {
                type: 'string',
                describe: 'Output file path',
            });
            yargs.option('format', {
                type: 'string',
                describe: 'Output format (json, csv, xml)',
                default: 'json',
                choices: ['json', 'csv', 'xml']
            });
        },
        (argv) => {
            try {
                const generator = new DataGenerator({ locale: argv.locale });
                const data = generator.generateFromTemplate(argv.template, argv.count);
                
                if (argv.output) {
                    const filePath = path.resolve(argv.output);
                    const exportedData = generator.exportData(data, argv.format);
                    fs.writeFileSync(filePath, exportedData);
                    console.log(`Template data exported to ${filePath}`);
                } else {
                    if (argv.format === 'json') {
                        console.log(JSON.stringify(data, null, 2));
                    } else {
                        console.log(generator.exportData(data, argv.format));
                    }
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    )
    .command(
        'list:templates',
        'List available templates',
        () => {},
        (argv) => {
            try {
                const generator = new DataGenerator();
                const templates = generator.listTemplates();
                
                if (templates.length === 0) {
                    console.log('No templates found.');
                } else {
                    console.log('Available templates:');
                    templates.forEach(template => console.log(`- ${template}`));
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    )
    .command(
        'init',
        'Initialize configuration file',
        () => {},
        (argv) => {
            const configPath = path.join(process.cwd(), '.datacraftrc');
            if (fs.existsSync(configPath)) {
                console.log('Configuration file already exists.');
                return;
            }
            
            const defaultConfig = {
                locale: 'en',
                defaultFormat: 'json',
                outputDir: './data',
                templates: {
                    user: './templates/user.json',
                    product: './templates/product.json'
                }
            };
            
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
            console.log('Configuration file created at .datacraftrc');
            
            // Create templates directory and sample templates
            const templatesDir = path.join(process.cwd(), 'templates');
            if (!fs.existsSync(templatesDir)) {
                fs.mkdirSync(templatesDir);
            }
            
            // Create sample user template
            const userTemplate = {
                id: { type: 'uuid' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'email' },
                phone: { type: 'phone' },
                address: { type: 'address' },
                createdAt: { type: 'date' }
            };
            
            fs.writeFileSync(path.join(templatesDir, 'user.json'), JSON.stringify(userTemplate, null, 2));
            
            // Create sample product template
            const productTemplate = {
                id: { type: 'uuid' },
                name: { type: 'string' },
                price: { type: 'number', min: 10, max: 1000 },
                description: { type: 'content', format: 'sentence' },
                category: { type: 'string' },
                inStock: { type: 'boolean' },
                createdAt: { type: 'date' }
            };
            
            fs.writeFileSync(path.join(templatesDir, 'product.json'), JSON.stringify(productTemplate, null, 2));
            
            console.log('Sample templates created in templates/ directory');
        }
    )
    .command(
        'validate:schema',
        'Validate a schema file',
        (yargs) => {
            yargs.option('schema', {
                type: 'string',
                describe: 'Path to schema JSON file',
                demandOption: true,
            });
        },
        (argv) => {
            try {
                const schemaPath = path.resolve(argv.schema);
                
                // Check if schema file exists
                if (!fs.existsSync(schemaPath)) {
                    throw new Error(`Schema file not found at ${schemaPath}`);
                }

                const schema = require(schemaPath);
                const generator = new DataGenerator();
                
                if (generator.validateSchema(schema)) {
                    console.log('Schema is valid.');
                } else {
                    console.log('Schema is invalid.');
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    )
    .help()
    .argv;