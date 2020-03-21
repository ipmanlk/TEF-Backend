require("dotenv").config();

import { User } from "../entity/User";
import { Module } from "../entity/Module";
import { Privilage } from "../entity/Privilage";

import { getRepository, getConnection } from "typeorm";

const crypto = require("crypto");

class AuthController {
    static logIn(session, username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const hashedPass = crypto.createHash("sha512").update(`${password}${process.env.SALT}`).digest("hex");
                const user = await getRepository(User).findOne({
                    where: {
                        username: username
                    },
                    relations: ["role"]
                });

                // if user is not found
                if (user == undefined) {
                    reject({
                        status: false,
                        type: "input",
                        msg: "Unable to find a user with that username!"
                    });
                    return;
                }

                // check password
                if (user.password !== hashedPass) {
                    reject({
                        status: false,
                        type: "input",
                        msg: "Password you provided is wrong!."
                    });
                    return;
                }

                // create session
                session.username = username;
                session.logged = true;
                session.role = user.role

                // resolve promise
                resolve({
                    status: true,
                    msg: "You have been logged in!.",
                    data: user.role
                });

            } catch (e) {
                reject({
                    status: false,
                    type: "server",
                    msg: "Server Error!. Please check console logs."
                });
                console.log(e);
            }
        })
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

    static isAuthorized(session, moduleName, operationName) {
        return new Promise(async (resolve, reject) => {
            try {
                // first check user is logged in
                const isLoggedIn = AuthController.isLoggedIn(session);

                if (!isLoggedIn.status) {
                    reject(isLoggedIn);
                    return;
                }

                // find module 
                const module = await getRepository(Module).findOne({
                    name: moduleName
                });

                // get privilage for module and role
                const privilage = await getRepository(Privilage).findOne({
                    moduleId: module.id,
                    roleId: session.role.id
                });

                // check privilage 
                // 0 0 0 0 -> C R U D
                const permissionDigits = privilage.permission.split("");

                // create permission object
                const permissions = {
                    "CREATE": parseInt(permissionDigits[0]),
                    "READ": parseInt(permissionDigits[1]),
                    "UPDATE": parseInt(permissionDigits[2]),
                    "DELETE": parseInt(permissionDigits[3])
                }

                if (permissions[operationName] == 1) {
                    resolve({
                        status: true,
                        msg: "You are authorized."
                    });

                } else {
                    reject({
                        status: false,
                        type: "perm",
                        msg: "You don't have permissions to perform this action!."
                    });
                }
            } catch (e) {
                console.log(e);
                reject({
                    status: false,
                    type: "server",
                    msg: "Server Error!. Please check console logs."
                });
            }
        });
    }
}

export default AuthController;