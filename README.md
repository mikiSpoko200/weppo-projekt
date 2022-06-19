# About

Web application for VHS tape rental service.

# Functionality

As of now application supports:

- account system
- cookie based session
- product filtering and searching
- user product cart

# Security

Databse operations are performed using `pg` package. All queries are managed by the `pool` object which protects the application againts SQL injection attacks.

All User passwords are protected by hashing with private key using `bcrypt` package. 


## Technologies

|  |  |
|--|--|
|**Programming languages** | TypeScript + JavaScript |
| **Runtime** | node.js |
| **Framework** | express.js |
| **DBMS** | PostgreSQL |
| **HTML templating language** | EJS |
