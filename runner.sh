#!/bin/bash

while : 
do
    git pull
    npm run build
    npm start
done