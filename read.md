# Backend
1. npm init -y
2. npm i express mongoose dotenv jsonwebtoken bcrypt cookie-parser cloudinary socket.io cors
3. npm i nodemon -D
4. Create controllers, models, lib, middleware and routes folder
    controllers : Contains the logic — what should happen when a route is hit.
    models : Defines the structure of your data
    routes : Defines the URLs/endpoints the app will respond to.
    lib : is for utility/helper functions, custom services, or config files that don't fit in routes, controllers, etc.
    middleware : Middleware is a function that runs before your route handler.

5. visit mongodb.com -> new project -> get pass -> vs code -> create .env in root folder(i.e backend) {import in inde.js, define PORT and dotenv.config()}
on mongoose.com -> network access -> add IP 0.0.0.0/0

6. in lib folder make a db.js file tha helps to connect to database then call it inside index.js after you call start server.
7. create user schema and then define user model and finally export it to use
8. signup setup : get the data from input fields and store them -> check for validity of the data -> hash pass and add details in a variable -> generate token for the user -> save its data to db -> send back user detail in json format 
Go to Postman and check you signup functionality, you should see the changes in your db also

9. login setup : get email and password from input fields -> check for data validity ->compare password with db password
10. logout setup : clear only cookie and set maxAge as 0
11. update profile : use middleware to verify the user then allow him update profile access, to verify user fetch token then compare it with secret key if all goes good then call next to route to updateProfile section.
12. visit cloudinary.com -> dashboard -> copy name, api key and api secret and define them in your env file 
configure it inside lib folder
13. message schema : it will contain sender,receiver, message(can be text or an image)
14. create message controller : fetches all users except the current one, check on postman
and get message between sender and receiver and send message from sender to receiver
15. 

# Frontend

1. npm i react-router-dom react-hot-toast
2. integrate tailwind
3. daisyUI for prebuilt components : npm i -D daisyui@latest
4. npm i axios zustand
 zustand : scalable state management solution for React — great alternative to Redux.
5. make route to home,signup,login,profile and setting page inside pages folder.
6. make store folder that stores authentication