#!/bin/bash
cd admin-ui/
npm install
npm run build
cd ../game-backend
npm install
npm run build
cd ../trivia-ui
npm install
npm run build