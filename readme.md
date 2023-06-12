# dvet.se

How to run:
First run `npm install` to install all JS dependencies.

Then you can do the following things:
* `npm run dev` to debug your GUI code, any features which relies on the server such as the news or drive integration will not work without tinkering with the urls
* `npm run build` to build the GUI code, this has to be done before running the server.
* `npm start` to start the server

## Files
The following files are also needed:
`.env` file containing:
```
WEBHOOK_SECRET=<A GitHub webhook secret used to verify that webhooks sent to the server come from a secure place, configure this in your WebHook settings>
WEBHOOK_URL=<A Discord webhook URL which specifies where to send newly posted news>
GITHUB_TOKEN=<a API token to interact with GitHub to fetch news, it will work without it you might get rate limited by GitHub>
KILL_TOKEN=dummy
ENABLE_DRIVE=<write "true" here to enable Google drive interaction, see the chapter below on how to set that up>
```
Only `KILL_TOKEN` is needed, unless you are testing out the news/drive features.

If Drive integration is wanted a `token.json` and `credentials.json` file is also needed. See GDrive integration for that.

## GDrive integration
Follow [https://developers.google.com/workspace/guides/create-credentials](https://developers.google.com/workspace/guides/create-credentials)
on how to create OAuth cliend ID credential with Drive access. Dump the `credentials.json` file into the root folder of this project.
Then set `ENABLE_DRIVE` to `true` in `.env` and on next server boot a browser will open asking you to log in using your Google account. 
Do this and Drive integration will be enabled :)
