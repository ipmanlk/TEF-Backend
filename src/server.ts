/* 
=====================================================================================
DOTENV: Load settings from .env to process.env (see sample.env)
=====================================================================================
*/

require("dotenv").config();

/* 
=====================================================================================
Libraries
=====================================================================================
*/

// Libraries: 3rd Party
import { createConnection } from "typeorm";
import * as express from "express";
import * as session from "express-session";

/* 
=====================================================================================
Controllers
=====================================================================================
*/

import AuthController from "./controller/AuthController";
import EmployeeController from "./controller/EmployeeController";
import CivilStatusController from "./controller/CivilStatusController";
import DesignationController from "./controller/DesignationController";
import EmployeeStatusController from "./controller/EmployeeStatusController";
import GenderController from "./controller/GenderController";

/* 
=====================================================================================
Utilities
=====================================================================================
*/

import RegexPatternUtil from "./util/RegexPatternUtil";

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
app.use(express.json({
   limit: "8000kb"
}));

// Express.js: Sessions for login
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
app.use("/", express.static(`${__dirname}/../../public`));


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
      EmployeeController.save(req.body.data)         
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

app.route("/api/employees")
   .get((req, res) => {
      EmployeeController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });


app.route("/api/employee/civil_status")
   .get((req, res) => {
      CivilStatusController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

app.route("/api/employee/designation")
   .get((req, res) => {
      DesignationController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });


app.route("/api/employee/gender")
   .get((req, res) => {
      GenderController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

app.route("/api/employee/employee_status")
   .get((req, res) => {
      EmployeeStatusController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

// Express.js: Route for regular expressions
app.route("/api/regex/:MODULE")
   .get((req, res) => {
      RegexPatternUtil.getModuleRegexForUI(req.params.MODULE)
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });

// Express.js: Start the server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));