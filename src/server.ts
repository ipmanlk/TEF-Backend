require("dotenv").config();

import { createConnection } from "typeorm";
import AuthController from "./controller/AuthController";
import EmployeeController from "./controller/EmployeeController";
import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";

const app = express();
const port = 3000;
const routeInfo = require("./routeInfo.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
   secret: process.env.SESSION_SECRET,
   saveUninitialized: false,
   resave: false
}));

// permission handler
app.use((req, res, next) => {
   // for development
   if (process.env.PRODUCTION == "false") {
      next();
      return;
   }

   // get current route
   const route = req.url.split("?")[0];

   // find module for the given route
   const moduleName = routeInfo.routeModuleName[route];

   // if module is not found
   if (!moduleName) {
      next();
      return;
   }

   // find operation name
   const operation = routeInfo.methodOperation[req.method];

   // check permission
   AuthController.isAuthorized(req.session, moduleName, operation).then(() => {
      next();
   }).catch(e => {
      res.json(e);
   })
});

// create typeorm conneciton
createConnection().then(() => {
   console.log("SUCESS: Database connected.");
}).catch(error => {
   console.log("ERROR: Database  connection failed.");
   console.log(error);
})

// public directory for static content
app.use("/", express.static(`${__dirname}/../public`));

// routes for api
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
   });

app.route("/api/employees")
   .get((req, res) => {
      EmployeeController.getAll()
         .then(r => res.send(r))
         .catch(e => res.send(e));
   });


// start listening
app.listen(port, () => console.log(`App is running on ${port}!`));
