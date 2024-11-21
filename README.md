# OTP: Open Trivia Platform

A complete platform for creating and hosting your own trivia game.

## Modules

### trivia-ui

WIP: UI that all teams/players will use to set their team name, read questions, submit answers, and view standings.

### game-backend

WIP: Backend component that will orchestrate the running of the game, including keeping score and communicating with the admin-ui, present-ui, and then many teams connected via the trivia-ui.

### admin-ui

WIP: What the quiz host will use to run the game, including pacing and scoring.

### present-ui

TODO: UI that will only display questions and their content, meant for a large format display viewable to the whole room.

### creator-ui

TODO: A UI that will help you construct the JSON file that makes up a quiz.

## Setup

### Build

Run buildAll.sh

**OR**

In each directory, /admin-ui, /trivia-ui, and /game-backend, run the following commands in order:

`npm install`

`npm run build`

### Run

To run the project with docker, simply use the docker compose file with this command:

`docker-compose up -d --build`

The admin-ui can be reached on localhost:5174

The trivia-ui can be reached on localhost:5173
