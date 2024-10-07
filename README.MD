<!-- ⚠️ This README has been generated from the file(s) "blueprint.md" ⚠️-->

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#mock-data-generator)

# ➤ Mock Data Generator

A simple npm package to generate mock data for testing purposes. It supports generating various types of mock data such as users, products, addresses, transactions, reviews, and orders.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)

## ➤ Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing](#importing)
  - [Generating Mock Data](#generating-mock-data)
    - [Generate Mock Users](#generate-mock-users)
    - [Generate Mock Products](#generate-mock-products)
    - [Generate Mock Addresses](#generate-mock-addresses)
    - [Generate Mock Transactions](#generate-mock-transactions)
    - [Generate Mock Reviews](#generate-mock-reviews)
    - [Generate Mock Orders](#generate-mock-orders)
    - [Generate Custom Data](#generate-custom-data)
- [Example Usage in an API](#example-usage-in-an-api)
- [Example Usage in Testing](#example-usage-in-testing)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)
- [Follow-Up Suggestions](#follow-up-suggestions)## Installation

To install the package via npm, use:

```sh
npm install mock-data-generator
```

If you want to use it as a local package for testing or development purposes, you can install it from a relative path:

```sh
npm install ../path/to/mock-data-generator

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#usage)

## ➤ Usage

This package provides several functions for generating different types of mock data. Below are the detailed examples to help you get started.

To use the package, import the functions you need:

```

const {
    generateMockUser,
    generateMockProduct,
    generateMockAddress,
    generateMockTransaction,
    generateMockReview,
    generateMockOrder,
    generateCustomData
} = require('mock-data-generator');

```

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generating-mock-data)

# ➤ Generating-Mock-Data

The following examples show how to generate various types of mock data:


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-mock-users)

## ➤ Generate Mock Users

To generate a single mock user:

```

const user = generateMockUser(1);
console.log(user);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "address": "123 Main St"
  }
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#to-generate-multiple-mock-users)

## ➤ To generate multiple mock users:

```

const users = generateMockUser(5);
console.log(users);

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-mock-products)

## ➤ Generate Mock Products
To generate mock products, each with attributes like name, price, and category:

```

const products = generateMockProduct(3);
console.log(products);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Awesome Widget",
    "price": "19.99",
    "category": "Gadgets"
  },
  ...
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-mock-addresses)

## ➤ Generate Mock Addresses
To generate multiple mock addresses:

```

const addresses = generateMockAddress(4);
console.log(addresses);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "street": "456 Elm St",
    "city": "Springfield",
    "country": "USA"
  },
  ...
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-mock-transactions)

## ➤ Generate Mock Transactions
To generate mock transactions, which can simulate payment or order data:

```

const transactions = generateMockTransaction(2);
console.log(transactions);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "productId": "123e4567-e89b-12d3-a456-426614174001",
    "amount": "150.00",
    "date": "2021-06-21T14:48:00.000Z"
  },
  ...
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-mock-reviews)

## ➤ Generate Mock Reviews
To generate mock reviews, which can be associated with users and products:

```

const reviews = generateMockReview(3);
console.log(reviews);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "productId": "123e4567-e89b-12d3-a456-426614174001",
    "rating": 5,
    "comment": "This product is amazing!",
    "date": "2021-06-21T14:48:00.000Z"
  },
  ...
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-mock-orders)

## ➤ Generate Mock Orders
To generate mock orders, which contain lists of product IDs:

```

const orders = generateMockOrder(2);
console.log(orders);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "productList": ["123e4567-e89b-12d3-a456-426614174001", "123e4567-e89b-12d3-a456-426614174002"],
    "totalAmount": "299.99",
    "orderDate": "2021-06-21T14:48:00.000Z",
    "deliveryDate": "2021-07-01T14:48:00.000Z"
  },
  ...
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#generate-custom-data)

## ➤ Generate Custom Data
You can also generate custom data using a schema that you define:

```

const schema = {
    id: 'datatype.uuid',
    username: 'internet.userName',
    job: 'name.jobTitle',
};
const customData = generateCustomData(schema, 3);
console.log(customData);

```

Example Output:

```

[
  {
    "id": "123e4567-e89b-12d3-a456-426614174006",
    "username": "johndoe92",
    "job": "Software Engineer"
  },
  ...
]

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#example-usage-in-an-api)

## ➤ Example Usage in an API

You can use this package in your Express API to create endpoints that return mock data, which can be useful for frontend development or testing:

```

const express = require('express');
const { generateMockUser, generateMockProduct } = require('mock-data-generator');

const app = express();

app.get('/api/mock-users', (req, res) => {
    const users = generateMockUser(5); // Generates 5 mock users
    res.json(users);
});

app.get('/api/mock-products', (req, res) => {
    const products = generateMockProduct(3); // Generates 3 mock products
    res.json(products);
});

app.listen(3000, () => {
    console.log('Server running at <http://localhost:3000>');
});

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#example-usage-in-testing)

## ➤ Example Usage in Testing

Mock data is also very useful for testing purposes, and you can integrate it easily into your test suite:

```

const { generateMockUser } = require('mock-data-generator');

// Mock function to simulate saving users to a database
function saveUsersToDatabase(users) {
    if (!Array.isArray(users)) {
        throw new Error("Input must be an array");
    }
    // Simulate saving...
    return true;
}

test('should save multiple mock users to database', () => {
    const mockUsers = generateMockUser(5);
    expect(() => saveUsersToDatabase(mockUsers)).not.toThrow();
    expect(saveUsersToDatabase(mockUsers)).toBe(true);
});

```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#running-tests)

## ➤ Running Tests

This package includes tests using Jest. To run the tests:

```

npm test

```

[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributing)

## ➤ Contributing

Feel free to contribute to the project by opening issues or pull requests. You can add more specific data generators (such as orders, reviews, etc.) or any other features that may be useful.



[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License

This project is licensed under the MIT License.
