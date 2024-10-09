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

TODO: Use Docker Compose to handle all of the containers for each module.

For now run each of these commands in a separate terminal inside each module's directory:

- trivia-ui: `npm run dev`
- admin-ui: `npm run dev`
- game-backend: `npm start`

The admin-ui can be reached on localhost:5174

The trivia-ui can be reached on localhost:5173
