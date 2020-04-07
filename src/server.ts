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
import UserController from "./controller/UserController";
import UserStatusController from "./controller/UserStatusController";
import RoleController from "./controller/RoleController";

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

// enable CORS on development enviroment
if (process.env.PRODUCTION == "false") {
   app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
   });
}

// Express.js: check permissions for incoming requests
const routeInfo = require("./routeInfo.json");
app.use((req, res, next) => {
   // skip check for development enviroments
   if (process.env.PRODUCTION == "false") {
      next();
      return;
   }

   // find module for the given route
   const moduleName = routeInfo.routeModuleName[req.path];

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


/* 
=====================================================================================
Routes
=====================================================================================
*/

// Routes: Authentication Routes
app.route("/api/login")
   .post((req, res) => {
      AuthController.logIn(req.session, req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes:  Employee Routes
app.route("/api/employee")
   .post((req, res) => {
      EmployeeController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      EmployeeController.getOne(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      EmployeeController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      EmployeeController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/employees")
   .get((req, res) => {
      EmployeeController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


app.route("/api/employee/next_number")
   .get((req, res) => {
      EmployeeController.getNextNumber()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: User Routes
app.route("/api/user")
   .get((req, res) => {
      UserController.getOne(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .post((req, res) => {
      UserController.save(req.body.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      UserController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      UserController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/users")
   .get((req, res) => {
      UserController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Civil Status
app.route("/api/civil_statuses")
   .get((req, res) => {
      CivilStatusController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Designation
app.route("/api/designations")
   .get((req, res) => {
      DesignationController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Gender
app.route("/api/genders")
   .get((req, res) => {
      GenderController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Employee Status
app.route("/api/employee_statuses")
   .get((req, res) => {
      EmployeeStatusController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Role
app.route("/api/roles")
   .get((req, res) => {
      RoleController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: User Statuses
app.route("/api/user_statuses")
   .get((req, res) => {
      UserStatusController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Misc Routes
app.route("/api/regex/:MODULE")
   .get((req, res) => {
      RegexPatternUtil.getModuleRegexForUI(req.params.MODULE)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });



// Express.js: Start the server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));