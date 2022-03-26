# Game Sessions Analyzer Server
## Prequisites

* Node version 16 (for a quick setup use [`fnm`](https://github.com/Schniz/fnm) or [`nvm`](https://github.com/nvm-sh/nvm))
* npm version 6
* Docker


## Installation

* Run `npm i` in terminal

## Running Locally

* Run `npm run build` - this will build both the typescript into `dist` file and will build the docker image for the database
* Run `npm run start:db` - for starting a docker container of the database
* Run `npm run start:server` - for starting a local server