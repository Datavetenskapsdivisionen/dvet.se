#!/bin/bash

while : 
do
    git pull
    npm install
    npm run build
    npm start
done