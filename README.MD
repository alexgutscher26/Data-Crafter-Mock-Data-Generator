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