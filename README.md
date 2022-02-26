run `npm install` to start the server and the DB on http://localhost:5005

## MongoDB

There are 2 collection in the database, "users" and "movements".
A user document looks like this:

```
{
    "_id": "62154c056065f32a2bdd0aab",
    "email": "galileo@unipd.it",
    "password": "e8d7179390286e29da2446a5a188c03cc84a255bc8689a8fc20a00061afb5aac",
    "name": "Galileo",
    "createdAt": "2022-02-23T11:03:46.308Z",
    "updatedAt": "2022-02-23T11:03:46.308Z",
    "__v": 0
}
```

A movement document looks like this:

```
{
     "_id": "621550b66065f32a2bdd0aac",
     "userId": "62154c056065f32a2bdd0aab",
     "amount": {
         "$numberDecimal": "1000"
     },
     "category": "Salary",
     "description": "University of Pisa",
     "isIncome": true,
     "createdAt": "1592-02-21T16:32:17.000Z"
     "updatedAt": "1592-02-21T16:32:17.000Z"
     "__v": 0
}
```

## /API/

the methods under the /API/ routes are:

- [GET /sampleData](#sampledata)
- [POST /userData](#userdata)
- [POST /movementsData](#movementsdata)
- [POST /addMovement](#addmovement)
- [POST /updateMovement](#updatemovement)
- [POST /categories](#categories)

### sampleData

#### GET

returns an object with user and movements data of a sample user (Galileo Galilei). the result is an object with two properties: user and movements. These properties are objects containing all the information

```{
    "user": {
        "_id": "62154c056065f32a2bdd0aab",
        "email": "galileo@unipd.it",
        "password": "e8d7179390286e29da2446a5a188c03cc84a255bc8689a8fc20a00061afb5aac",
        "name": "Galileo",
        "createdAt": "2022-02-23T11:03:46.308Z",
        "updatedAt": "2022-02-23T11:03:46.308Z",
        "__v": 0
    },
    "movements": [
        {
            "_id": "621550b66065f32a2bdd0aac",
            "userId": "62154c056065f32a2bdd0aab",
            "amount": {
                "$numberDecimal": "1000"
            },
            "category": "Salary",
            "description": "University of Pisa",
            "isIncome": true,
            "createdAt": "1592-02-21T16:32:17.000Z"
            "updatedAt": "1592-02-21T16:32:17.000Z",
            "__v": 0
        },
        {
            "_id": "6215544f6065f32a2bdd0aae",
            "userId": "62154c056065f32a2bdd0aab",
            "amount": {
                "$numberDecimal": "1000"
            },
            "category": "Salary",
            "description": "University of Padua",
            "isIncome": true,
            "createdAt": "1592-10-15T09:42:56.000Z"
            "updatedAt": "1592-10-15T09:42:56.000Z",
            "__v": 0
        },
        ...
    ]
}
```

### userData

#### POST

Takes as argument the `_id` of the user you want to get data of, in the form of the string inside the ObjectId and not the OjectId itself.

```
{"userId": "62154c056065f32a2bdd0aab"}
```

returns the user document

```
{
    "_id": "62154c056065f32a2bdd0aab",
    "email": "galileo@unipd.it",
    "password": "e8d7179390286e29da2446a5a188c03cc84a255bc8689a8fc20a00061afb5aac",
    "name": "Galileo",
    "createdAt": "2022-02-23T11:03:46.308Z",
    "updatedAt": "2022-02-23T11:03:46.308Z",
    "__v": 0
}
```

### movementsData

#### POST

Takes as argument the `_id` of the user you want to get data of, in the form of the string inside the ObjectId and not the OjectId itself, the same of userData

```
{"userId": "62154c056065f32a2bdd0aab"}
```

returns an array with the list of the user movements

```
[
        {
            "_id": "621550b66065f32a2bdd0aac",
            "userId": "62154c056065f32a2bdd0aab",
            "amount": {
                "$numberDecimal": "1000"
            },
            "category": "Salary",
            "description": "University of Pisa",
            "isIncome": true,
            "createdAt": "1592-02-21T16:32:17.000Z"
            "updatedAt": "1592-02-21T16:32:17.000Z",
            "__v": 0
        },
        {
            "_id": "6215544f6065f32a2bdd0aae",
            "userId": "62154c056065f32a2bdd0aab",
            "amount": {
                "$numberDecimal": "1000"
            },
            "category": "Salary",
            "description": "University of Padua",
            "isIncome": true,
            "createdAt": "1592-10-15T09:42:56.000Z"
            "updatedAt": "1592-10-15T09:42:56.000Z",
            "__v": 0
        },
        ...
]
```

### addMovement

#### POST

Takes as arguments `userId`, `amount`, `category`, `description`, `isIncome` values and return the new document if created, an error message otherwise.
POST request:

```
{
    "userId":"621a091229021da2d30acf9c",
    "amount":"1300",
    "category":"Salary",
    "description":"February",
    "isIncome": true
}
```

returns

```
{
        "_id": "621a4d5de6179d6cb789a3ea",
        "userId": "621a091229021da2d30acf9c",
        "amount": {
            "$numberDecimal": "1300"
        },
        "category": "Salary",
        "description": "February",
        "isIncome": true,
        "createdAt": "2022-02-26T15:55:09.954Z",
        "updatedAt": "2022-02-26T15:55:09.954Z",
        "__v": 0
    }
```

### updateMovement

#### POST

Takes as arguments `_id`, `userId`, `amount`, `category`, `description`, `isIncome` values and return the new document if modified, an error message otherwise.
POST request:

```
{
    "_id": "6215544f6065f32a2bdd0aae"
    "userId":"621a091229021da2d30acf9c",
    "amount":"1500",
    "category":"Salary",
    "description":"March",
    "isIncome": true
}
```

returns

```
{
        "_id": "621a4d5de6179d6cb789a3ea",
        "userId": "621a091229021da2d30acf9c",
        "amount": {
            "$numberDecimal": "1500"
        },
        "category": "Salary",
        "description": "March",
        "isIncome": true,
        "createdAt": "2022-02-26T15:55:09.954Z",
        "updatedAt": "2022-02-26T16:25:07.138Z",
        "__v": 0
    }
```

### categories

#### POST

this method returns a list of categories used by the user with some basic statistic data. It takes the userId as argument and returns an object with 3 main properties:

- `allCategories`, a list of all categories used, in both incomes and expenses;
- `incomeCategories`, a list of categories used for income movements with the number of movements, the total amount for category and the percentage category amount/total amount;
- `expenseCategories`, a list of categories used for expense movements with the number of movements, the total amount for category and the percentage category amount/total amount;
  a POST request like this:

```
{"userId": "62154c056065f32a2bdd0aab"}
```

returns something like this:

```
{
    "allCategories": [
        {
            "_id": "Lenses"
        },
        {
            "_id": "Salary"
        },
        {
            "_id": "Tripods"
        },
        {
            "_id": "Mounts"
        },
        {
            "_id": "Frames"
        }
    ],
    "incomeCategories": [
        {
            "_id": "Salary",
            "movementCount": 2,
            "totalCategoryAmount": {
                "$numberDecimal": "2000"
            },
            "categoryRate": {
                "$numberDecimal": "1"
            }
        }
    ],
    "expenseCategories": [
        {
            "_id": "Frames",
            "movementCount": 2,
            "totalCategoryAmount": {
                "$numberDecimal": "300"
            },
            "categoryRate": {
                "$numberDecimal": "0.3243243243243243243243243243243243"
            }
        },
        {
            "_id": "Lenses",
            "movementCount": 2,
            "totalCategoryAmount": {
                "$numberDecimal": "350"
            },
            "categoryRate": {
                "$numberDecimal": "0.3783783783783783783783783783783784"
            }
        },
        {
            "_id": "Tripods",
            "movementCount": 1,
            "totalCategoryAmount": {
                "$numberDecimal": "75"
            },
            "categoryRate": {
                "$numberDecimal": "0.08108108108108108108108108108108108"
            }
        },
        {
            "_id": "Mounts",
            "movementCount": 2,
            "totalCategoryAmount": {
                "$numberDecimal": "200"
            },
            "categoryRate": {
                "$numberDecimal": "0.2162162162162162162162162162162162"
            }
        }
    ]
}
```
