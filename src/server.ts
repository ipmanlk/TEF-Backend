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
import DesignationController from "./controller/DesignationController";
import EmployeeStatusController from "./controller/EmployeeStatusController";
import UserController from "./controller/UserController";
import PrivilegeController from "./controller/PrivilegeController";
import GeneralController from "./controller/GeneralController";
import RoleController from "./controller/RoleController";
import ProfileController from "./controller/ProfileController";

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

// method used for checking permissions
const isAuthorized = AuthController.isAuthorized;

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

// Express.js: Folder with static HTML files to server the user
app.use("/", express.static(`${__dirname}/../../public`));

// skip check for development enviroments
app.use((req, res, next) => {
   if (process.env.PRODUCTION == "false") {
      req.session.data = {};
      req.session.data.username = "admin";
      req.session.data.logged = true;
      req.session.data.role = { id: 1 };
      req.session.data.userId = { id: 1 };
   }
   next();
});

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

app.route("/api/logout")
   .get((req, res) => {
      AuthController.logOut(req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Middleware: Profile permission checking
app.use("/api/profile", (req, res, next) => {
   isAuthorized(req).then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes: Profile
app.route("/api/profile")
   .get((req, res) => {
      ProfileController.getOne(req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Middleware: Employee permission checking
app.use("/api/employees", (req, res, next) => {
   isAuthorized(req, false, "EMPLOYEE").then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes:  Employee Routes
app.route("/api/employees")
   .post((req, res) => {
      EmployeeController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      EmployeeController.get(req.query.data)
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


app.route("/api/employees/next_number")
   .get((req, res) => {
      EmployeeController.getNextNumber()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Middleware: User permission checking
app.use("/api/users", (req, res, next) => {
   isAuthorized(req, false, "USER").then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes: User Routes
app.route("/api/users")
   .get((req, res) => {
      UserController.get(req.query.data)
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

// Middleware: Designation permission checking
app.use("/api/designations", (req, res, next) => {
   isAuthorized(req, false, "DESIGNATION").then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes: Designation
app.route("/api/designations")
   .get((req, res) => {
      DesignationController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Middleware: Employee Status permission checking
app.use("/api/employee_statuses", (req, res, next) => {
   isAuthorized(req, false, "EMPLOYEE_STATUS").then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes: Employee Status
app.route("/api/employee_statuses")
   .get((req, res) => {
      EmployeeStatusController.getAll()
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Middleware: Roles permission checking
app.use("/api/roles", (req, res, next) => {
   isAuthorized(req, false, "ROLE").then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes: Roles
app.route("/api/roles")
   .get((req, res) => {
      RoleController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e))
   })

   .post((req, res) => {
      RoleController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      RoleController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      RoleController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

// Middleware: Privileges permission checking
app.use("/api/privileges", (req, res, next) => {
   isAuthorized(req, false, "PRIVILEGE").then(() => {
      next();
   }).catch(e => res.json(e));
});

// Routes: Privileges
app.route("/api/privileges")
   .get((req, res) => {
      PrivilegeController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e))
   })

   .post((req, res) => {
      PrivilegeController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      PrivilegeController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes: Misc Routes
app.use("/api/regexes", (req, res, next) => {
   isAuthorized(req).then(() => {
      next();
   }).catch(e => res.json(e));
});

app.route("/api/regexes")
   .get((req, res) => {
      RegexPatternUtil.getModuleRegexForUI(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.use("/api/general", (req, res, next) => {
   isAuthorized(req).then(() => {
      next();
   }).catch(e => res.json(e));
});

app.route("/api/general")
   .get((req, res) => {
      GeneralController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Express.js: Start the server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));