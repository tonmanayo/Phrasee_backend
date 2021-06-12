# PHRASEE BACK END TECHNICAL TEST

#### My implimentation of the Phrasee **backend end** technical test

I choose to use **Azure functions**.
Only having 4 hours to complete the task I thoight this would be a good option as it allows me to get going really fast, and easily host the API's
I thought this was good option because the task was to transform some data using 3 endpoints and not really build an application using a certain framework.

I did not do a TDD approach as I thought it would be better time spent on showing a clean technical ability to solve the task at hand. If this was a prod build there would be unit tests.
I used **Typescript**

This was a **fun task**, I really enjoyed it and feel like I have demonstrated some clean basic coding.
There are some mocked out functions like token decoding and basic object serialization.

## Run locally
--------------
  - npm install
  - npm run start

#### Postman
There is a postman file (notifications.postman_collection) you and download and import the collection into postman, it contains the local endpoints and hosted endpoints

## Structure
--------------
- Each function/endpoint is contained in it's own folder, each folder has a functions.json which specifies things like the URL schema
- Helpers folder contains re usable functions
- @types contains all types for Typescript
