# Food Delivery API

[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org)

A RESTful API backend service for an online food delivery platform.

The API can create user accounts (includes an initial amount), browse restaurants, view menu items, place orders, and handle order fulfillment.

This solution uses `Node.js` runtime, `Express` for the API layer, `Redis` for user sessions, `Postgres` for relational data.

You can explore the [Live REST API](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/evanigwilo/food-delivery-api/main/docs/api-definition.yml)

## Demo accounts

```javascript
identity: mark;
password: 123456;

identity: john;
password: 123456;
```

### API Routes

| Methods | Routes                     | Description                                              |
| ------- | -------------------------- | -------------------------------------------------------- |
| GET     | /user/authenticate         | Gets user attributes for the current authenticated user. |
| POST    | /user/register             | Registers and authenticates users.                       |
| POST    | /user/login                | Logs in and authenticates users.                         |
| POST    | /user/logout               | Logs out the current authenticated user.                 |
| POST    | /country                   | Gets countries for creating locations                    |
| POST    | /country/create            | Creates a country                                        |
| GET     | /country/{countryId}       | Get a country by id                                      |
| PATCH   | /country/{countryId}       | Update country by id                                     |
| DELETE  | /country/{countryId}       | Delete country by id                                     |
| POST    | /location                  | Gets locations for creating restaurants (and users)      |
| POST    | /location/create           | Creates a location                                       |
| GET     | /location/{locationId}     | Get a location by id                                     |
| PATCH   | /location/{locationId}     | Update location by id                                    |
| DELETE  | /location/{locationId}     | Delete location by id                                    |
| POST    | /restaurant                | Gets restaurants for creating menus                      |
| POST    | /restaurant/create         | Creates a restaurant                                     |
| GET     | /restaurant/{restaurantId} | Get a restaurant by id                                   |
| PATCH   | /restaurant/{restaurantId} | Update restaurant by id                                  |
| DELETE  | /restaurant/{restaurantId} | Delete restaurant by id                                  |
| POST    | /menu                      | Gets menus for creating foods                            |
| POST    | /menu/create               | Creates a menu                                           |
| GET     | /menu/{menuId}             | Get a menu by id                                         |
| PATCH   | /menu/{menuId}             | Update menu by id                                        |
| DELETE  | /menu/{menuId}             | Delete menu by id                                        |
| POST    | /food                      | Gets foods                                               |
| POST    | /food/create               | Creates a food                                           |
| GET     | /food/{foodId}             | Get a food by id                                         |
| PATCH   | /food/{foodId}             | Update food by id                                        |
| DELETE  | /food/{foodId}             | Delete food by id                                        |
| POST    | /order                     | Gets user orders                                         |
| POST    | /order/create              | Creates an order                                         |
| GET     | /order/{orderId}           | Get an order by id                                       |
| PATCH   | /order/{orderId}           | Pay for an order by id                                   |

---

## Requirements

Before getting started, make sure you have the following requirements:

- [Docker](https://www.docker.com)
- [Docker Compose](https://docs.docker.com/compose/) (Supporting compose file version 3)
- A [bash](https://www.gnu.org/software/bash) compatible shell

### Run The Project

Follow these steps to get your development environment set up:

1. **Clone this repository** locally;

```bash
# Change to the desired directory
$ cd <desired-directory>

# Clone the repo
$ git clone https://github.com/evanigwilo/food-delivery-api.git

# Change to the project directory
$ cd food-delivery-api
```

2. Change environmental variables filename from `.env.example` to `.env`

3. Update the `.env` file configuration values (optional)

4. At the root directory, run the following command:

```bash
# Create external docker volume for the postgres database
$ docker volume create postgres-db-volume

# Build and run the server in a container environment
$ docker-compose --env-file .env -p food-deliver-stack -f docker-compose.yml up --build -d
```

5. The server will be running at http://localhost:4000/v1

## Useful commands

```bash
# Stops and removes containers, networks and volumes
$ docker-compose --env-file .env -p food-deliver-stack -f docker-compose.yml down -v --remove-orphans
```

## References

> - [Docker](https://www.docker.com)
