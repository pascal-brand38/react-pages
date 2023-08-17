# Vite

## Install

    npm install -g vite
    npm init vite <project_name>
    cd <project_name>
    npm install

## Use

    npm run dev


# Deploy on Github Pages

Check https://github.com/gitname/react-gh-pages:

## Setup github pages
go https://github.com/pascal-brand38/react-pages/settings/pages

* npm install gh-pages --save-dev
* in package.json:
  * add a homepage property in this format*: /react-pages/
  * add scripts:
    * "predeploy": "npm run build",
    * "deploy": "gh-pages -d dist",   as dist is the result of the build
* run npm run deploy


