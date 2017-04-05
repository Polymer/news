# NEWS

## Prerequisites

### Polymer CLI

Install [polymer-cli](https://github.com/Polymer/polymer-cli):

    npm install -g polymer-cli

### Google App Engine SDK

Install [Google App Engine SDK](https://cloud.google.com/appengine/downloads)

## Setup

    git clone https://github.com/polymer/news.git
    cd news
    # Clone submodules
    git submodule init
    git submodule update
    # This command will install dependencies
    pip install -t lib -r requirements.txt
    bower install

### Configure Google Sign-In
- Set up a new project at [Google Developers Console](https://console.developers.google.com/)
- Create credentials
- Download `client_secret_****.json`, rename it to `client_secrets.json`
- Place `client_secrets.json` at root of this project

### Configure Facebook Login
- Set up a new project at [Facebook Developers](https://developers.facebook.com/)
- Set "Site URL" `http://localhost:8080`
- Copy and paste the App ID in `app.yaml`.

## Start the development server

    dev_appserver.py .

## Build

    polymer build

## Test the build

This command serves the minified version of the app in an unbundled state, as it would be served by a push-compatible server:

    dev_appserver.py build/unbundled

This command serves the minified version of the app generated using fragment bundling:

    dev_appserver.py build/bundled

## Deploy to Google App Engine

    gcloud app deploy build/bundled/app.yaml --project [YOUR_PROJECT_ID]
