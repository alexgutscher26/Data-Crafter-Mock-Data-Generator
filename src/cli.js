// src/cli.js
const { generateMockUser, generateCustomSchemaData, exportData } = require('./index');
const yargs = require('yargs');
const path = require('path');

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
            const users = generateMockUser(argv.count, argv.locale);
            if (argv.output) {
                const filePath = path.resolve(argv.output);
                exportData(users, 'json', filePath);
                console.log(`User data exported to ${filePath}.json`);
            } else {
                console.log(users);
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
        },
        (argv) => {
            const schema = require(path.resolve(argv.schema));
            const data = generateCustomSchemaData(schema, argv.count, argv.locale);
            if (argv.output) {
                const filePath = path.resolve(argv.output);
                exportData(data, 'json', filePath);
                console.log(`Custom data exported to ${filePath}.json`);
            } else {
                console.log(data);
            }
        }
    )
    .help()
    .argv;
