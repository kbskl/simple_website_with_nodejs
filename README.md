# What is this?

This repository simply involves building a website using nodejs and mongodb. Not all areas of this website are made. The basic login system and basic database operations (CRUD) required for a website have been made. The goal of this project is to do and learn entry-level transactions using different modules of nodejs. It is also to apply the MVC design pattern to the code.

On the website, mongoDB is used as the database. A session-based system was set up for the login system, and some transactions such as forgot to password were made.

## Installation

1. Clone the repository
2. Install mongodb and create a database
3. Run ```npm install``` in the root of the folder to install dependencies.
4. Fill in the fields in the env.sample file and save it as .env

Example .env file:
```note
PORT=3000
MONGODB_CONNECTION_STRING=mongodb://localhost/simpleNodeJsExample
SESSION_SECRET=asdfghe
CONFIRM_MAIL_JWT_SECRET=123456789987654
RESET_PASSWORD_JWT_SECRET=98765431147852
WEB_SITE_URL=http://localhost:3000/
GMAIL_USER=xxxxx@gmail.com
GMAIL_PASSWORD=*********
```
5. Run ```node app.js```
6. Go to web site url





## Usage

After successfully installing, go to the website url. Template part is a free bootstrap theme as an example.
1. Create a user
2. Log in
3. Forget password operations
4. Redirecting to a different page after logging in
5. Log out 

Its operations are running actively. It requires email confirmation for the created user, so it is important to enter a gmail address in the .env file.


## License
[MIT](https://choosealicense.com/licenses/mit/)