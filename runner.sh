#!/bin/zsh

# Set up logging
if [ -f  ".log_uri" ]; then 
    uri="$(cat ".log_uri")"
    function send() {
        data=$(echo "{\"content\": \"\`$(date): $1\`\"}"| sed -e 's/\x1b\[[0-9;]*m//g')
        curl -sS \
            -H "Accept: application/json" \
            -H "Content-Type:application/json" \
            -X POST --data "$data" "$uri" 2> /dev/null
    } 
else 
    function send() {
        echo "" > /dev/null
    }
    echo "Discord logging disabled"
fi

send "Starting from cold boot"

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
    send "I be running 🏃‍♀️🏃‍♀️"
    npm start 2> >(while IFS= read -r p; do
        echo "$p"
        send "$p"
    done)
done
