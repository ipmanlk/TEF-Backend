import { RoleDao } from "../dao/RoleDao";

class RoleController {
    static async get(data) {
        return this.search(data);
    }

    private static async search(data) {
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
}

export default RoleController;