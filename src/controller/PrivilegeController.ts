import { PrivilegeDao } from "../dao/PrivilegeDao";
import { getRepository } from "typeorm";
import { Role } from "../entity/Role";
import { Privilege } from "../entity/Privilege";

export class PrivilegeController {
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
            relations: ["privileges", "privileges.module"],
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
                msg: "Unable to find an user with that id."
            };
        }
    }

    private static async search(data = {}) {
        const roles = await PrivilegeDao.search(data).catch(e => {
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
        try {
            // check if previleges are empty
            if (data.privileges.length == 0) {
                return {
                    status: false,
                    type: "input",
                    msg: "You need to provide at least one privilege!."
                }
            }

            // delete exisiting privileges to avoid conflict
            for (let p of data.privileges) {
                const privilege = await getRepository(Privilege).findOne({ roleId: p.roleId, moduleId: p.moduleId });
                if (!privilege) continue;
                await getRepository(Privilege).delete(privilege);
            }

            // insert privileges
            for (let p of data.privileges) {
                let privilege = new Privilege();
                privilege.moduleId = p.moduleId;
                privilege.roleId = p.roleId;
                privilege.permission = p.permission;
                await getRepository(Privilege).save(privilege);
            }

            return {
                status: true,
                msg: "Privileges has been updated!"
            };
        } catch (e) {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }
    }

    static async update(data) {
        try {
            // check if previleges are empty
            if (data.privileges.length == 0) {
                await PrivilegeDao.delete(data.roleId);
            }

            // delete exisiting privileges to avoid conflict
            for (let p of data.privileges) {
                const privilege = await getRepository(Privilege).findOne({ roleId: p.roleId, moduleId: p.moduleId });
                if (!privilege) continue;
                await getRepository(Privilege).delete(privilege);
            }

            // insert privileges
            for (let p of data.privileges) {
                let privilege = new Privilege();
                privilege.moduleId = p.moduleId;
                privilege.roleId = p.roleId;
                privilege.permission = p.permission;
                await getRepository(Privilege).save(privilege);
            }

            return {
                status: true,
                msg: "Privileges has been updated!"
            };
        } catch (e) {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }
    }
}