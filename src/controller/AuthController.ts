require("dotenv").config();

import { User } from "../entity/User";
import { Module } from "../entity/Module";
import { Privilege } from "../entity/Privilege";

import { getRepository } from "typeorm";

const crypto = require("crypto");

class AuthController {
    static async logIn(session, { username, password }) {

        // create hashed password using salt in .env
        const hashedPass = crypto.createHash("sha512").update(`${password}${process.env.SALT}`).digest("hex");

        // find user with the given username
        let user;

        user = await getRepository(User).findOne({
            where: {
                username: username
            },
            relations: ["role"]
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        });

        // if user is not found
        if (user == undefined) {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find a user with that username!"
            };
        }

        // check password
        if (user.password !== hashedPass) {
            throw {
                status: false,
                type: "input",
                msg: "Password you provided is wrong!."
            };
        }

        // create session
        session.data = {};
        session.data.username = username;
        session.data.logged = true;
        session.data.role = user.role;
        session.data.userId = user.id;

        // return login success msg and user role name
        return {
            status: true,
            msg: "You have been logged in!.",
        }
    }

    static isLoggedIn(session) {
        if (session.data !== undefined && session.data.logged == true) {
            return {
                status: true,
                msg: "You are logged in."
            }
        } else {
            return {
                status: false,
                type: "auth",
                msg: "You are not logged in"
            }
        }
    }

    static logOut(session) {
        if (session.data.logged == true) {
            session.destroy();
            return {
                status: true,
                msg: "You have been logged out."
            }
        } else {
            return {
                status: false,
                type: "auth",
                msg: "You must login first!."
            }
        }
    }

    static async isAuthorized(session, route, operationName) {
        // for random requests such as favicon
        if (route.indexOf("/api") == -1) return true;

        const routeData = require("./data/routeData.json");

        // check if route is open
        if (routeData["OPEN ROUTES"].includes(route)) return true;

        // first check if user is logged in
        const isLoggedIn = AuthController.isLoggedIn(session);

        if (!isLoggedIn.status) {
            throw isLoggedIn;
        }

        // exceptional cases
        const exceptionalRoutes = [
            "/api/profile",
            "/api/regexes"
        ]

        if (exceptionalRoutes.includes(route)) return true;

        // check if route is general
        if (route.indexOf("/api/general") > -1) return true;

        // get module name from route
        const moduleName = route.split("/")[2].toUpperCase();

        // find module and privilages using "user role" in session
        let module, privilage;

        // find module 
        module = await getRepository(Module).findOne({
            name: moduleName.substring(0, moduleName.length - 1)
        });

        if (!module) {
            // try module name without es
            module = await getRepository(Module).findOne({
                name: moduleName.substring(0, moduleName.length - 2)
            });
        }

        // check if module doesnt exit
        if (!module) {
            throw {
                status: false,
                type: "input",
                msg: `That module (${moduleName}) doesn't exist.`
            }
        }

        try {
            // get privilage for module and role
            privilage = await getRepository(Privilege).findOne({
                moduleId: module.id,
                roleId: session.data.role.id
            });

            // check if user is an admin
            if (!privilage && session.data.role.id == 1) {
                privilage = { permission: "1111" };
            }
        } catch (e) {
            console.log(e);

            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        }


        // check privilage 
        // 0 0 0 0 -> POST GET PUT DELETE (CRUD)
        const permissionDigits = privilage.permission.split("");

        // create permission object
        const permissions = {
            POST: parseInt(permissionDigits[0]),
            GET: parseInt(permissionDigits[1]),
            PUT: parseInt(permissionDigits[2]),
            DELETE: parseInt(permissionDigits[3])
        }

        if (permissions[operationName] == 1) {
            return {
                status: true,
                msg: "You are authorized."
            };
        } else {
            throw {
                status: false,
                type: "perm",
                msg: "You don't have permissions to perform this action!."
            };
        }
    }
}

export default AuthController;