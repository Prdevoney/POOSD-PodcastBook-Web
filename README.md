# Web app for POOSD large project

Link for the live website: [podcastd-test.azurewebsites.net](https://podcastd-test.azurewebsites.net/)

## Project Structure

* app.js: 
  The main file in the project that directs all the HTTP requests made to the web app. 
  So, depending on the request it recieves it will either get the react app or it will get an API endpoint. 

* client folder: 
  Contains the React project where we can work on the front end

* routes folder: 
  Contains the server side code (APIs)

  ## Cloning the Repo
  Once you clone the repo in the main directory run:
  ```
  npm install
  ```
  This will install all the necessary packages for you to develop and test the code locally
  
  ## React App
  To develop locally: go to the client directory and start the development server with:
  ```
  cd client
  npm start
  ```
  This will run the React app on localhost:3000
  
  ### Website Structure
  * **Login page**
      - User can create account and login
  * **Explore Page**
      - User can search for podcasts & users
      - User can write review on podcasts and follow users
  * **User Page**
      - User can view their own reviews
      - User can view friends reviews
  
  ## Backend (APIs)
  To develop locally: from the main directory start the development server with:
  ```
  npm run dev
  ```
  This will run the server (Express.js app) on localhost:5000
  
  ### API Structure
  * The request is processed by the app.js file in the main directory
  * From there it routes the request to the proper file and endpoint in the 'routes' folder
  * Link for the podcast API: https://www.listennotes.com/api/docs/
 
 
  

  

  
    
