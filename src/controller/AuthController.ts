require("dotenv").config();

import { User } from "../entity/User";
import { Module } from "../entity/Module";
import { Privilege } from "../entity/Privilege";

import { getRepository } from "typeorm";

const crypto = require("crypto");

export class AuthController {
    static async logIn(session, { username, password }) {

        // create hashed password using salt in .env
        const hashedPass = crypto.createHash("sha512").update(`${password}${process.env.SALT}`).digest("hex");

        // find user with the given username
        const user = await getRepository(User).findOne({
            where: {
                username: username
            },
            relations: ["userRoles", "userStatus"]
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

        // check user is suspended
        if (user.userStatus.name == "Suspended") {
            throw {
                status: false,
                type: "input",
                msg: "Your user account is currently suspended!"
            };
        }

        // check user is deleted
        if (user.userStatus.name == "Deleted") {
            throw {
                status: false,
                type: "input",
                msg: "Your user account doesn't exist!"
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
        session.data = {
            username: username,
            logged: true,
            userRoles: user.userRoles,
            userId: user.id,
            employeeId: user.employeeId
        };

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

    static async logOut(session) {
        if (session.data.logged == true) {
            session.destroy();
            return {
                status: true,
                msg: "You have been logged out."
            }
        } else {
            throw {
                status: false,
                type: "auth",
                msg: "You must login first!."
            }
        }
    }

    static async isAuthorized(req, loginOnly = true, moduleName = null) {

        const session = req.session;
        const operationName = req.method;

        // first check if user is logged in
        const isLoggedIn = AuthController.isLoggedIn(session);

        if (!isLoggedIn.status) {
            throw isLoggedIn;
        }

        // check if this is a loginOnly route (no role permissions)
        if (loginOnly) return isLoggedIn;

        // find privilages for roles user have
        let module;

        // find module 
        module = await getRepository(Module).findOne({
            name: moduleName
        });

        // check if module doesnt exit
        if (!module) {
            throw {
                status: false,
                type: "input",
                msg: `That module (${moduleName}) doesn't exist.`
            }
        }

        // store privileges for roles user have
        const rolePrivileges = [];


        for (let role of session.data.userRoles) {
            let privilage = await getRepository(Privilege).findOne({
                moduleId: module.id,
                roleId: role.roleId
            });

            // check if record exists before pushing
            if (privilage !== undefined) rolePrivileges.push(privilage);
        }



        // permisison for current module
        let permission = null;

        const convertToFourDigitBinary = (binaryString: string) => {
            if (binaryString == "1") return "1111";
            let newString = binaryString;
            for (let i = binaryString.length; i < 4; i++) {
                newString = "0".concat(newString);
            }
            return newString;
        }

        // check if user is an admin
        let filteredRoles = session.data.userRoles.filter(role => role.roleId == 1);

        // if user is not an admin and has no access to the module
        if (filteredRoles.length == 0 && rolePrivileges.length == 0) {
            throw {
                status: false,
                type: "perm",
                msg: "You don't have permissions to perform this action!."
            };
        }

        // if user is an admin or has some access to the module
        if (filteredRoles.length == 1) {
            permission = "1111";
        } else {
            // merge those previleges and get permission for current module
            rolePrivileges.forEach(rp => {
                if (permission !== null) {
                    const currentPermission = permission;
                    // OR current permission with new one
                    let newPermissionInt = parseInt(currentPermission, 2) | parseInt(rp.permission, 2);
                    let newPermissionStr = newPermissionInt.toString(2);
                    permission = convertToFourDigitBinary(newPermissionStr);

                } else {
                    permission = rp.permission;
                }
            });
        }

        // check privilage 
        // 0 0 0 0 -> POST GET PUT DELETE (CRUD)
        const permissionDigits = permission.split("");

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