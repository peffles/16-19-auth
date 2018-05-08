**Author**: Wyatt Pefley
**Version**: 1.0.0

# Overview
This is an application which performs CRUD operations via the Express framework to create, read, update, and delete data from a MongoDB consisting of accounts which have usernames, E-mails, passwords and that generate tokens for a successful login/signup.

# Architecture
the point of entry for this app is index.js, and a lor of our code is modularized in the code base. Our testing is done in the __test__ folder, and the lib folder containing all of the helper modules.

# Paths

POST ROUTE: Adds new account to the MongoDB.
- POST routes result in a 200 status code.
- POST routes with missing fields result in a 400 status code.
- POST routes containing an already existing unique value will result in a 409 status code.

# Change Log

05-07-2018 7:15pm - POST route established, POST testing complete.
05-07-2018 7:45pm - Tests passing.