require("dotenv").config();

import { createConnection } from "typeorm";
import AuthController from "./controller/AuthController";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
   secret: process.env.SESSION_SECRET,
   saveUninitialized: false,
   resave: false
}));

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
app.get("/api/login", (req, res) => {
   AuthController.isAuthorized(req.session, "EMPLOYEE", "READ").then((r) => {      
      res.json(r);
   }).catch(e => {
      res.json(e);
   });
});


// start listening
app.listen(port, () => console.log(`App is running on ${port}!`));
