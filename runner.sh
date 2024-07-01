#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

while : 
do
    printf -- "\n----------------- GIT -------------------\n"
    git reset --hard || true

    printf -- "\n----------------- PUL -------------------\n"
    git submodule update --init --recursive || true
    git pull || true
    git pull --recurse-submodules || true

    printf -- "\n----------------- NPM -------------------\n"
    npm install || true

    printf -- "\n----------------- WPB -------------------\n"
    npm run build || true

    printf -- "\n----------------- SER -------------------\n"
    npm start
done
