# Web app for POOSD large project

## Project Structure

* app.js: 
  The main file in the project that directs all the HTTP requests made to the web app. 
  So, depending on the request it recieves it will either get the react app or it will get an API endpoint. 

* client folder: 
  Contains the React project where we can work on the front end

* routes folder: 
  Contains the server side code (APIs)


  ## React App
  To develop locally: go to the client directory and start the development server with:
  ```
  cd client
  npm start
  ```
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
  ### API Structure
  * The request is processed by the app.js file in the main directory
  * From there it routes the request to the proper file and endpoint in the 'routes' folder
  

  

  
    
