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
    bower install

## Start the development server

    dev_appserver.py .

## Build

    polymer build

## Test the build

This command serves the `es5-bundled` build version of the app:

    dev_appserver.py build/es5-bundled

This command serves the `es6-unbundled` build version of the app:

    dev_appserver.py build/es6-unbundled

## Deploy to Google App Engine

    gcloud app deploy build/es6-unbundled/app.yaml --project [YOUR_PROJECT_ID]
