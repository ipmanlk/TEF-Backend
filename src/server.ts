/* 
=====================================================================================
DOTENV: Load settings from .env to process.env
=====================================================================================
*/

require("dotenv").config();

/* 
=====================================================================================
Libraries
=====================================================================================
*/

// Libraries: Default
import * as os from "os";

// Libraries: 3rd Party
import { createConnection } from "typeorm";
import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as formData from "express-form-data";

/* 
=====================================================================================
Controllers
=====================================================================================
*/

import AuthController from "./controller/AuthController";
import EmployeeController from "./controller/EmployeeController";
import RegExController from "./controller/RegExController";

/* 
=====================================================================================
TypeORM
=====================================================================================
*/

// TypeORM: Create connection to the detabase
createConnection().then(() => {
   console.log("SUCESS: Database connected.");
}).catch(error => {
   console.log("ERROR: Database  connection failed.");
   throw Error(error);
});

/* 
=====================================================================================
Express.js
=====================================================================================
*/

// Express.js: Initialize
const app = express();

// Express.js: Parse json request bodies
app.use(bodyParser.json());

// Express.js: Parse urlencoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Express.js: Options for multipart form data
const options = {
   uploadDir: os.tmpdir(),
   autoClean: true
 };
  
// Express.js: parse data with connect-multiparty. 
 app.use(formData.parse(options));

// Express.js: delete from the request all empty files (size == 0)
 app.use(formData.format());

// Express.js: change the file objects to fs.ReadStream 
 app.use(formData.stream());

// Express.js: union the body and the files
app.use(formData.union());

app.use(session({
   secret: process.env.SESSION_SECRET,
   saveUninitialized: false,
   resave: false
}));

// Express.js: check permissions for incoming requests
const routeInfo = require("./routeInfo.json");
app.use((req, res, next) => {
   // skip check for development enviroments
   if (process.env.PRODUCTION == "false") {
      next();
      return;
   }

   // extract the route from reqest url
   const route = req.url.split("?")[0];

   // find module for the given route
   const moduleName = routeInfo.routeModuleName[route];

   // skip if module not found
   if (!moduleName) {
      next();
      return;
   }

   // check permission and handle access
   AuthController.isAuthorized(req.session, moduleName, req.method).then(() => {
      next();
   }).catch(e => {
      res.json(e);
   })
});

// Express.js: Folder with static HTML files to server the user
app.use("/", express.static(`${__dirname}/../public`));

// Express.js: Routes for API calls
app.route("/api/login")
   .post((req, res) => {
      AuthController.logIn(req.session, req.body.data)
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

app.route("/api/employee")
   .get((req, res) => {
      EmployeeController.getOne(req.query.data)
         .then(r => res.send(r))
         .catch(e => res.send(e));
   })
   .post((req, res) => {      
      EmployeeController.save(req.body)
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

app.route("/api/employees")
   .get((req, res) => {
      EmployeeController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });


// Express.js: Route for regular expressions
app.route("/api/regex/:MODULE")
   .get((req, res) => {
      RegExController.getModuleRegexForUI(req.params.MODULE)
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

// Express.js: Start the server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));