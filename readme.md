# dvet.se
This is the official website for the Computer Science Division (Datavetenskapsdivisionen) at the University of Gothenburg in Sweden. It is built with React and ExpressJS.

# Getting started
To get the latest version of NodeJS, you need to [**install NVM (Node Version Manager)**](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating). If command `nvm` was not found after installing, it means you need to refresh your shell environment. For more help, read the [troubleshooting guide for Linux](https://github.com/nvm-sh/nvm?tab=readme-ov-file#troubleshooting-on-linux).

Once you have NVM, install the latest version of Node by running:
```
nvm install node
```

## First run
In the root folder of this repo, run `npm install` to install all dependencies.
Then you can do the following things:
* `npm run build` to build the code in production mode. This is required before starting the website.
* `npm start` to start the website in production mode.
* `npm run dev` to build and run the server in development mode. This will expose errors and the code is not obfuscated. The server also restarts automatically when changes to the source code is detected.

## Tokens
Create the file `.env` in the root folder of the project for defining your tokens. These tokens are private and you must keep them safe (e.g. never upload them to GitHub).

The following tokens are used:
<pre>
<b>KILL_TOKEN</b>=[generate it yourself, see the section below on how to do so]
<b>ENABLE_DRIVE</b>=[write "true" here to enable Google drive interaction, see the section below on how to set that up]
<b>WEBHOOK_SECRET</b>=[a GitHub webhook secret used to verify that webhooks sent to the server come from a secure place, configure this in your WebHook settings]
<b>WEBHOOK_URL</b>=[a Discord webhook URL which specifies where to send newly posted news]
<b>GITHUB_TOKEN</b>=[a token to interact with GitHub's API. The site will work without it but you might get rate limited by GitHub.]
<b>GITHUB_APP_CLIENT_ID</b>=[the client ID for the GitHub app, see the section below on how to get it]
<b>GITHUB_APP_SECRET</b>=[the secret for the GitHub app, see the section below on how to get it]
<b>JWT_SECRET_KEY</b>=[generate it yourself, see the section below on how to do so]
</pre>

### Generating a random token
Open a Linux terminal and run `openssl rand -hex 32 | openssl dgst -sha256`.

### Google Drive API
Go to the Google cloud console and create a project. Enable the Google Drive API and create your credentials from the credentials tab. Download the json file and save it as `credentials.json` in the project root folder. Then, go to the OAuth settings and under the Clients tab, add both `http://localhost:3000` and `http://localhost:8080` as authorised JavaScript origins and as authorised redirect URIs. Start the server and open the link that was printed in the console in order to grant the application the Google Drive permissions. A temporary server was created in the background on port 3000 which will take care of handling the authentication and creating the `token.json` file.

For more information, check out the official guide: https://developers.google.com/workspace/guides/create-credentials.

### GitHub Token
Create a personal access token at https://github.com/settings/tokens/new?scopes=repo.

### GitHub App Token
The GitHub app is used for writing to the repository, i.e. adding reactions and comments to issues (news posts). Create a GitHub app under settings and make sure to give it permission to access your repository and its issues. Then you can copy its client ID and generate a client secret.