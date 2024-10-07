# Mock Data Generator

## Table of Contents

- [Mock Data Generator](#mock-data-generator)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
  - [Installation](#installation)
  - [Usage](#usage)

## About the Project

A simple npm package to generate mock data for testing purposes. It supports generating various types of mock data such as users, products, addresses, transactions, reviews, and orders.

## Installation

1. **Clone the repository:**

```sh
git clone https://github.com/alexgutscher26/Data-Crafter-Mock-Data-Generator
 ```

2. **Install:**

```sh
npm i data-crafter
```

3. **Install as Local Package:**

If you want to use it as a local package for testing or development purposes, you can install it from a relative path:

```sh
npm install ../path/to/data-crafter
```

## Usage

1. Generate Mock Users

```sh
Command: generate:user
```

Options:

```sh
--count (optional): Number of users to generate (default is 1).
--locale (optional): Locale for the generated data (default is 'en').
--output (optional): File path to export the generated data as a JSON file.
```

Example Usage:

```sh
node src/cli.js generate:user --count 5 --locale de --output users.json
```

2. Generate Custom Schema Data

```sh
Command: generate:custom
```

Options:

```sh
--schema (required): Path to a schema JSON file that defines the data structure.
--count (optional): Number of data items to generate (default is 1).
--locale (optional): Locale for the generated data (default is 'en').
--output (optional): File path to export the generated data as a JSON file.
```

Example Usage:

```sh
node src/cli.js generate:custom --schema ./schema.json --count 10 --output custom_data.json
```

```sh
Example Schema File (schema.json)
```

Here's an example of how a schema JSON file might look:

```sh
{
    "username": {"type": "string", "length": 10},
    "age": {"type": "integer", "min": 18, "max": 99},
    "email": {"type": "email"},
    "isActive": {"type": "boolean"},
    "createdAt": {"type": "date", "min": "2000-01-01", "max": "2022-12-31"}
}

```