require("dotenv").config();

import { ProfileDao } from "../dao/ProfileDao";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { ValidationUtil } from "../util/ValidationUtil";
import { createHash } from "crypto";
import { UserRole } from "../entity/UserRole";

export class ProfileController {
    static async getOne(session) {
        const profileData = await ProfileDao.getOne(session.data.userId).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        // build an object with module name and privileges 
        const modulePermission = {};

        const convertToFourDigitBinary = (binaryString: string) => {
            if (binaryString == "1") return "1111";
            let newString = binaryString;
            for (let i = binaryString.length; i < 4; i++) {
                newString = "0".concat(newString);
            }
            return newString;
        }

        profileData.userRoles.forEach(userRole => {
            userRole.role.privileges.forEach(rp => {
                const moduleName = rp.module.name;
                if (modulePermission[rp.module.name]) {
                    const currentPermission = modulePermission[moduleName];
                    const newPermission = rp.permission;

                    // OR current permission with new one
                    let newPermissionInt = parseInt(currentPermission, 2) | parseInt(newPermission, 2);
                    let newPermissionStr = newPermissionInt.toString(2);

                    modulePermission[rp.module.name] = convertToFourDigitBinary(newPermissionStr);

                } else {

                    modulePermission[rp.module.name] = rp.permission;
                }
            });
        });

        // delete useless stuff from userRoles
        const newUserRoles = profileData.userRoles.map(ur => {
            return {
                id: ur.role.id,
                name: ur.role.name
            }
        });

        delete profileData.userRoles;

        // remove types from profile
        const profile = profileData as any;

        // add new user roles array
        profile.userRoles = newUserRoles;

        // add privileges
        profile.privileges = modulePermission;

        return {
            status: true,
            data: profile
        };
    }

    static async updatePassword(data, session) {
        // check session 
        if (process.env.PRODUCTION == "true") {
            if (session.data.userId !== data.id) {
                throw {
                    status: false,
                    type: "input",
                    msg: "Provided user id is different from the active session!."
                }
            }
        }

        // validate new passwrd
        await ValidationUtil.validate("USER", { password: data.password });
        await ValidationUtil.validate("USER", { password: data.oldPassword });

        const user = await getRepository(User).findOne(data.id);

        // check if user exists with given id
        if (!user) {
            throw {
                status: false,
                type: "input",
                msg: "User with that id doesn't exist!."
            }
        }

        // check old password
        const oldPasswordHash = createHash("sha512").update(`${data.oldPassword}${process.env.SALT}`).digest("hex");

        if (user.password != oldPasswordHash) {
            throw {
                status: false,
                type: "input",
                msg: "Provided old password is invalid!"
            }
        }

        // update password
        user.password = createHash("sha512").update(`${data.password}${process.env.SALT}`).digest("hex");

        await getRepository(User).save(user).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "Password has been updated!"
        }
    }
}