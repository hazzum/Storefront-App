# Storefront-App

Storefront Backend App project for Udacity's advanced web track

## Getting Started

### To run the application, you must follow the following instructions:
#### 1- In the project directory, run the command `npm i` to install necessary packages.
#### 2- Create an `.env` file to store environment variables required to run this application.
Here's an example of how you should configure your `.env` file:
```
PORT=5432
ENV=dev
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=password
POSTGRES_DB_TEST=storefront_test
BCRYPT_PASSWORD=bada-bing-bada-boom
SALT_ROUNDS=10
TOKEN_SECRET=smokeweedeveryday
```
### 3- Create a `database.json` file to store database configuration, the relevant database variables should match those of the `.env` file.
Here's an example of how you should configure your `database.json` file:
```
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront",
    "user": "storefront_user",
    "password": "password"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "storefront_test",
    "user": "storefront_user",
    "password": "password"
  }
}
```
### 4- Set up the database driver and connect it to the application
To do this, there are two options:
- Install PostgreSQL locally, manually set up a user account, and manually create `storefront` and `storefront_test` databases.
- Or, install Docker, run the command `docker-compose up -d` and it will automatically set up a containerized database server, using the variables saved in `.env`, and it will run in the background.
### 5- Play around with the application
- The node.js application runs on port `3000`<br />
Run any of the scripts included in the `package.json` file:<br />
- Build script:                   `npm run build` <br />
- Running dev version script:     `npm run dev` <br />
- Testing script:                 `npm run test` <br />
- Build & run:                    `npm run start` <br />
- Use prettier to format files:   `npm run format` <br />
- Lint files:                     `npm run lint` <br />