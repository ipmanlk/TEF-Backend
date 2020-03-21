require("dotenv").config();

import { User } from "../entity/User";
import { Module } from "../entity/Module";
import { Privilage } from "../entity/Privilage";

import { getRepository, getConnection } from "typeorm";

const crypto = require("crypto");

class AuthController {
    static async logIn(session, { username, password }) {

        // create hashed password using salt in .env
        const hashedPass = crypto.createHash("sha512").update(`${password}${process.env.SALT}`).digest("hex");

        // find user with the given username
        let user;
        try {
            user = await getRepository(User).findOne({
                where: {
                    username: username
                },
                relations: ["role"]
            });
        } catch (e) {
            console.log(e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        }

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
        session.username = username;
        session.logged = true;
        session.role = user.role

        // return login success msg and user role name
        return {
            status: true,
            msg: "You have been logged in!.",
            data: user.role
        }
    }

    static isLoggedIn(session) {
        if (session.logged == true && session.username !== undefined) {
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
        if (session.logged == true && session.username !== undefined) {
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

    static async isAuthorized(session, moduleName, operationName) {

        // first check if user is logged in
        const isLoggedIn = AuthController.isLoggedIn(session);

        if (!isLoggedIn.status) {
            throw isLoggedIn;
        }

        // find module and privilages using "user role" in session
        let module, privilage;

        try {
            // find module 
            module = await getRepository(Module).findOne({
                name: moduleName
            });

            // get privilage for module and role
            privilage = await getRepository(Privilage).findOne({
                moduleId: module.id,
                roleId: session.role.id
            });

        } catch (e) {
            console.log(e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        }


        // check privilage 
        // 0 0 0 0 -> C R U D
        const permissionDigits = privilage.permission.split("");

        // create permission object
        const permissions = {
            CREATE: parseInt(permissionDigits[0]),
            READ: parseInt(permissionDigits[1]),
            UPDATE: parseInt(permissionDigits[2]),
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