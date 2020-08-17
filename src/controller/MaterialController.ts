import { getRepository } from "typeorm";
import { Material } from "../entity/Material";
import { MaterialStatus } from "../entity/MaterialStatus";
import { MaterialDao } from "../dao/MaterialDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { MiscUtil } from "../util/MiscUtil";

export class MaterialController {

    static async get(data) {
        if (data !== undefined && data.id) {
            return this.getOne(data);
        } else {
            return this.search(data);
        }
    }

    private static async getOne({ id }) {
        // search for an entry with given id
        const entry = await getRepository(Material).findOne({
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
        if (entry !== undefined) {
            return {
                status: true,
                data: entry
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
        const entries = await MaterialDao.search(data).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            data: entries
        };
    }

    static async save(data) {
        // check if valid data is given
        await ValidationUtil.validate("MATERIAL", data);


        // generate material code
        const lastEntry = await getRepository(Material).findOne({
            select: ["id", "code"],
            order: { id: "DESC" }
        });

        // set code for new material
        if (lastEntry) {
            data.code = MiscUtil.getNextNumber("MAT", lastEntry.code, 5);
        } else {
            data.code = MiscUtil.getNextNumber("MAT", undefined, 5);
        }

        const entry = await getRepository(Material).save(data).catch(e => {
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
            data: { code: entry.code },
            msg: "That entry has been added!"
        };
    }

    static async update(data) {
        // check if valid data is given
        await ValidationUtil.validate("MATERIAL", data);

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(Material).findOne(data.id).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!selectedEntry) {
            throw {
                status: false,
                type: "input",
                msg: "That entry doesn't exist in our database!."
            }
        }

        // update material
        await getRepository(Material).save(data).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That entry has been updated!"
        };
    }

    static async delete({ id }) {
        // find entry with the given id
        const entry = await getRepository(Material).findOne({ id: id }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!entry) {
            throw {
                status: false,
                type: "input",
                msg: "That entry doesn't exist in our database!."
            }
        }

        // find deleted status
        const deletedStatus = await getRepository(MaterialStatus).findOne({ name: "Deleted" }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        // if there is no status called deleted
        if (!deletedStatus) {
            throw {
                status: false,
                type: "server",
                msg: "Deleted status doesn't exist in the database!."
            }
        }

        // set status to delete
        entry.materialStatus = deletedStatus;

        await getRepository(Material).save(entry).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That material has been deleted!"
        };
    }
}