run `npm install` to start the server and the DB on http://localhost:5005

- [API Documentation](#api-documentation)
  - [Movements routes](#movements-routes)
  - [User routes](#user-routes)
- [Models](#models)
  - [Movements Model](#movements-model)
  - [User Model](#user-model)

## API Documentation

We will start our project by first documenting all of the routes and data models for our API. Following best practices we will use verbs to specify the type of operation being done and nouns when naming endpoints.

### Movements routes

| HTTP verb | URL                  | Request body | Action                         |
| --------- | -------------------- | ------------ | ------------------------------ |
| GET       | `/api/movements`     | (empty)      | Returns all the movements      |
| POST      | `/api/movements`     | JSON         | Create a new movement          |
| GET       | `/api/movements/:id` | (empty)      | Returns the specified movement |
| PUT       | `/api/movements/:id` | JSON         | Edits the specified movement   |
| DELETE    | `/api/movements/:id` | (empty)      | Deletes the specified movement |

### User routes

| HTTP verb | URL            | Request Headers               | Request Body              |
| --------- | -------------- | ----------------------------- | ------------------------- |
| POST      | `/auth/signup` | -                             | { email, password, name } |
| POST      | `/auth/login`  | -                             | { email, password }       |
| GET       | `/auth/verify` | Authorization: Bearer < JWT > | -                         |

---

## Models

### Movements Model

```
{
    userId: { type: ObjectId, required: true },
    amount: { type: Decimal128, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    isIncome: { type: Boolean, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
```

### User Model

```{
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
```
