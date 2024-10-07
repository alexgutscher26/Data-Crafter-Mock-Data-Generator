# Mock Data Generator

## Table of Contents

- [Mock Data Generator](#mock-data-generator)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Reporting Issues](#reporting-issues)
  - [Thank You!](#thank-you)

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

Example Schema File

```sh
(schema.json)
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

## Contributing

We welcome contributions from everyone! Whether you’re a seasoned developer or just starting, your input can help us improve this project.

**Guidelines Code Style**: Please follow the existing code style and conventions used in the project. If applicable, run tests to ensure your changes do not break existing functionality.

**Documentation**: If your changes introduce new features, please update the Readme accordingly. Clear documentation helps users understand how to use the new features.

**Issue Tracking**: Before starting work on a new feature or bug fix, check the existing issues to see if someone else is already working on it. If you want to work on an unclaimed issue, consider commenting on it to express your interest.

**Respect the Community**: Be respectful and considerate of other contributors. We strive to maintain a friendly and inclusive environment.

## Reporting Issues

If you encounter any bugs or have feature requests, please create a new issue in the issue tracker. Provide as much detail as possible to help us understand and address the problem effectively.

## Thank You!

Thank you for considering contributing to our project! Every contribution helps us improve and grow. We appreciate your time and effort!