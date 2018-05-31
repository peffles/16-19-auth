# Lab 17 - Bearer Authentication
**Author**: Wyatt Pefley
**Version**: 1.1.0

## Overview
This lab project involved using basic and bearer authentication to create an account, login, and make GET and POST requests to create or find a profile. We added a second Schema called profile.

## Testing
To start the server for testing, enter ```npm run dbon``` in your terminal. Then to start the test, enter: ```npm run test```. To turn the server off, enter: ```npm run dboff```.

#### Account Model
A successful status code of 200 is sent as the response if an account and token are created with the data sent in the POST request. If there is an error, a 400 status code is sent.

There is also a test for logging in with a username and password using basic auth. If successful, a 200 status code is sent.

#### Profile Model
The Profile model has a required reference to the Account model, meaning an Account must be created first. A successfully created profile will send a 200 status code. If the request data is incomplete, a status code of 400 will be sent. And using bearer auth, if a token is not sent, it will send a 401 error code. For a GET request completing successfully, a 200 status code is sent in response.