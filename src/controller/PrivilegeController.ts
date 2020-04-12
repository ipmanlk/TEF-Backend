import { PrivilegeDao } from "../dao/PrivilegeDao";
import { getRepository } from "typeorm";
import { Role } from "../entity/Role";

class PrivilegeController {
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
            relations: ["privilages", "privilages.module"],
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

    static async delete({ id }) {
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

export default PrivilegeController;