require("dotenv").config();

import { getRepository } from "typeorm";
import { Role } from "../entity/Role";
import { RoleDao } from "../dao/RoleDao";
import { ValidationUtil } from "../util/ValidationUtil";

class RoleController {
    static async get(data) {
        if (data !== undefined && data.id) {
            return this.getOne(data);
        } else {
            return this.search(data);
        }
    }

    private static async getOne({ id }) {
        // search for an entry with given id
        const role = await getRepository(Role).findOne({
            where: { id: id }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // check if entry exists
        if (role !== undefined) {
            return {
                status: true,
                data: role
            };
        } else {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find an entry with that id."
            };
        }
    }

    private static async search(data = {}) {
        const roles = await RoleDao.search(data).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            data: roles
        };
    }

    static async save(data) {
        // create role object
        const role = data as Role;

        // check if valid data is given
        await ValidationUtil.validate("ROLE", role);

        await getRepository(Role).save(role).catch(e => {
            console.log(e.code, e);

            if (e.code == "ER_DUP_ENTRY") {
                throw {
                    status: false,
                    type: "input",
                    msg: "Entry already exists!."
                }
            }
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That role has been added!"
        };
    }

    static async update(data) {
        // create user object
        const editedRole = data as Role;

        // check if valid data is given
        await ValidationUtil.validate("ROLE", editedRole);

        // check if role is present with the given id
        const selectedRole = await getRepository(Role).findOne(editedRole.id).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!selectedRole) {
            throw {
                status: false,
                type: "input",
                msg: "That role doesn't exist in our database!."
            }
        }

        // update the role
        await getRepository(Role).save(editedRole).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That role has been updated!"
        };
    }

    static async delete({ id }) {
        // find role with the given id
        const role = await getRepository(Role).findOne({ id: id }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!role) {
            throw {
                status: false,
                type: "input",
                msg: "That role doesn't exist in our database!."
            }
        }

        // delete the user
        await getRepository(Role).delete(role).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That role has been deleted!"
        };
    }
}

export default RoleController;