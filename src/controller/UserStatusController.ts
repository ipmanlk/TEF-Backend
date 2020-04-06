import { getManager } from "typeorm";
import { UserStatus } from "../entity/UserStatus";

class UserStatusController {
    static async getAll() {
        const userStatuses = await getManager().find(UserStatus).catch(e => {
            console.log(e.code, e);
            throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
        });

        return {
			status: true,
			data: userStatuses
		};
    }
}

export default UserStatusController;