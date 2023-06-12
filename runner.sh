#!/bin/bash

while : 
do
    git pull || true
    npm install || true
    npm run build || true
    npm start
done