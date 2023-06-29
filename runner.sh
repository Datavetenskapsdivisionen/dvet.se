#!/bin/bash

while : 
do
    printf -- "----------------- GIT -------------------\n"
    git reset --hard || true

    printf -- "----------------- GIT -------------------\n"
    git pull || true

    printf -- "\n----------------- NPM -------------------\n"
    npm install || true

    printf -- "\n----------------- WPB -------------------\n"
    npm run build || true

    printf -- "\n----------------- SER -------------------\n"
    npm start
done