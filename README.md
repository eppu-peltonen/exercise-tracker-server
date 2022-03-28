# Exercise tracker

Node.js API server for the exercise tracker application.

## Setup

The server needs `.env` file to store environment variables.
Add the file to project root directory with following contents:
`PORT=your_port` for example 3001 for this server and 3000 for the client application.
`SECRET=your_secret` any string to use for the user token.

The project uses PostgreSQL database so first install the database locally or use external PostgreSQL database service.
The server establishes database connections for development and production.

Database connection for local PostgreSQL database is given in `.env` file with following content:

- `DB_USER=your_user`
- `DB_PASSWORD=your_password`
- `DB_HOST=LOCALHOST` Localhost for local DB.
- `DB_PORT=5432` PostgreSQL default port.
- `DB_DATABASE=your_db_name`

Database connection for production is given in `.env` file with following content:

`DATABASE_URL=your_postgresql_db_url`

You can configure both connections if you wish.
To start the server using development / local database:
`npm run dev`

To start the server using production database:
`npm start`

SQL script for creating the tables for the database:

```sql
create table users (
  id serial primary key,
  username varchar(50) unique not null,
  passwordhash varchar(255) not null
);

create table exercises (
  id serial primary key,
  user_id integer references users (id),
  sport varchar(50) not null,
  start_time timestamptz not null,
  duration interval not null,
  distance numeric(5,1),
  avg_hr int
);
```

## Installation and running

`npm install` in the project root directory.

`npm run dev` for running the server with nodemon for development.

`npm start` for running the server in development. Notice that this will connect to your database configured in the `DATABASE_URL` environment variable

## API endpoints

### List exercises

#### Definition

`GET /api/exercises`

#### Response

- `200 OK` on success

```json
[
  {
    "id": 14,
    "user_id": 1,
    "sport": "Running",
    "start_time": "2022-03-28T06:43:53.497Z",
    "duration": "01:00:00",
    "distance": "11.0",
    "avg_hr": 120
  },
  {
    "id": 15,
    "user_id": 1,
    "sport": "Cycling",
    "start_time": "2022-03-28T06:45:58.034Z",
    "duration": "02:00:00",
    "distance": "40.0",
    "avg_hr": 130
  }
]
```

### Add a new exercise

#### Definition

`POST /api/exercises`

#### Arguments

- `"sport":string` the sport of the exercise
- `"start_time":timestamptz` start time of the exercise. Can be obtained for example from a date picker.
- `"duration":interval` duration of the exercise. for example `"01:10:10" (hh:mm:ss)`
- `"distance":numeric` a float for the distance in kilometers. For example `10.1` km.
- `"avg_hr":int` average heart rate of the exercise in BPM (beats per minute)

#### Response

- `201 Created` on success

```json
[
  {
    "status": "Success",
    "message": "Exercise added"
  }
]
```

### List users

#### Definition

`GET /api/users`

#### Response

- `200 OK` on success

```json
[
  {
    "id": 1,
    "username": "user1"
  },
  {
    "id": 8,
    "username": "user8"
  }
]
```

### Add user

#### Definition

`POST /api/users`

#### Arguments

- `"username":string`
- `"password":string`

#### Response

- `201 Created` on success

```json
[
  {
    "status": "Success",
    "message": "User added"
  }
]
```

### Login

#### Definition

`POST /api/login`

#### Arguments

- `"username":string`
- `"password":string`

#### Response

- `200 OK` on success

```json
[
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVwcHUyIiwiaWQiOjgsImlhdCI6MTY0ODQ3Mzk0NSwiZXhwIjoxNjQ4NDc3NTQ1fQ.LDcxvIKuc2eS5tbJ18mm_ytxAbZsmcSBTaJMzUQ8jss",
    "id": 8,
    "username": "user8"
  } 
]
```
