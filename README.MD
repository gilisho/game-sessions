# Game Sessions Analyzer Server

This project based on [this](https://gist.github.com/tamarr/1af8e628811781e49a4d205e872700d7) assignment.

## Prerequisites

* Node version 16 (for a quick setup use [`fnm`](https://github.com/Schniz/fnm) or [`nvm`](https://github.com/nvm-sh/nvm))
* npm version 6
* Docker


## Installation

* Run `npm i` in terminal

## Running Locally

* Run `npm run build` - this will build both the typescript into `dist` file and will build the docker image for the database
* Run `npm run start:db` - for starting a docker container of the database
* Run `npm run start:server` on a different terminal - for starting a local server

> You can access the local DB by running `npm run debug:db`, and in the opened terminal type in `mysql -u root -p` and then type the password for root (`password`). 

Local server runs on port `3001`.

## Testing

Unfortunately I didn't make it to the testing phase. 
I usually try to create tests against a dockerized db in TDD style, but I didn't have time for the setup of the test environment. :)
Anyway, there are some very basic unit tests that can be run with `npm run test`. I also made builders which are in `__tests__` - these are used in integration tests which I didn't get to do.

## Documentation

### API

API request and response types are found in types folder, specifically in [here](./src/types/api-types.ts).

#### `ListGameSessions` API (`GET`)

URL: `/game-sessions`.  
Returns the list of game sessions (name and id).

#### `GetGameSession` API (`GET`)
URL: `/game-sessions/:id`.  

Path parameter:
* `id` - game session id

Returns a game session by id, including its measurements.

#### `CreateGameSession` API (`POST`)
URL: `/game-sessions`.  

Payload: 
* `gameSession` - the game session input (as in the example given in the task description)

Takes in the input, calculates the measurements' grades and accumulated scores, stores the information in the database (details about the stored data below).  
Returns the game session id.

### Database Design

Database is MySQL.  
The database is consisted of two tables: one for the game session records and one for the measurement records.  

The following chart describes the database:


![db](./assets/game_sessions_db.png)
