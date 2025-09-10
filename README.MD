# Mock Data Generator

[![npm version](https://img.shields.io/npm/v/data-crafter.svg)](https://www.npmjs.com/package/data-crafter)
[![npm downloads](https://img.shields.io/npm/dm/data-crafter.svg)](https://www.npmjs.com/package/data-crafter)
[![License](https://img.shields.io/npm/l/data-crafter.svg)](https://github.com/alexgutscher26/Data-Crafter-Mock-Data-Generator/blob/main/LICENSE)

## Table of Contents

- [Mock Data Generator](#mock-data-generator)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Generate Mock Users](#generate-mock-users)
    - [Generate Custom Schema Data](#generate-custom-schema-data)
    - [Generate Data from Templates](#generate-data-from-templates)
    - [List Available Templates](#list-available-templates)
    - [Initialize Configuration](#initialize-configuration)
    - [Validate Schema](#validate-schema)
  - [Supported Data Types](#supported-data-types)
  - [Configuration](#configuration)
  - [Templates](#templates)
  - [Export Formats](#export-formats)
  - [Contributing](#contributing)
  - [Reporting Issues](#reporting-issues)
  - [Thank You](#thank-you)
  - [License](#license)

## About the Project

A simple **npm package** to generate mock data for testing purposes. It supports generating various types of mock data such as users, products, addresses, transactions, reviews, and orders.

## Installation

1. **Install via npm:**

```sh
npm i data-crafter
```

2. **Clone the repository:**

```sh
git clone https://github.com/alexgutscher26/Data-Crafter-Mock-Data-Generator
cd Data-Crafter-Mock-Data-Generator
npm install
```

3. **Install as Local Package:**

If you want to use it as a local package for testing or development purposes, you can install it from a relative path:

```sh
npm install ../path/to/data-crafter
```

## Usage

All commands follow the pattern: `node src/cli.js <command> [options]`

### Generate Mock Users

Command:
```sh
generate:user
```

Options:

```sh
--count (optional): Number of users to generate (default is 1).
--locale (optional): Locale for the generated data (default is 'en').
--output (optional): File path to export the generated data.
--format (optional): Output format (json, csv, xml) (default is 'json').
```

Example Usage:

```sh
node src/cli.js generate:user --count 5 --locale de --output users.json --format csv
```

### Generate Custom Schema Data

Command:
```sh
generate:custom
```

Options:

```sh
--schema (required): Path to a schema JSON file that defines the data structure.
--count (optional): Number of data items to generate (default is 1).
--locale (optional): Locale for the generated data (default is 'en').
--output (optional): File path to export the generated data.
--format (optional): Output format (json, csv, xml) (default is 'json').
```

Example Usage:

```sh
node src/cli.js generate:custom --schema ./schema.json --count 10 --output custom_data.json --format xml
```

Example Schema File

```json
(schema.json)
```

Here's an example of how a schema JSON file might look:

```json
{
    "username": {"type": "string", "length": 10},
    "age": {"type": "integer", "min": 18, "max": 99},
    "email": {"type": "email"},
    "isActive": {"type": "boolean"},
    "createdAt": {"type": "date", "min": "2000-01-01", "max": "2022-12-31"}
}
```

### Generate Data from Templates

Command:
```sh
generate:template
```

Options:

```sh
--template (required): Template name to use.
--count (optional): Number of data items to generate (default is 1).
--locale (optional): Locale for the generated data (default is 'en').
--output (optional): File path to export the generated data.
--format (optional): Output format (json, csv, xml) (default is 'json').
```

Example Usage:

```sh
node src/cli.js generate:template --template user --count 5 --output users.json --format csv
```

### List Available Templates

Command:
```sh
list:templates
```

Example Usage:

```sh
node src/cli.js list:templates
```

### Initialize Configuration

Command:
```sh
init
```

This command creates a `.datacraftrc` configuration file and sample templates in the `templates/` directory.

Example Usage:

```sh
node src/cli.js init
```

### Validate Schema

Command:
```sh
validate:schema
```

Options:

```sh
--schema (required): Path to a schema JSON file to validate.
```

Example Usage:

```sh
node src/cli.js validate:schema --schema ./schema.json
```

## Supported Data Types

The following data types are supported in schemas:

| Type | Description | Example |
|------|-------------|---------|
| `string` | Random string | "abc123" |
| `number` | Random number | 42 |
| `integer` | Random integer | 42 |
| `float` | Random float | 42.5 |
| `boolean` | Random boolean | true |
| `date` | Random date | "2023-01-01T00:00:00.000Z" |
| `email` | Random email | "<user@example.com>" |
| `phone` | Random phone number | "+1-555-123-4567" |
| `address` | Random address object | `{ street, city, country, zipCode }` |
| `content` | Random content | "Lorem ipsum..." |
| `creditCard` | Random credit card number | "4532-1234-5678-9012" |
| `company` | Random company object | `{ name, catchPhrase, bs }` |
| `ip` | Random IP address | "192.168.1.1" |
| `url` | Random URL | "<https://example.com>" |
| `currency` | Random currency object | `{ code, name, symbol }` |
| `color` | Random color name | "red" |
| `uuid` | Random UUID | "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8" |
| `image` | Random image URL | "<https://loremflickr.com/640/480>" |

## Configuration

The package supports a `.datacraftrc` configuration file in the project root:

```json
{
  "locale": "en",
  "defaultFormat": "json",
  "outputDir": "./data",
  "templates": {
    "user": "./templates/user.json",
    "product": "./templates/product.json"
  }
}
```

## Templates

Templates are predefined schemas stored in JSON files. The package comes with sample templates for users and products.

Example user template:

```json
{
  "id": {
    "type": "uuid"
  },
  "firstName": {
    "type": "string"
  },
  "lastName": {
    "type": "string"
  },
  "email": {
    "type": "email"
  },
  "phone": {
    "type": "phone"
  },
  "address": {
    "type": "address"
  },
  "createdAt": {
    "type": "date"
  }
}
```

## Export Formats

The package supports exporting data in the following formats:

- JSON
- CSV
- XML

## Contributing

We welcome contributions from everyone! Whether you're a seasoned developer or just starting, your input can help us improve this project.

**Guidelines Code Style**: Please follow the existing code style and conventions used in the project. If applicable, run tests to ensure your changes do not break existing functionality.

**Documentation**: If your changes introduce new features, please update the Readme accordingly. Clear documentation helps users understand how to use the new features.

**Issue Tracking**: Before starting work on a new feature or bug fix, check the existing issues to see if someone else is already working on it. If you want to work on an unclaimed issue, consider commenting on it to express your interest.

**Respect the Community**: Be respectful and considerate of other contributors. We strive to maintain a friendly and inclusive environment.

## Reporting Issues

If you encounter any bugs or have feature requests, please create a new issue in the issue tracker. Provide as much detail as possible to help us understand and address the problem effectively.

## Thank You

Thank you for considering contributing to our project! Every contribution helps us improve and grow. We appreciate your time and effort!

<a href="https://www.buymeacoffee.com/gotchacode" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

This project is licensed under the MIT License.
